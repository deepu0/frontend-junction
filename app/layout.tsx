import './globals.css';
import type { Metadata } from 'next';
import { cn } from '@/lib/utils';
import { SiteHeader } from '@/components/common/site-header';
import { ThemeProvider } from '@/components/common/theme-provider';
import Script from 'next/script';
import { AuthProvider } from '@/components/session-provider';
import { Toaster } from '@/components/ui/toaster';
import { LoadingProvider } from '@/components/common/loader';
import {
  OrganizationSchema,
  WebsiteSchema,
} from '@/components/structured-data';
import { Analytics } from '@vercel/analytics/next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.frontend-junction.com'),
  title: {
    default: 'Frontend Junction | Frontend Interview Experiences & Jobs',
    template: '%s | Frontend Junction',
  },
  description:
    'Your Hub for Frontend Interview Insights. Browse real interview experiences from top tech companies, prepare better, and land your dream frontend developer job.',
  keywords: [
    'frontend interviews',
    'frontend developer jobs',
    'interview experiences',
    'React interviews',
    'JavaScript interviews',
    'frontend preparation',
    'frontend system design',
    'frontend coding challenges',
    'software engineer interview prep',
  ],
  authors: [
    { name: 'Deepak Sharma', url: 'https://linkedin.com/in/depaksharma' },
  ],
  creator: 'Frontend Junction',
  publisher: 'Frontend Junction',
  alternates: {
    canonical: '/',
  },
  formatDetection: {
    email: false,
    telephone: false,
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.frontend-junction.com',
    siteName: 'Frontend Junction',
    title: 'Frontend Junction | Frontend Interview Experiences & Jobs',
    description:
      'Your Hub for Frontend Interview Insights. Browse real interview experiences from top tech companies.',
    images: [
      {
        url: '/opengraph-image.jpeg',
        width: 1200,
        height: 630,
        alt: 'Frontend Junction - Interview Experiences',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Frontend Junction | Frontend Interview Experiences',
    description:
      'Your Hub for Frontend Interview Insights. Browse real interview experiences from top tech companies.',
    images: ['/opengraph-image.jpeg'],
    creator: '@frontendjunction',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

import { MobileStickyCta } from '@/components/common/mobile-sticky-cta';
import { AnnouncementBanner } from '@/components/common/announcement-banner';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <meta name='google-adsense-account' content='ca-pub-4467873688771542' />
        <Script
          id='google-adsense'
          strategy='beforeInteractive'
          async
          src='https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4467873688771542'
          crossOrigin='anonymous'
        />
        {/* Structured Data */}
        <OrganizationSchema />
        <WebsiteSchema />
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link
          rel='preconnect'
          href='https://fonts.gstatic.com'
          crossOrigin='anonymous'
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href='https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'
          rel='stylesheet'
        />
      </head>
      {process.env.NEXT_GOOGLE_ANALYTICS && (
        <Script
          strategy='afterInteractive'
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_GOOGLE_ANALYTICS}`}
        />
      )}
      {process.env.NEXT_GOOGLE_ANALYTICS && (
        <Script
          id='google-analytics'
          strategy='afterInteractive'
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
      <body className={cn('font-sans antialiased')}>
        {/* Skip to main content - Accessibility */}
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md'
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem={false}
          disableTransitionOnChange
        >
          <Toaster />
          <LoadingProvider>
            <AuthProvider>
              <AnnouncementBanner />
              <SiteHeader />
              <main id='main-content'>{children}</main>
              <MobileStickyCta />
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
