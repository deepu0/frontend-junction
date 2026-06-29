'use client';

import { createClient } from '@/utils/supabase/client';

let browserClient: ReturnType<typeof createClient> | null = null;

/**
 * @deprecated Use `createClient` from `@/utils/supabase/client` directly.
 */
export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient();
  }
  return browserClient;
}
