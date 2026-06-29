import { NextResponse } from 'next/server';
import { requireAdmin, AuthError } from '@/lib/auth';

export async function GET() {
  try {
    // Consistent admin gate (dual rule, verified user)
    await requireAdmin();

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!url || !key) {
      return NextResponse.json(
        { error: 'Missing admin credentials' },
        { status: 500 }
      );
    }

    const { createClient } = await import('@supabase/supabase-js');
    const supabaseAdmin = createClient(url, key);

    const [
      { count: expCount },
      { count: newCount },
      { count: scrapedCount },
      { count: userCount },
      { count: offersCount },
      { data: c1 },
      { data: c2 },
      { data: c3 },
    ] = await Promise.all([
      supabaseAdmin
        .from('experiences')
        .select('*', { count: 'exact', head: true })
        .eq('verification_status', 'approved'),
      supabaseAdmin
        .from('new_interview')
        .select('*', { count: 'exact', head: true }),
      supabaseAdmin
        .from('scraped_experiences')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved'),
      supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),
      supabaseAdmin
        .from('new_interview')
        .select('*', { count: 'exact', head: true })
        .eq('offer_status', 'accepted'),
      supabaseAdmin
        .from('experiences')
        .select('company_name')
        .eq('verification_status', 'approved'),
      supabaseAdmin.from('new_interview').select('company'),
      supabaseAdmin
        .from('scraped_experiences')
        .select('company')
        .eq('status', 'approved'),
    ]);

    const totalStories =
      (expCount || 0) + (newCount || 0) + (scrapedCount || 0);

    const companySet = new Set<string>();
    c1?.forEach((i: any) => i.company_name && companySet.add(i.company_name));
    c2?.forEach((i: any) => i.company && companySet.add(i.company));
    c3?.forEach((i: any) => i.company && companySet.add(i.company));

    let successRate = '85%';
    if (newCount && newCount > 0 && offersCount) {
      const rate = Math.round((offersCount / newCount) * 100);
      if (rate > 0) successRate = `${rate}%`;
    }

    return NextResponse.json({
      stories: totalStories,
      companies: companySet.size,
      members: userCount || 0,
      successRate,
    });
  } catch (error: any) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('[AdminStatsAPI] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
