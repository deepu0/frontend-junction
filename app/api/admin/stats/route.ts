import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // 1. Check if user is logged in
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Check for Admin role (Hardcoded for current MVP, same as session-provider)
    const isAdmin = session.user.email === 'deepaksharma834@gmail.com';
    if (!isAdmin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

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
    console.error('[AdminStatsAPI] Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
