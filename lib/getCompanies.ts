import { createClient } from '@supabase/supabase-js';

export async function getCompanies() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.warn(`[getCompanies] Missing Supabase credentials.`);
    return [];
  }

  const supabaseAdmin = createClient(url, key);

  try {
    // Fetch unique companies from scraped_experiences
    const { data: scrapedData, error: scrapedError } = await supabaseAdmin
      .from('scraped_experiences')
      .select('company')
      .not('company', 'is', null);

    if (scrapedError) throw scrapedError;

    // Fetch unique companies from new_interview
    const { data: userData, error: userError } = await supabaseAdmin
      .from('new_interview')
      .select('company')
      .not('company', 'is', null);

    if (userError) throw userError;

    // Combine, extract, and convert to lowercase for deduplication
    const allCompanies: string[] = [
      ...(scrapedData || []).map((row) => row.company?.trim()),
      ...(userData || []).map((row) => row.company?.trim()),
    ].filter(Boolean) as string[];

    // Map lowercase name to original casing (keep the first encountered casing)
    const companyMap = new Map<string, string>();
    allCompanies.forEach((company) => {
      const lower = company.toLowerCase();
      if (!companyMap.has(lower)) {
        companyMap.set(lower, company);
      }
    });

    // Sort alphabetically by the lowercase key
    const sortedSlugs = Array.from(companyMap.keys()).sort();

    return sortedSlugs.map((slug) => ({
      slug,
      name: companyMap.get(slug) as string,
    }));
  } catch (error) {
    console.error(`[getCompanies] Error:`, error);
    return [];
  }
}
