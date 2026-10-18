export function isSupabaseConfigured() { return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY); }
export function hasServiceKey() { return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY); }
export function siteUrl() { return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"; }
export const CONFIG_MESSAGE = "Database-backed features are not configured yet. Add the Supabase values from .env.example. No data was saved.";
