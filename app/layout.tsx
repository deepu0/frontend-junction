import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
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

const inter = Inter({ subsets: ['latin'] });

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
  ],
  authors: [
    { name: 'Deepak Sharma', url: 'https://linkedin.com/in/depaksharma' },
  ],
  creator: 'Frontend Junction',
  publisher: 'Frontend Junction',
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        {/* Structured Data */}
        <OrganizationSchema />
        <WebsiteSchema />
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
      <body className={inter.className}>
        {/* Skip to main content - Accessibility */}
        <a
          href='#main-content'
          className='sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md'
        >
          Skip to main content
        </a>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <LoadingProvider>
            <AuthProvider>
              <SiteHeader />
              <main id='main-content'>{children}</main>
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
