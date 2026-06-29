import { NextResponse } from 'next/server';
import { getAuthState } from '@/lib/auth';

// Never cache — this reflects per-request session state.
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const { isAdmin, role } = await getAuthState();
  return NextResponse.json(
    { isAdmin, role: role ?? null },
    { headers: { 'Cache-Control': 'no-store, max-age=0' } }
  );
}
