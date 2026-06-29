import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import seedData from '@/data/seed-experiences.json';

/**
 * One-time seed endpoint — 50 complete interview experiences with full content.
 * Each entry has: title, author, tags, summary, formatted_content (full HTML article body).
 *
 * POST /api/seed-experiences
 * Header: Authorization: Bearer <CRON_SECRET>
 *
 * After seeding, delete this route + data/seed-experiences.json.
 */
export async function POST(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  );

  const results = { inserted: 0, skipped: 0, errors: [] as string[] };

  const upsertResults = await Promise.allSettled(
    seedData.map((exp) =>
      supabaseAdmin.from('scraped_experiences').upsert(
        {
          title: (exp as any).title,
          original_url: (exp as any).original_url,
          source: (exp as any).source,
          author: (exp as any).author,
          published_at: (exp as any).published_at || new Date().toISOString(),
          tags: (exp as any).tags || [],
          summary: (exp as any).summary || '',
          formatted_content: (exp as any).formatted_content || '',
          slug: (exp as any).slug || '',
          metadata: {},
          status: 'approved',
          ai_processed: true,
        },
        { onConflict: 'original_url', ignoreDuplicates: false }
      )
    )
  );

  for (let i = 0; i < upsertResults.length; i++) {
    const result = upsertResults[i];
    if (result.status === 'rejected') {
      results.errors.push(
        `${(seedData[i] as any).title}: ${result.reason?.message ?? result.reason}`
      );
    } else if (result.value.error) {
      results.errors.push(
        `${(seedData[i] as any).title}: ${result.value.error.message}`
      );
    } else {
      results.inserted++;
    }
  }

  return NextResponse.json({
    message: `Seeded ${results.inserted} complete experiences (${results.errors.length} errors)`,
    total_in_file: seedData.length,
    ...results,
  });
}
