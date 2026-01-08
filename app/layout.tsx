import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cn } from '@/lib/utils';
import Head from 'next/head';
import { SiteHeader } from '@/components/common/site-header';
import { ThemeProvider } from '@/components/common/theme-provider';
import Script from 'next/script';
import { AuthProvider } from '@/components/session-provider';
import { Toaster } from '@/components/ui/toaster';
import { LoadingProvider } from '@/components/common/loader';
import { Analytics } from '@vercel/analytics/next';

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
    <html lang='en' suppressHydrationWarning>
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
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          <LoadingProvider>
            <AuthProvider>
              <SiteHeader />
              {children}
            </AuthProvider>
          </LoadingProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
