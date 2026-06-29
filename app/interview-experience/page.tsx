import InterviewExperiences from '@/components/experiences';
import {
  fetchPaginatedExperiences,
  fetchCompanyAndYearStats,
} from '@/actions/experiences';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Loading from '../loading';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Frontend Interview Experiences | Real Stories from Top Companies',
  description:
    'Browse 400+ real frontend interview experiences from Google, Amazon, Meta, Flipkart, and more. Get insights, tips, and prepare better for your next interview.',
  keywords:
    'frontend interview experiences, frontend developer interviews, frontend interview preparation, frontend interview insights, frontend interview stories',
  alternates: {
    canonical: 'https://www.frontend-junction.com/interview-experience',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.frontend-junction.com/interview-experience',
    title: 'Frontend Interview Experiences | Real Stories from Top Companies',
    description:
      'Browse 400+ real frontend interview experiences from Google, Amazon, Meta, Flipkart, and more.',
    siteName: 'Frontend Junction',
  },
};

export default async function Interview(props: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchParams = await props.searchParams;

  // Ensure we get initial data based on URL if loaded directly
  const [{ data: initialData, totalCount }, { companies, years }] =
    await Promise.all([
      fetchPaginatedExperiences({
        page: 1,
        limit: 12,
        search: searchParams?.search || '',
        source: (searchParams?.source as any) || 'all',
        companies: searchParams?.companies
          ? searchParams.companies.split(',')
          : [],
        year: searchParams?.year || null,
        sortBy: (searchParams?.sort as any) || 'newest',
        isAdmin: false, // For safety, SSR initial props always non-admin. Client fetches admin on hydration.
      }),
      fetchCompanyAndYearStats(),
    ]);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-4 mt-10'>
      <Suspense fallback={<Loading />}>
        <InterviewExperiences
          initialData={initialData}
          initialTotalCount={totalCount}
          availableCompanies={companies}
          availableYears={years}
        />
      </Suspense>
    </main>
  );
}
