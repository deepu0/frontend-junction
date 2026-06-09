import { MetadataRoute } from 'next';
import { createClient } from '@supabase/supabase-js';
import { posts } from '#site/content';
import { getCompanies } from '@/lib/getCompanies';

const BASE_URL = 'https://www.frontend-junction.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/interview-experience`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/companies`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  // Blog posts from Velite (static at build time)
  const blogPages: MetadataRoute.Sitemap = posts
    .filter((post) => post.published)
    .map((post) => ({
      url: `${BASE_URL}/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));

  // Fetch dynamic experience pages
  let experiencePages: MetadataRoute.Sitemap = [];
  let companyPages: MetadataRoute.Sitemap = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    // Use service role key if available, fall back to anon key
    const supabaseKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    // Fetch Companies
    const companies = await getCompanies();
    if (companies && companies.length > 0) {
      companyPages = companies.map((c) => ({
        url: `${BASE_URL}/companies/${c.slug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
    }

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch scraped experiences with slugs
      const { data: scrapedExperiences, error: scrapedError } = await supabase
        .from('scraped_experiences')
        .select('slug, updated_at')
        .eq('status', 'approved')
        .not('slug', 'is', null)
        .order('updated_at', { ascending: false })
        .limit(1000);

      if (scrapedError) {
        console.error(
          '[Sitemap] Error fetching scraped experiences:',
          scrapedError.message
        );
      }

      if (scrapedExperiences) {
        experiencePages = scrapedExperiences.map((exp) => ({
          url: `${BASE_URL}/interview-experience/${exp.slug}`,
          lastModified: new Date(exp.updated_at),
          changeFrequency: 'weekly' as const,
          priority: 0.7,
        }));
      }

      // Fetch user-submitted experiences
      const { data: userExperiences, error: userError } = await supabase
        .from('new_interview')
        .select('slug, updated_at')
        .not('slug', 'is', null)
        .order('updated_at', { ascending: false })
        .limit(500);

      if (userError) {
        console.error(
          '[Sitemap] Error fetching user experiences:',
          userError.message
        );
      }

      if (userExperiences) {
        experiencePages = [
          ...experiencePages,
          ...userExperiences.map((exp) => ({
            url: `${BASE_URL}/interview-experience/${exp.slug}`,
            lastModified: new Date(exp.updated_at),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
          })),
        ];
      }

      console.log(
        `[Sitemap] Generated ${experiencePages.length} experience URLs, ${companyPages.length} company URLs, ${blogPages.length} blog URLs`
      );
    } else {
      console.warn(
        '[Sitemap] Missing Supabase credentials — experience pages will not be included'
      );
    }
  } catch (error) {
    console.error('[Sitemap] Error fetching data:', error);
  }

  return [...staticPages, ...blogPages, ...experiencePages, ...companyPages];
}
