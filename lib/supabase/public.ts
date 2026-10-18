import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/config";
export function createPublicSupabase() {
  if (!isSupabaseConfigured()) return null;
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
}
