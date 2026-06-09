import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import seedData from '@/data/seed-experiences.json';

/**
 * One-time seed endpoint to insert 49 scraped interview experiences.
 * Requires CRON_SECRET auth and SUPABASE_SERVICE_ROLE_KEY.
 *
 * Usage: POST /api/seed-experiences
 * Header: Authorization: Bearer <CRON_SECRET>
 *
 * After running successfully, you can delete this route.
 */
export async function POST(request: Request) {
  // Auth check
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const results = { inserted: 0, skipped: 0, errors: [] as string[] };

  for (const exp of seedData) {
    const { error } = await supabaseAdmin
      .from('scraped_experiences')
      .upsert(
        {
          title: exp.title,
          original_url: exp.original_url,
          source: exp.source,
          author: exp.author,
          published_at: exp.published_at || new Date().toISOString(),
          tags: exp.tags || [],
          summary: exp.summary || '',
          metadata: {},
          status: 'approved',
        },
        { onConflict: 'original_url', ignoreDuplicates: true }
      );

    if (error) {
      results.errors.push(`${exp.title}: ${error.message}`);
    } else {
      results.inserted++;
    }
  }

  return NextResponse.json({
    message: `Seeded ${results.inserted} experiences (${results.errors.length} errors)`,
    total_in_file: seedData.length,
    ...results,
  });
}
