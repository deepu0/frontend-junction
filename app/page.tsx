import LandingPage from '@/components/home';
import useGetCompanies from '@/hooks/useGetCompanies';
import useGetExperiences from '@/hooks/useGetExperiences';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Front-end Junction: Insider Front-end Interview Insights',
  description:
    'Gain insider knowledge and prepare better for your front-end developer job interviews. Browse through real candidate experiences from top companies. Get tips, advice, and valuable insights.',
  applicationName: 'Front-end Junction',
  keywords:
    'front-end interviews, front-end developer interviews, front-end interview preparation, front-end interview experiences, front-end interview insights, front-end interview tips, front-end interview advice',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: new URL('https://www.frontend-junction.com/'),
    title: 'Front-end Junction: Insider Front-end Interview Insights',
    description:
      'Gain insider knowledge and prepare better for your front-end developer job interviews. Browse through real candidate experiences from top companies. Get tips, advice, and valuable insights.',
    siteName: 'Front-end Junction',
    images: [
      {
        url: new URL(
          '/opengraph-image.jpeg',
          'https://www.frontend-junction.com'
        ),
      },
    ],
  },

  appleWebApp: {
    capable: true,
    title: 'Front-end Junction',
    statusBarStyle: 'black-translucent',
  },
  other: {
    linkedin: 'https://www.linkedin.com/in/depaksharma/',
    topmate: 'https://topmate.io/deepak_sharma',
    'interview-experience': 'index',
  },
};

export default async function Home() {
  const [companies, experiences] = await Promise.all([
    useGetCompanies(),
    useGetExperiences(),
  ]);

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-4 mt-3'>
      <LandingPage companies={companies} experiences={experiences} />
    </main>
  );
}
