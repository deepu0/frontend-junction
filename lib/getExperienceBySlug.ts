import { createClient } from '@supabase/supabase-js';
import { getExperienceById } from './getExperienceById';

// Derive a human-readable source name from a URL.
function sourceFromUrl(url: string | null, fallback = 'Web'): string {
  if (!url) return fallback;
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    const MAP: Record<string, string> = {
      'medium.com': 'Medium',
      'dev.to': 'DEV Community',
      'hashnode.com': 'Hashnode',
      'substack.com': 'Substack',
      'linkedin.com': 'LinkedIn',
      'github.com': 'GitHub',
      'leetcode.com': 'LeetCode',
      'geeksforgeeks.org': 'GeeksForGeeks',
    };
    for (const [key, label] of Object.entries(MAP)) {
      if (host === key || host.endsWith('.' + key)) return label;
    }
    return host.split('.')[0].replace(/^./, (c) => c.toUpperCase());
  } catch {
    return fallback;
  }
}

export async function getExperienceBySlug(identifierEncoded: string) {
  const identifier = decodeURIComponent(identifierEncoded);
  console.log(`[getExperienceBySlug] Lookup: "${identifier}"`);

  // Use Admin Client to bypass RLS for content fetching
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn(
      `[getExperienceBySlug] Missing Supabase credentials, skipping lookup.`
    );
    return null;
  }

  const supabaseAdmin = createClient(url, key);

  // 1. Check if it's an ID (Legacy/Direct lookup)
  if (
    identifier.startsWith('scraped-') ||
    identifier.startsWith('user-') ||
    identifier.startsWith('exp-')
  ) {
    console.log(
      `[getExperienceBySlug] Detected ID pattern, delegating to getExperienceById`
    );
    return getExperienceById(identifier);
  }

  // 2. Try captured_content (Extension captures — highest quality, checked first)
  const { data: capturedData, error: capturedError } = await supabaseAdmin
    .from('captured_content')
    .select('*')
    .eq('slug', identifier)
    .eq('status', 'published')
    .single();

  if (capturedError && capturedError.code !== 'PGRST116') {
    console.error(`[getExperienceBySlug] Captured Error:`, capturedError);
  }

  if (capturedData) {
    console.log(
      `[getExperienceBySlug] Found in captured_content: ${capturedData.title}`
    );
    return {
      id: capturedData.id,
      title: capturedData.title,
      summary: capturedData.summary,
      content: capturedData.processed_content || capturedData.raw_content,
      author: 'Community Member',
      source: sourceFromUrl(
        capturedData.original_url,
        capturedData.source || 'Web'
      ),
      original_link: capturedData.original_url,
      date: capturedData.published_at || capturedData.captured_at,
      tags: capturedData.topics || [],
      company: capturedData.company,
      type: 'captured',
    };
  }

  // 3. Try scraped_experiences (SEO Content)
  let { data: scrapedData, error: scrapedError } = await supabaseAdmin
    .from('scraped_experiences')
    .select('*')
    .eq('slug', identifier)
    .single();

  if (scrapedError && scrapedError.code !== 'PGRST116') {
    console.error(`[getExperienceBySlug] Scraped Error:`, scrapedError);
  }

  if (scrapedData) {
    console.log(
      `[getExperienceBySlug] Found in scraped_experiences: ${scrapedData.title}`
    );
    return {
      id: scrapedData.id,
      title: scrapedData.title,
      summary: scrapedData.summary,
      content:
        scrapedData.formatted_content ||
        scrapedData.metadata?.content ||
        scrapedData.summary,
      author: scrapedData.author,
      source: scrapedData.source,
      original_link: scrapedData.original_url,
      date: scrapedData.published_at,
      tags: scrapedData.tags || [],
      type: 'scraped',
    };
  }

  // 4. Try new_interview (User Submissions)
  const { data: userData, error: userError } = await supabaseAdmin
    .from('new_interview')
    .select('*')
    .eq('slug', identifier)
    .single();

  if (userData) {
    console.log(
      `[getExperienceBySlug] Found in new_interview: ${userData.title}`
    );
    return {
      id: userData.id,
      title: userData.title,
      summary: userData.summary || userData.description,
      content:
        userData.formatted_content || userData.description || userData.summary,
      author: userData.added_by || 'Community Member',
      source: 'Frontend Junction',
      original_link: userData.blog_link,
      date: userData.created_at,
      tags: userData.tags || [],
      type: 'user',
    };
  }

  // 5. Try experiences (Legacy)
  const { data: legacyData, error: legacyError } = await supabaseAdmin
    .from('experiences')
    .select('*')
    .eq('slug', identifier)
    .single();

  if (legacyData) {
    console.log(
      `[getExperienceBySlug] Found in experiences: ${legacyData.title}`
    );
    return {
      id: legacyData.id,
      title: legacyData.title,
      summary: legacyData.summary,
      content:
        legacyData.formatted_content ||
        legacyData.detail_experience ||
        legacyData.summary,
      author: 'Community Member',
      source: 'Frontend Junction',
      original_link: legacyData.original_link,
      date: legacyData.created_at,
      tags: legacyData.tags || [],
      type: 'legacy',
    };
  }

  console.log(`[getExperienceBySlug] Not found in any table.`);
  return null;
}
