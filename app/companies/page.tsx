import { getCompanies } from '@/lib/getCompanies';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';

export const revalidate = 3600; // ISR: revalidate every 1 hour

export const metadata: Metadata = {
  title: 'Top Companies for Frontend Interviews | Frontend Junction',
  description:
    'Browse frontend interview experiences by company. Prepare for your next interview at Google, Amazon, Uber, and more.',
  alternates: {
    canonical: 'https://www.frontend-junction.com/companies',
  },
  openGraph: {
    title: 'Top Companies for Frontend Interviews',
    description:
      'Browse frontend interview experiences by company. Prepare for your next interview at Google, Amazon, Uber, and more.',
    type: 'website',
  },
};

export default async function CompaniesPage() {
  const companies = await getCompanies();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Companies for Frontend Interviews',
    description:
      'A directory of tech companies and their frontend interview experiences.',
    url: 'https://www.frontend-junction.com/companies',
    numberOfItems: companies.length,
    itemListElement: companies.map((comp, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'WebPage',
        name: `${comp.name} Frontend Interviews`,
        url: `https://www.frontend-junction.com/companies/${comp.slug}`,
      },
    })),
  };

  return (
    <div className='min-h-screen bg-background text-foreground pt-24 pb-16'>
      <Script
        id='json-ld-companies-list'
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <div className='container mx-auto px-4 max-w-5xl'>
        <div className='mb-12 text-center'>
          <h1 className='text-4xl md:text-5xl font-extrabold text-foreground mb-4 tracking-tight'>
            Top Companies
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl mx-auto'>
            Explore frontend interview experiences grouped by the world&apos;s
            most innovative tech companies.
          </p>
        </div>

        {companies.length === 0 ? (
          <div className='text-center text-muted-foreground py-12'>
            No companies found at the moment. Check back later!
          </div>
        ) : (
          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {companies.map((comp) => (
              <Link
                key={comp.slug}
                href={`/companies/${comp.slug}`}
                className='flex items-center justify-center p-6 bg-card text-card-foreground border border-border rounded-2xl hover:border-primary hover:shadow-md transition-all group'
              >
                <span className='font-semibold text-lg text-center group-hover:text-primary transition-colors'>
                  {comp.name}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
