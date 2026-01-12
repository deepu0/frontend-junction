import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

/**
 * NOTE: Administrative operations using SUPABASE_SERVICE_ROLE_KEY
 * MUST only be performed in server-side code (API routes or Sever Actions).
 * NEVER prefix service role keys with NEXT_PUBLIC_.
 */
