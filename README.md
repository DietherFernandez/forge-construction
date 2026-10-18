# FORGE Construction — Next.js + Supabase

A single App Router application containing the existing FORGE public site, admin dashboard, and private client portal. The original visual system, local WebP images, favicon, architectural reveal code, and original hero MP4 have been retained. **The repository README describes the included MP4 as 8 seconds; this migration does not relabel it as 15 seconds.**

## Merged landing page and admin

The public homepage comes directly from the GitHub landing page at commit `1320d01cb6bcb5d4190b0abf14c90e15cbebe182`. Its video, artwork, typography, and architectural transitions are retained. Home effects now initialize and clean up with the React component lifecycle rather than a one-time external script. Fonts are bundled locally. The existing root `index.html` and `assets/` are retained as the static reference; Next.js serves the live homepage from `app/page.tsx` and assets from `public/`.

The homepage contact CTA opens `/request-quote`, which uses the database-backed inquiry form. `/login` routes administrators to `/admin` and clients to `/portal` after authentication. Portfolio management publishes to `/projects`; homepage concept cards remain curated static examples.

If this database already has the first two migrations, apply only `202610180003_merge_repairs.sql`. For a new database apply all migrations in order. The new migration revokes outdated project memberships and repairs quotation draft calculations.

Keep your existing `.env.local` when updating your local source. It is intentionally excluded from Git.

## Current scope

- Public home page migrated from the original HTML/CSS and existing motion script; responsive services, about, projects, project details, contact, and request-quote routes.
- Real inquiry endpoint with Zod validation, server-only service key, persisted database writes, idempotency keys, hidden honeypot, and persistent per-key rate limit (5/hour). The API never exposes inquiry reads; a reference is returned only after the database confirms the write.
- Supabase Auth SSR setup, protected admin/client layouts and route handlers, role lookup in `user_roles`, invite flow, account recovery, and access-pending route. No public registration or password provisioning.
- Admin inquiry search/status/notes/conversion, client/project/milestone/update/file management, portfolio/service management, quotation builder and issuance, dashboard counts, and activity log reads.
- Client portal pages for assigned projects, milestones, client-visible updates/photos/documents, issued quotations, exact-revision responses, PDF download, profile details, and password reset.
- SQL migrations include RLS, storage policies, safe auth/profile trigger, idempotent inquiry conversion, decimal `numeric` quote totals, immutable issued quotes, and server-enforced response transitions.
- Existing home concepts stay labeled as concepts; public portfolio pages show database entries only when explicitly published.

## Local setup

1. Use Node.js 24 LTS and npm.
2. Create a Supabase project on a plan you choose; this repository does not create or upgrade billable resources.
3. Copy `.env.example` to `.env.local` and fill in:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (server only; never prefix it with `NEXT_PUBLIC_`)
   - `INQUIRY_RATE_LIMIT_SECRET` (generate with `openssl rand -hex 32`)
   - `NEXT_PUBLIC_SITE_URL`
4. Apply migrations in `supabase/migrations/` in filename order using Supabase CLI (`npx supabase link` then `npx supabase db push`) or the Supabase SQL editor. Do not expose SQL editor credentials.
5. Install and run:

   ```bash
   npm ci
   npm run dev
   ```

6. Verify `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build` before deployment.

With no environment values, the cinematic public home page still renders; data-backed pages show configuration/empty states and inquiry submission returns a clear 503 error instead of a false success.

## Bootstrap the first administrator securely

1. In Supabase Auth, create the first user yourself through the dashboard using an address you control. Do not create a public sign-up page and do not put a password in source code.
2. In the SQL editor, grant the role to that exact Auth user UUID:

   ```sql
   insert into public.user_roles (user_id, role)
   select id, 'admin'::public.app_role
   from auth.users
   where lower(email) = lower('YOUR_CONTROLLED_EMAIL');
   ```

3. Confirm exactly one row was inserted, then sign in at `/login`. `user_roles` has no self-insert/update policy; clients cannot promote themselves. Admin role changes are not exposed in the browser UI.

## Auth, invitations, and email

- Configure the Supabase Auth Site URL and allowed redirect URLs for your exact local/deployment origin, including `/auth/callback?next=/reset-password`.
- Client invites use `auth.admin.inviteUserByEmail` from a server route and link an existing account when a profile with the same email exists. No password is created. The UI distinguishes an invitation request accepted by Supabase from confirmed email delivery.
- External invite/reset delivery depends on Supabase email/SMTP configuration and provider limits. The application does not add a paid mail provider. Check Supabase Auth logs and configure SMTP if needed.
- Role assignment is performed in a database function after the invite API returns a user ID. If invitation succeeds but assignment fails, the route reports that partial state explicitly.

## Storage

Migrations create two **private** buckets: `portfolio-assets` (10 MB, approved image MIME types) and `project-private` (20 MB, image/PDF allowlist). The portfolio bucket is deliberately private rather than a directly public bucket: published portfolio images are readable only when the matching portfolio record is published, via short-lived signed URLs; drafts remain admin-only. Project photos/documents require admin or assigned-client membership plus the metadata visibility flag. The app rejects SVG, HTML, and executable uploads and checks basic file signatures. Upload metadata failure triggers an object cleanup attempt and reports cleanup failure.

## Deployment

Deploy as a Node 24 Next.js application on a free-tier-compatible host without enabling paid resources. Add the five environment values to server/runtime configuration (the service-role key and rate-limit secret must be server-only), set the exact `NEXT_PUBLIC_SITE_URL`, apply database migrations, configure Auth redirect URLs, then run the four verification commands above. Ensure private routes/API responses are not cached; the app marks them dynamic/no-store. Public portfolio/service pages are revalidated periodically.

## Security model and schema notes

- User roles are stored separately from editable Auth metadata. Server layouts and API routes check `auth.getUser()` plus `user_roles`; RLS is the database enforcement layer.
- Inquiry requests use a service-role-only RPC because a public caller must not be able to choose arbitrary rate-limit keys or read submitted rows. A server-secret HMAC of the request network key is used for the persistent rate-limit bucket; raw IPs and request bodies are not stored in activity logs.
- Project internal notes are a separate admin-only table, not a column clients could select. Quote client-visible notes are separate fields.
- `project_memberships` is synchronized when a project is assigned and when a user is linked to a client profile.
- Quotation calculations use integer-cent arithmetic in the UI and PostgreSQL `numeric` on the server. Tax is zero unless explicitly configured with a label/rate. A DB trigger blocks direct changes to issued quotations/items; RPCs enforce issue/response transitions.
- Portfolio images use one isolated private bucket and metadata RLS so a draft file never becomes public merely because it was uploaded. Signed URLs for published records are short-lived.
- `project_photos` and `project_documents` share `project-private` storage but remain separate metadata tables and are independently visibility-checked.

## Checks and limitations

`tests/quote-calculation.test.mjs` covers exact cents, rounding, and invalid totals. `tests/database-security.test.mjs` runs the migrations in an isolated PGlite PostgreSQL engine with test Auth/Storage schemas, checking client isolation, project reassignment, membership deletion, role protection, draft totals, issuance, and quotation immutability. These local checks do not replace testing against a configured Supabase project. `supabase/tests/security_contract.sql` checks core RLS/grant assumptions via `supabase test db`. Full browser/E2E and real cross-client isolation tests require a configured Supabase project, two client accounts, and a browser test runner. No Supabase credentials are included. This source export cannot verify Auth email delivery, database policy behavior against a live project, or deployed browser behavior until configured.

The imported dashboard currently has untyped Supabase row annotations reported as lint warnings; generating database types is a follow-up. Lint errors remain enabled for new code.
