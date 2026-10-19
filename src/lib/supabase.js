import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://lhfroegebpddmjgnwdvk.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoZnJvZWdlYnBkZG1qZ253ZHZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI0MTI5OTAsImV4cCI6MjEwNzk4ODk5MH0.BhbLNlcgWyfb6kdiA7crcZHEeoUeE7MQEBb-7RRna4s";

export const isSupabaseConfigured = Boolean(
  supabaseUrl && supabaseAnonKey && supabaseAnonKey !== "your_supabase_anon_key_here"
);

// Browser & Server Safe Supabase Client
export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Server-side privileged client using Service Role key (if provided)
 * Bypasses RLS for secure backend administrative tasks
 */
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
export const supabaseAdmin = Boolean(supabaseUrl && supabaseServiceRoleKey)
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : supabase;
