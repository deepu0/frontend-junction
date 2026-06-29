'use server';

import { createClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth';

async function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  if (!url || !serviceKey) throw new Error('Missing admin credentials');
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

async function assertAdmin() {
  await requireAdmin();
}

// Table mapping based on experience type
const TABLE_MAP = {
  user: 'new_interview',
  scraped: 'scraped_experiences',
  legacy: 'experiences',
} as const satisfies Record<string, string>;

export async function deleteExperience(
  rawId: string,
  type: 'user' | 'scraped' | 'legacy'
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();

    const table = TABLE_MAP[type];
    if (!table) throw new Error(`Unknown experience type: ${type}`);

    const supabaseAdmin = await getAdminSupabase();
    const { error } = await supabaseAdmin.from(table).delete().eq('id', rawId);

    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    console.error('[deleteExperience]', err.message);
    return { success: false, error: err.message };
  }
}

export async function updateExperienceDescription(
  rawId: string,
  description: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();
    const supabaseAdmin = await getAdminSupabase();
    const { error } = await supabaseAdmin
      .from('new_interview')
      .update({ description })
      .eq('id', rawId);
    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    console.error('[updateExperienceDescription]', err.message);
    return { success: false, error: err.message };
  }
}

export async function approveExperience(
  rawId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await assertAdmin();

    const supabaseAdmin = await getAdminSupabase();
    const { error } = await supabaseAdmin
      .from('new_interview')
      .update({ approval_status: 'accepted' })
      .eq('id', rawId);

    if (error) throw error;

    return { success: true };
  } catch (err: any) {
    console.error('[approveExperience]', err.message);
    return { success: false, error: err.message };
  }
}
