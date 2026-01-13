import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const revalidate = 3600; // Cache for 1 hour

export async function GET() {
    try {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            return NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 }
            );
        }

        // Use service role key to bypass RLS for aggregate counts
        const supabaseAdmin = createClient(url, key);

        const [
            { count: expCount },
            { count: newCount },
            { count: scrapedCount },
            { count: userCount },
            { data: c1 },
            { data: c2 },
            { data: c3 },
        ] = await Promise.all([
            // 1. Stories Counts
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

            // 2. Member Count
            supabaseAdmin.from('users').select('*', { count: 'exact', head: true }),

            // 3. Unique Companies Data
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

        // Calculate Totals
        const totalStories =
            (expCount || 0) + (newCount || 0) + (scrapedCount || 0);

        // Calculate Unique Companies
        const companySet = new Set<string>();
        c1?.forEach((i: any) => i.company_name && companySet.add(i.company_name));
        c2?.forEach((i: any) => i.company && companySet.add(i.company));
        c3?.forEach((i: any) => i.company && companySet.add(i.company));

        return NextResponse.json({
            stories: totalStories,
            companies: companySet.size,
            members: userCount || 0,
        });
    } catch (error: any) {
        console.error('[PublicStatsAPI] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
