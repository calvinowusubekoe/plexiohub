import { createClient } from '@supabase/supabase-js';
import { supabaseAnonKey, supabaseUrl } from './env';

/** Cookie-less anon client for public reads, so public pages stay statically cacheable. */
export function createPublicClient() {
  return createClient(supabaseUrl, supabaseAnonKey, { auth: { persistSession: false } });
}
