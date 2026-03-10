import { createClient } from '@supabase/supabase-js';

export interface CompactExperience {
  id: string;
  slug: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  tags: string[];
  company: string;
  sourceType: 'scraped' | 'user';
}

export async function getExperiencesByCompanySlug(
  companySlug: string
): Promise<CompactExperience[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn(`[getExperiencesByCompanySlug] Missing Supabase credentials.`);
    return [];
  }

  const supabaseAdmin = createClient(url, key);

  // Create a case-insensitive regex pattern for PostgREST
  // We match the slug case-insensitively using an exact match approach.
  const lowerSlug = companySlug.toLowerCase();

  try {
    // 1. Fetch from scraped_experiences
    const { data: scrapedData, error: scrapedError } = await supabaseAdmin
      .from('scraped_experiences')
      .select('id, slug, title, summary, author, published_at, tags, company')
      .not('company', 'is', null);

    // 2. Fetch from new_interview
    const { data: userData, error: userError } = await supabaseAdmin
      .from('new_interview')
      .select(
        'id, slug, title, summary, description, added_by, created_at, tags, company'
      )
      .not('company', 'is', null);

    if (scrapedError) console.error(scrapedError);
    if (userError) console.error(userError);

    // Combine and filter locally to ensure robust case-insensitive matching
    const allExperiences: CompactExperience[] = [];

    (scrapedData || []).forEach((row) => {
      if (row.company && row.company.trim().toLowerCase() === lowerSlug) {
        allExperiences.push({
          id: row.id,
          slug: row.slug || row.id,
          title: row.title,
          summary: row.summary || '',
          author: row.author || 'Anonymous',
          date: row.published_at || new Date().toISOString(),
          tags: row.tags || [],
          company: row.company,
          sourceType: 'scraped',
        });
      }
    });

    (userData || []).forEach((row) => {
      if (row.company && row.company.trim().toLowerCase() === lowerSlug) {
        allExperiences.push({
          id: row.id,
          slug: row.slug || row.id,
          title: row.title,
          summary: row.summary || row.description || '',
          author: row.added_by || 'Community Member',
          date: row.created_at || new Date().toISOString(),
          tags: row.tags || [],
          company: row.company,
          sourceType: 'user',
        });
      }
    });

    // Sort by most recent date
    return allExperiences.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  } catch (error) {
    console.error(`[getExperiencesByCompanySlug] Error:`, error);
    return [];
  }
}
