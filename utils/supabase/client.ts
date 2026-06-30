import { createBrowserClient } from '@supabase/ssr';

// During CI builds / static prerendering the NEXT_PUBLIC_SUPABASE_* env vars
// may be absent. createBrowserClient throws if URL/key are missing, which
// breaks `next build`. Fall back to harmless placeholders so client creation
// never throws at build time. Real values are always injected at runtime
// (browser + Vercel server), where actual queries run.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

export const createClient = () => createBrowserClient(supabaseUrl, supabaseKey);
