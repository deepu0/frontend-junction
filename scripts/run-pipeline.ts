import { createClient } from '@supabase/supabase-js';
import { MediumSource } from '../lib/content-pipeline/sources/medium';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function main() {
  console.log('Starting Manual Pipeline Run for Medium...');

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const source = new MediumSource();

  try {
    console.log('Fetching articles...');
    // Increased limit to 50 to get a good pool before strict filtering
    const articles = await source.fetchArticles(50);
    console.log(`Fetched ${articles.length} articles passing strict filters.`);

    if (articles.length === 0) {
      console.log('No articles found matching strict filters. Exiting.');
      return;
    }

    console.log('Saving to Supabase...');
    const results = await Promise.allSettled(
      articles.map(async (article) => {
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
              status: 'approved', // Auto-approve
            },
            { onConflict: 'original_url', ignoreDuplicates: true }
          );

        if (error) throw error;
        return true;
      })
    );

    const successCount = results.filter((r) => r.status === 'fulfilled').length;
    console.log(`Successfully saved ${successCount} articles to DB.`);

    // Log titles for verification
    articles.forEach((a) => console.log(`- Saved: ${a.title}`));
  } catch (error) {
    console.error('Pipeline Error:', error);
    process.exit(1);
  }
}

main();
