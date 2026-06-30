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

// Derive a human-readable source name from a URL.
// e.g. "https://medium.com/..." → "Medium"
//      "https://dev.to/..."    → "DEV Community"
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
    // Check exact match or subdomain match (e.g. user.hashnode.dev)
    for (const [key, label] of Object.entries(MAP)) {
      if (host === key || host.endsWith('.' + key)) return label;
    }
    // Fall back to capitalised hostname root (e.g. "notion.so" → "Notion")
    return host.split('.')[0].replace(/^./, (c) => c.toUpperCase());
  } catch {
    return fallback;
  }
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
    // ── 1. Query unified_experiences (legacy + user + scraped) ──────────────
    let query = supabase
      .from('unified_experiences')
      .select('*', { count: 'exact' });

    if (source === 'pending') {
      if (isAdmin) {
        query = query.eq('status', 'pending');
      } else {
        query = query.neq('status', 'pending');
      }
    } else {
      query = query.neq('status', 'pending');
    }

    if (source === 'community') {
      query = query.in('type', ['legacy', 'user']);
    } else if (source === 'web') {
      query = query.eq('type', 'scraped');
    }

    if (companies && companies.length > 0) {
      query = query.in('company', companies);
    }

    if (year) {
      query = query.gte('date', `${year}-01-01T00:00:00Z`);
      query = query.lte('date', `${year}-12-31T23:59:59Z`);
    }

    if (search && search.trim() !== '') {
      const safeSearch = search.trim().replace(/%/g, '\\%');
      query = query.or(
        `title.ilike.%${safeSearch}%,company.ilike.%${safeSearch}%,description.ilike.%${safeSearch}%`
      );
    }

    query = query.order('date', {
      ascending: sortBy === 'oldest',
      nullsFirst: false,
    });

    // Fetch ALL matching (no pagination yet — we merge with captured first)
    const { data: unifiedData, count: unifiedCount, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw error;
    }

    // ── 2. Query captured_content (extension captures) ─────────────────────
    // Only include when source is 'all' or 'web' (extension captures are web-sourced)
    let capturedRows: any[] = [];
    if (source === 'all' || source === 'web') {
      let capturedQuery = supabase
        .from('captured_content')
        .select(
          'id, title, summary, slug, company, source, original_url, published_at, captured_at, topics, outcome, role'
        )
        .eq('status', 'published');

      if (companies && companies.length > 0) {
        capturedQuery = capturedQuery.in('company', companies);
      }

      if (year) {
        capturedQuery = capturedQuery.gte(
          'published_at',
          `${year}-01-01T00:00:00Z`
        );
        capturedQuery = capturedQuery.lte(
          'published_at',
          `${year}-12-31T23:59:59Z`
        );
      }

      if (search && search.trim() !== '') {
        const safeSearch = search.trim().replace(/%/g, '\\%');
        capturedQuery = capturedQuery.or(
          `title.ilike.%${safeSearch}%,company.ilike.%${safeSearch}%,summary.ilike.%${safeSearch}%`
        );
      }

      const { data: capturedData } = await capturedQuery;

      capturedRows = (capturedData || []).map((item) => ({
        id: item.id,
        rawId: item.id,
        title: item.title,
        company: item.company,
        description: item.summary || '',
        tags: item.topics || [],
        status: 'published',
        date: item.published_at || item.captured_at,
        type: 'captured',
        slug: item.slug,
        source: sourceFromUrl(item.original_url, item.source || 'Web'),
        author: 'Community Member',
        companyDomain: null,
        blogLink: null,
        link: item.slug ? `/interview-experience/${item.slug}` : '#',
        imageSrc: '',
      }));
    }

    // ── 3. Merge, sort, paginate ────────────────────────────────────────────
    const unifiedRows = (unifiedData || []).map((item) => ({
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
      link: getLink(item),
      imageSrc: '',
    }));

    // Deduplicate by slug (captured may overlap with scraped in rare cases)
    const seenSlugs = new Set<string>();
    const allRows = [...unifiedRows, ...capturedRows].filter((item) => {
      if (!item.slug) return true;
      if (seenSlugs.has(item.slug)) return false;
      seenSlugs.add(item.slug);
      return true;
    });

    // Sort merged set
    allRows.sort((a, b) => {
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      return sortBy === 'oldest' ? da - db : db - da;
    });

    const totalCount = allRows.length;
    const from = (page - 1) * limit;
    const paginatedData = allRows.slice(from, from + limit);

    return { data: paginatedData, totalCount };
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
    const [unifiedRes, capturedRes] = await Promise.all([
      supabase
        .from('unified_experiences')
        .select('company, date')
        .neq('status', 'pending'),
      supabase
        .from('captured_content')
        .select('company, published_at')
        .eq('status', 'published'),
    ]);

    if (unifiedRes.error) throw unifiedRes.error;

    const companies = new Set<string>();
    const years = new Set<string>();

    (unifiedRes.data || []).forEach((item) => {
      if (item.company) companies.add(item.company);
      if (item.date) {
        const year = new Date(item.date).getFullYear().toString();
        if (!isNaN(Number(year))) years.add(year);
      }
    });

    (capturedRes.data || []).forEach((item) => {
      if (item.company) companies.add(item.company);
      if (item.published_at) {
        const year = new Date(item.published_at).getFullYear().toString();
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
