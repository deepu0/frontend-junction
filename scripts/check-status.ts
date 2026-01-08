import { createClient } from '@supabase/supabase-js';
import * as path from 'path';
import { config } from 'dotenv';
config({ path: path.join(process.cwd(), '.env.local') });

async function check() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  const { data: scraped, count: scrapedCount } = await supabase
    .from('scraped_experiences')
    .select('*', { count: 'exact' });
  const { data: processed, count: processedCount } = await supabase
    .from('scraped_experiences')
    .select('*', { count: 'exact' })
    .eq('ai_processed', true);

  console.log('Total in Database:', scrapedCount);
  console.log('Processed by AI:', processedCount);

  if (processed && processed.length > 0) {
    console.log('\n--- Latest 3 Processed Samples ---');
    processed.slice(-3).forEach((p) => {
      console.log(`Title: ${p.title}`);
      console.log(`Company: ${p.company}`);
      console.log(`Summary: ${p.summary}`);
      console.log('---');
    });
  }
}
check();
