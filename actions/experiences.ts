'use server';

import { supabase } from '@/lib/supabase';

// Type describing the filters we support
export interface ExperienceFilters {
  page: number;
  limit: number;
  search?: string;
  source?: 'all' | 'community' | 'web' | 'pending';
  companies?: string[];
  year?: string | null;
  sortBy?: 'newest' | 'oldest';
  isAdmin?: boolean;
}

export async function fetchPaginatedExperiences(filters: ExperienceFilters) {
  const {
    page = 1,
    limit = 12,
    search = '',
    source = 'all',
    companies = [],
    year,
    sortBy = 'newest',
    isAdmin = false,
  } = filters;

  try {
    let query = supabase
      .from('unified_experiences')
      .select('*', { count: 'exact' });

    // 1. Pending Post Filtering
    if (source === 'pending') {
      if (isAdmin) {
        query = query.eq('status', 'pending');
      } else {
        query = query.neq('status', 'pending'); // Fallback if regular user tries
      }
    } else {
      // By default, exclude pending posts unless actively filtered for
      query = query.neq('status', 'pending');
    }

    // 2. Source Filtering
    if (source === 'community') {
      query = query.in('type', ['legacy', 'user']);
    } else if (source === 'web') {
      query = query.eq('type', 'scraped');
    }

    // 3. Company Filtering
    if (companies && companies.length > 0) {
      query = query.in('company', companies);
    }

    // 4. Year Filtering
    if (year) {
      // Extract the year from the date column
      query = query.gte('date', `${year}-01-01T00:00:00Z`);
      query = query.lte('date', `${year}-12-31T23:59:59Z`);
    }

    // 5. Search
    if (search && search.trim() !== '') {
      // Supabase ilike doesn't search jsonb (tags) easily using simple or, so we search title, company, description
      const safeSearch = search.trim().replace(/%/g, '\\%');
      query = query.or(
        `title.ilike.%${safeSearch}%,company.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`
      );
    }

    // 6. Sorting
    query = query.order('date', {
      ascending: sortBy === 'oldest',
      nullsFirst: false,
    });

    // 7. Pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // Transform to match local UI expectations
    const transformedData = data.map((item) => ({
      id: item.id,
      rawId: item.raw_id,
      title: item.title,
      company: item.company,
      description: item.description,
      tags: item.tags || [],
      status: item.status,
      date: item.date,
      type: item.type,
      slug: item.slug,
      source: item.source,
      author: item.author,
      companyDomain: item.company_domain,
      blogLink: item.blog_link,
      // Helper function logically ported from getExperiences.ts
      link: getLink(item),
      imageSrc: '', // Placeholder expected by UI
    }));

    return {
      data: transformedData,
      totalCount: count || 0,
    };
  } catch (error) {
    console.error('Failed to fetch paginated experiences:', error);
    return { data: [], totalCount: 0 };
  }
}

// Generate the correct front-end link based on the unified type
function getLink(item: any) {
  if (item.slug) return `/interview-experience/${item.slug}`;
  if (item.type === 'scraped')
    return `/interview-experience/scraped-${item.raw_id}`;
  if (item.type === 'user') return `/interview-experience/user-${item.raw_id}`;
  if (item.type === 'legacy') return `/interview-experience/exp-${item.raw_id}`;
  return '#';
}

export async function fetchCompanyAndYearStats() {
  try {
    const { data, error } = await supabase
      .from('unified_experiences')
      .select('company, date')
      .neq('status', 'pending');

    if (error) throw error;

    const companies = new Set<string>();
    const years = new Set<string>();

    data.forEach((item) => {
      if (item.company) companies.add(item.company);
      if (item.date) {
        const year = new Date(item.date).getFullYear().toString();
        if (!isNaN(Number(year))) years.add(year);
      }
    });

    return {
      companies: Array.from(companies).sort(),
      years: Array.from(years).sort().reverse(),
    };
  } catch (err) {
    console.error('Stats fetch error:', err);
    return { companies: [], years: [] };
  }
}
