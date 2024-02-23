import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Head from 'next/head';
import { SiteHeader } from '@/components/common/site-header';
import { ThemeProvider } from '@/components/common/theme-provider';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Frontend Junction',
  description: 'Your Hub for Frontend Interview Insights',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className='lite'>
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
      {process.env.NEXT_GOOGLE_ANALYTICS && (
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_GOOGLE_ANALYTICS}`}
        />
      )}
      {process.env.NEXT_GOOGLE_ANALYTICS && (
        <Script
          id='google-analytics'
          dangerouslySetInnerHTML={{
            __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_GOOGLE_ANALYTICS}');
        `,
          }}
        />
      )}
      <body className={inter.className}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
          disableTransitionOnChange
        >
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
