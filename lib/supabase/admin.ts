import "server-only";
import { createClient } from "@supabase/supabase-js";
import { hasServiceKey, isSupabaseConfigured } from "@/lib/config";
export function createServiceSupabase() {
  if (!isSupabaseConfigured() || !hasServiceKey()) throw new Error("Server-side Supabase service key is not configured");
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}
