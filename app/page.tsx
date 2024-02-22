import LandingPage from '@/components/home';
import Head from 'next/head';
export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-4 mt-3'>
      <Head>
        <title>
          Frontend Junction - Your Hub for Frontend Interview Insights
        </title>
        <meta
          name='description'
          content='Frontend Junction is your go-to platform for frontend interview insights, featuring interview experiences from top tech companies, preparation tips, and more.'
        />
        <meta
          name='keywords'
          content='frontend, interview, experiences, tech companies, preparation tips'
        />
        <meta
          property='og:title'
          content='Frontend Junction - Your Hub for Frontend Interview Insights'
        />
        <meta
          property='og:description'
          content='Frontend Junction is your go-to platform for frontend interview insights, featuring interview experiences from top tech companies, preparation tips, and more.'
        />
        <meta property='og:type' content='website' />
        <meta property='og:image' content='/logo.png' />
        <meta property='og:url' content='https://www.yourwebsite.com' />
      </Head>

      <LandingPage />
    </main>
  );
}
