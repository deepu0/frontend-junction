import InterviewExperiences from '@/components/experiences';
import getExperiences from '@/hooks/getExperiences';
import type { Metadata } from 'next';
import { Suspense } from 'react';
import Loading from '../loading';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Interview Experience',
  description:
    'Browse through real front-end interview experiences from candidates at various companies. Get insights, tips, and prepare better for your next interview.',
  keywords:
    'front-end interview experiences, front-end developer interviews, front-end interview preparation, front-end interview insights, front-end interview stories',
  openGraph: {
    type: 'website',
    url: 'https://www.frontend-junction.com/interview-experience',
    title: 'Front-end Interview Experiences | Front-end Junction',
    description:
      'Browse through real front-end interview experiences from candidates at various companies. Get insights, tips, and prepare better for your next interview.',
    siteName: 'Front-end Junction',
    //images: [{ url: '/og-image.jpg' }],
  },
};

export default async function Interview() {
  const data = await getExperiences();

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-4 mt-10'>
      <Suspense fallback={<Loading />}>
        <InterviewExperiences interviewData={data} />
      </Suspense>
    </main>
  );
}
