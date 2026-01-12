export const dynamic = 'force-dynamic';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { LeetCodeSource } from '@/lib/content-pipeline/sources/leetcode';
import { MediumSource } from '@/lib/content-pipeline/sources/medium';
import { DevToSource } from '@/lib/content-pipeline/sources/devto';
import { TelegramSource } from '@/lib/content-pipeline/sources/telegram';
import { HashnodeSource } from '@/lib/content-pipeline/sources/hashnode';
import { ScrapedArticle } from '@/lib/content-pipeline/types';

export async function GET(request: Request) {
  // Security: Check for a secret token OR an admin session
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  const cronSecret = process.env.CRON_SECRET;

  const cookieStore = cookies();
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

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const isAdmin = session?.user.email === 'deepaksharma834@gmail.com';

  const isAuthorized = (cronSecret && token === cronSecret) || isAdmin;

  if (!isAuthorized) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sources = [
      // new LeetCodeSource(), // LeetCode is currently blocked by Cloudflare
      new MediumSource(),
      new DevToSource(),
      new TelegramSource(),
      new HashnodeSource(),
    ];
    const allArticles: ScrapedArticle[] = [];

    // 1. Fetch from all sources
    for (const source of sources) {
      console.log(`[Pipeline] Fetching from ${source.name}...`);
      const articles = await source.fetchArticles(50); // Fetches 50 from each source
      console.log(`[Pipeline] Got ${articles.length} from ${source.name}`);
      allArticles.push(...articles);
    }

    // 2. Save to Database
    const results = await Promise.allSettled(
      allArticles.map(async (article) => {
        // Upsert based on original_url?
        // schema: original_url TEXT UNIQUE NOT NULL

        // For user-facing operations (respects RLS, checks auth)
        const cookieStore = cookies();
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

        // For admin operations (bypasses RLS) - Insert content
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
    const errors = results
      .filter((r) => r.status === 'rejected')
      .map((r) => (r as PromiseRejectedResult).reason.message);

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
