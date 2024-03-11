import LandingPage from '@/components/home';
import useGetCompanies from '@/hooks/useGetCompanies';
import type { Metadata } from 'next';

const metaData: Metadata = {
  title: 'Front-end Junction: Insider Front-end Interview Insights',
  description:
    'Gain insider knowledge and prepare better for your front-end developer job interviews. Browse through real candidate experiences from top companies. Get tips, advice, and valuable insights.',
  applicationName: 'Front-end Junction',
  keywords:
    'front-end interviews, front-end developer interviews, front-end interview preparation, front-end interview experiences, front-end interview insights, front-end interview tips, front-end interview advice',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    url: new URL('https://frontend-junction.vercel.app'),
    title: 'Front-end Junction: Insider Front-end Interview Insights',
    description:
      'Gain insider knowledge and prepare better for your front-end developer job interviews. Browse through real candidate experiences from top companies. Get tips, advice, and valuable insights.',
    siteName: 'Front-end Junction',
    images: [
      { url: new URL('/og-image.jpg', 'https://frontend-junction.vercel.app') },
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
  const data = await useGetCompanies();
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-4 mt-3'>
      <LandingPage companies={data} />
    </main>
  );
}
