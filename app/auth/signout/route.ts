import { createClient } from '@/lib/server';
import { revalidatePath } from 'next/cache';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  return NextResponse.redirect(new URL('/', req.url), {
    status: 302,
  });
}
