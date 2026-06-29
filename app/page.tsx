import LandingPage from '@/components/home';
import getExperiences from '@/hooks/getExperiences';
import { posts } from '#site/content';
import type { Metadata } from 'next';
import { unstable_cache } from 'next/cache';

// Enable ISR - revalidate every 60 seconds
export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Frontend Junction | Real Interview Experiences & Handpicked Jobs',
  description:
    'The ultimate platform for frontend engineers. Browse real interview experiences from Google, Meta, and more. Find curated job opportunities and prepare with community insights.',
  applicationName: 'Frontend Junction',
  keywords:
    'frontend interviews, frontend developer jobs, interview preparation, tech interview experiences, react interview questions, javascript interview prep, coding interview stories',
  robots: 'index, follow',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.frontend-junction.com/',
    title: 'Frontend Junction | Real Interview Experiences & Handpicked Jobs',
    description:
      'The ultimate platform for frontend engineers. Browse real interview experiences from Google, Meta, and more. Find curated job opportunities.',
    siteName: 'Frontend Junction',
    images: [
      {
        url: '/opengraph-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'Frontend Junction - Community for Frontend Engineers',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frontend Junction | Real Interview Experiences',
    description:
      'Real interview stories and handpicked jobs for frontend developers.',
    images: ['/opengraph-image.jpeg'],
  },
  appleWebApp: {
    capable: true,
    title: 'Frontend Junction',
    statusBarStyle: 'black-translucent',
  },
};

import { createClient } from '@supabase/supabase-js';

async function getCompaniesServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];
  try {
    const supabaseAdmin = createClient(url, key);
    const { data, error } = await supabaseAdmin
      .from('company')
      .select('id,company_name,logo');
    if (error) throw error;
    return (data || []).map((c: any) => ({
      id: c.id,
      companyName: c.company_name,
      logoUrl: c?.logo || '',
    }));
  } catch (err) {
    console.error('[getCompaniesServer] Error:', err);
    return [];
  }
}

// Cached data fetchers for instant page loads
const getCachedExperiences = unstable_cache(
  async () => {
    const experiences = await getExperiences();
    // Only return first 6 for homepage - reduces payload
    return experiences?.slice(0, 6) || [];
  },
  ['homepage-experiences'],
  { revalidate: 60, tags: ['experiences'] }
);

const getCachedCompanies = unstable_cache(
  async () => {
    const companies = await getCompaniesServer();
    return companies;
  },
  ['homepage-companies'],
  { revalidate: 300, tags: ['companies'] }
);

// Get latest published blog posts (static - from Velite build)
function getLatestPosts() {
  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      date: post.date,
      tags: post.tags,
      image: post.image,
    }));
}

export default async function Home() {
  // Parallel fetch with caching for instant loads
  const [companies, experiences] = await Promise.all([
    getCachedCompanies(),
    getCachedExperiences(),
  ]);

  // Blog posts are static (from build time)
  const latestPosts = getLatestPosts();

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-4  mt-3'>
      <LandingPage
        companies={companies}
        experiences={experiences}
        latestPosts={latestPosts}
      />
    </main>
  );
}
