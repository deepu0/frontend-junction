import { createClient } from '@/utils/supabase/client';

/**
 * Lazily-instantiated Supabase browser client.
 *
 * Why a proxy: `createClient()` throws if the Supabase env vars are missing.
 * Creating the client at module-load time breaks `next build` page-data
 * collection in CI (where NEXT_PUBLIC_SUPABASE_* are not set). The proxy
 * defers client creation until the first property access (i.e. real runtime
 * use), so importing this module never throws during build.
 *
 * @deprecated Use `createClient` from `@/utils/supabase/client` directly.
 */
type SupabaseClient = ReturnType<typeof createClient>;

let _client: SupabaseClient | null = null;

const getClient = (): SupabaseClient => {
  if (!_client) {
    _client = createClient();
  }
  return _client;
};

export const supabase = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client as object, prop, receiver);
    // Bind methods to the real client so `this` is preserved.
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
