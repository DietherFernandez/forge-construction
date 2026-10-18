begin;
-- Reassignment revokes previous client access within the project update transaction.
create or replace function public.sync_project_memberships() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 delete from public.project_memberships where project_id=new.id;
 if new.client_id is not null then
  insert into public.project_memberships(project_id,user_id)
  select new.id,cm.user_id from public.client_memberships cm where cm.client_id=new.client_id
  on conflict do nothing;
 end if;
 return new;
end $$;
-- Authorize from the current client assignment, even if historical rows exist.
create or replace function public.is_project_member(p_project_id uuid) returns boolean
language sql stable security definer set search_path=public,auth as $$
 select public.has_client_role() and exists(
  select 1 from public.projects p join public.client_memberships cm on cm.client_id=p.client_id
  where p.id=p_project_id and cm.user_id=auth.uid()
 )
$$;
create or replace function public.sync_client_projects() returns trigger
language plpgsql security definer set search_path=public as $$
begin
 delete from public.project_memberships pm where not exists(
  select 1 from public.projects p join public.client_memberships cm on cm.client_id=p.client_id
  where p.id=pm.project_id and cm.user_id=pm.user_id
 );
 insert into public.project_memberships(project_id,user_id)
 select p.id,cm.user_id from public.projects p join public.client_memberships cm on cm.client_id=p.client_id
 on conflict do nothing;
 return coalesce(new,old);
end $$;
drop trigger if exists client_membership_sync on public.client_memberships;
create trigger client_membership_sync after insert or update or delete on public.client_memberships
for each row execute function public.sync_client_projects();
-- Reconcile assignments created before this migration.
delete from public.project_memberships pm where not exists(
 select 1 from public.projects p join public.client_memberships cm on cm.client_id=p.client_id
 where p.id=pm.project_id and cm.user_id=pm.user_id
);
insert into public.project_memberships(project_id,user_id)
select p.id,cm.user_id from public.projects p join public.client_memberships cm on cm.client_id=p.client_id
on conflict do nothing;
-- Override broad default grants that may exist in hosted Supabase projects.
revoke all on public.profiles,public.user_roles,public.inquiries,public.inquiry_notes,
 public.clients,public.client_memberships,public.projects,public.project_memberships,
 public.milestones,public.project_updates,public.project_internal_notes,public.project_photos,
 public.project_documents,public.quotations,public.quotation_items,public.company_settings,
 public.activity_logs,public.submission_rate_limits from anon;
revoke insert,update,delete on public.user_roles from authenticated;
revoke insert,update,delete on public.profiles from authenticated;
grant update(display_name,phone) on public.profiles to authenticated;
revoke all on public.submission_rate_limits from authenticated;
-- RLS still determines which authenticated users can read these tables.
grant select on public.inquiries,public.project_internal_notes to authenticated;
create or replace function public.save_quotation_draft(p_quotation_id uuid,p_quote jsonb,p_items jsonb) returns uuid language plpgsql security definer set search_path=public,auth as $$ declare qid uuid; qno text; rev integer; old public.quotations%rowtype; v_subtotal numeric(16,2):=0; disc numeric(16,2); rate numeric(7,4); taxable numeric(16,2); tax numeric(16,2); total numeric(16,2); item jsonb; qty numeric(12,3); price numeric(16,2); amount numeric(16,2); begin if not public.is_admin() then raise exception 'ADMIN_REQUIRED'; end if; if jsonb_typeof(p_items)<>'array' or jsonb_array_length(p_items)<1 or jsonb_array_length(p_items)>100 then raise exception 'INVALID_ITEMS'; end if; if p_quotation_id is not null then select * into old from public.quotations where id=p_quotation_id for update; if not found or old.status<>'draft' then raise exception 'ONLY_DRAFTS_CAN_BE_EDITED'; end if; qid=old.id;qno=old.quotation_number;rev=old.revision; else qid=gen_random_uuid(); qno=nullif(trim(p_quote->>'quotation_number'),''); if qno is null then qno='FORGE-Q-'||to_char(now(),'YYYY')||'-'||lpad(nextval('public.quotation_number_seq')::text,6,'0'); end if; select coalesce(max(revision),0)+1 into rev from public.quotations where quotation_number=qno; end if; disc=coalesce(nullif(p_quote->>'discount_amount','')::numeric,0);rate=coalesce(nullif(p_quote->>'tax_rate_percent','')::numeric,0);if disc<0 or rate<0 or rate>100 then raise exception 'INVALID_DISCOUNT_OR_TAX'; end if; for item in select * from jsonb_array_elements(p_items) loop if item->>'category' not in ('Materials','Labor','Equipment','Other') then raise exception 'INVALID_ITEM_CATEGORY'; end if; qty=(item->>'quantity')::numeric;price=(item->>'unit_price')::numeric;if qty<=0 or price<0 then raise exception 'INVALID_QUANTITY_OR_PRICE'; end if;amount=round(qty*price,2);v_subtotal=v_subtotal+amount;end loop;v_subtotal=round(v_subtotal,2);if disc>v_subtotal then raise exception 'DISCOUNT_EXCEEDS_SUBTOTAL'; end if;if rate>0 and coalesce(trim(p_quote->>'tax_label'),'')='' then raise exception 'TAX_LABEL_REQUIRED'; end if;taxable=v_subtotal-disc;tax=round(taxable*rate/100,2);total=taxable+tax; if p_quotation_id is null then insert into public.quotations(id,quotation_number,revision,client_id,inquiry_id,project_id,status,currency,valid_until,scope_of_work,terms,notes_visible_to_client,subtotal,discount_amount,tax_label,tax_rate_percent,tax_amount,grand_total,created_by) values(qid,qno,rev,(p_quote->>'client_id')::uuid,nullif(p_quote->>'inquiry_id','')::uuid,nullif(p_quote->>'project_id','')::uuid,'draft','PHP',nullif(p_quote->>'valid_until','')::date,p_quote->>'scope_of_work',coalesce(p_quote->>'terms',''),coalesce(p_quote->>'notes_visible_to_client',''),v_subtotal,disc,nullif(p_quote->>'tax_label',''),rate,tax,total,auth.uid()); else update public.quotations set valid_until=nullif(p_quote->>'valid_until','')::date,scope_of_work=p_quote->>'scope_of_work',terms=coalesce(p_quote->>'terms',''),notes_visible_to_client=coalesce(p_quote->>'notes_visible_to_client',''),subtotal=v_subtotal,discount_amount=disc,tax_label=nullif(p_quote->>'tax_label',''),tax_rate_percent=rate,tax_amount=tax,grand_total=total where id=qid; delete from public.quotation_items where quotation_id=qid; end if; for item in select * from jsonb_array_elements(p_items) loop qty=(item->>'quantity')::numeric;price=(item->>'unit_price')::numeric;amount=round(qty*price,2);insert into public.quotation_items(quotation_id,category,description,quantity,unit,unit_price,amount,display_order) values(qid,item->>'category',trim(item->>'description'),qty,trim(item->>'unit'),price,amount,coalesce((item->>'display_order')::integer,0));end loop;return qid;end $$;
commit;
