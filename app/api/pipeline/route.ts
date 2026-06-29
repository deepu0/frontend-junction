export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { LeetCodeSource } from '@/lib/content-pipeline/sources/leetcode';
import { MediumSource } from '@/lib/content-pipeline/sources/medium';
import { DevToSource } from '@/lib/content-pipeline/sources/devto';
import { TelegramSource } from '@/lib/content-pipeline/sources/telegram';
import { HashnodeSource } from '@/lib/content-pipeline/sources/hashnode';
import { ScrapedArticle } from '@/lib/content-pipeline/types';
import { getAuthState } from '@/lib/auth';

const sources = [
  // new LeetCodeSource(), // LeetCode is currently blocked by Cloudflare
  new MediumSource(),
  new DevToSource(),
  new TelegramSource(),
  new HashnodeSource(),
];

export async function POST(request: Request) {
  // Authorized by a valid cron token OR an admin session (consistent rule).
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const cronSecret = process.env.CRON_SECRET;

  const hasValidToken = Boolean(cronSecret && token === cronSecret);
  const isAdmin = hasValidToken ? false : (await getAuthState()).isAdmin;
  const isAuthorized = hasValidToken || isAdmin;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const allArticles: ScrapedArticle[] = [];

    // 1. Fetch from all sources in parallel
    const sourceResults = await Promise.all(
      sources.map(async (source) => {
        console.log(`[Pipeline] Fetching from ${source.name}...`);
        const articles = await source.fetchArticles(50);
        console.log(`[Pipeline] Got ${articles.length} from ${source.name}`);
        return articles;
      })
    );
    for (const articles of sourceResults) {
      allArticles.push(...articles);
    }

    // 2. Save to Database
    const results = await Promise.allSettled(
      allArticles.map(async (article) => {
        // Upsert based on original_url (schema: original_url TEXT UNIQUE NOT NULL).
        // Uses the service-role client (bypasses RLS) to insert scraped content.
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY || ''
        );
        // Use supabaseAdmin to bypass RLS
        const { error } = await supabaseAdmin
          .from('scraped_experiences')
          .upsert(
            {
              title: article.title,
              original_url: article.original_url,
              source: article.source,
              author: article.author,
              published_at: article.published_at,
              tags: article.tags || [],
              summary: article.summary,
              metadata: article.metadata,
              status: 'approved', // Auto-approve since we have strict filtering now
            },
            { onConflict: 'original_url', ignoreDuplicates: true }
          );
        // If ignoreDuplicates: true, it won't update existing.
        // If we want to update (e.g. stats), we remove ignoreDuplicates.
        // Let's ignore duplicates to preserve 'status' (don't want to reset approved to pending).

        if (error) {
          throw new Error(
            `[${article.source}] Save Error: ${error.message} (${error.code})`
          );
        }
        return true;
      })
    );

    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    const errors: string[] = [];
    for (const r of results) {
      if (r.status === 'rejected') {
        errors.push((r as PromiseRejectedResult).reason.message);
      }
    }

    return NextResponse.json({
      success: true,
      fetched: allArticles.length,
      saved: successCount,
      errors: errors.slice(0, 3), // Show first 3 errors
      articles: allArticles.map((a) => `${a.source}: ${a.title}`),
      usingServiceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });
  } catch (error: any) {
    console.error('Pipeline Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
