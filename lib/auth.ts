import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createServerSupabase } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/config";
export type AuthContext = { supabase: SupabaseClient | null; user: User | null; role: "admin" | "client" | null };
export async function getAuthContext(): Promise<AuthContext> {
  if (!isSupabaseConfigured()) return { supabase: null, user: null, role: null };
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { supabase, user: null, role: null };
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).maybeSingle();
  return { supabase, user, role: data?.role === "admin" || data?.role === "client" ? data.role : null };
}
export async function requireAdmin() {
  const ctx = await getAuthContext();
  if (!ctx.user) redirect("/login?next=/admin");
  if (ctx.role !== "admin") redirect("/access-pending");
  return { supabase: ctx.supabase!, user: ctx.user };
}
export async function requireClient() {
  const ctx = await getAuthContext();
  if (!ctx.user) redirect("/login?next=/portal");
  if (ctx.role !== "client") redirect("/access-pending");
  return { supabase: ctx.supabase!, user: ctx.user };
}
