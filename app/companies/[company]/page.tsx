import { getExperiencesByCompanySlug } from '@/lib/getExperiencesByCompany';
import { getCompanies } from '@/lib/getCompanies';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import { FaCalendar, FaUser } from 'react-icons/fa';

export const revalidate = 600; // ISR: revalidate every 10 minutes

interface Props {
  params: Promise<{ company: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const [{ company }, companies] = await Promise.all([params, getCompanies()]);
  const matchedCompany = companies.find(
    (c) => c.slug === company.toLowerCase()
  );
  const companyName = matchedCompany ? matchedCompany.name : company;

  return {
    title: `${companyName} Frontend Interview Experiences & Questions 2026 | Frontend Junction`,
    description: `Browse real ${companyName} frontend engineer interview experiences. Prepare for your ${companyName} UI/UX, React, JavaScript, or System Design interview rounds.`,
    keywords: [
      `${companyName} frontend interview`,
      `${companyName} interview experience`,
      `${companyName} software engineer interview`,
      `${companyName} react interview`,
    ],
    alternates: {
      canonical: `https://www.frontend-junction.com/companies/${company}`,
    },
    openGraph: {
      title: `${companyName} Frontend Interview Experiences`,
      description: `Browse real ${companyName} frontend engineer interview experiences.`,
      type: 'website',
      url: `https://www.frontend-junction.com/companies/${company}`,
    },
  };
}

export default async function CompanyHubPage({ params }: Props) {
  const { company } = await params;

  // Fetch the experiences for this specific company
  const [experiences, companies] = await Promise.all([
    getExperiencesByCompanySlug(company),
    getCompanies(),
  ]);

  if (!experiences || experiences.length === 0) {
    notFound();
  }

  // Get nicely formatted company name
  const matchedCompany = companies.find(
    (c) => c.slug === company.toLowerCase()
  );
  const companyName = matchedCompany ? matchedCompany.name : company;

  const currentUrl = `https://www.frontend-junction.com/companies/${company}`;

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.frontend-junction.com/',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Companies',
        item: 'https://www.frontend-junction.com/companies',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: companyName,
        item: currentUrl,
      },
    ],
  };

  const collectionLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${companyName} Frontend Interview Experiences`,
    description: `A collection of real frontend interview experiences from candidates at ${companyName}.`,
    url: currentUrl,
  };

  return (
    <div className='min-h-screen bg-background text-foreground pt-24 pb-16'>
      <Script
        id={`json-ld-breadcrumb-company-${company}`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c'),
        }}
      />
      <Script
        id={`json-ld-collection-company-${company}`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionLd).replace(/</g, '\\u003c'),
        }}
      />

      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Back Link */}
        <Link
          href='/companies'
          className='text-muted-foreground hover:text-primary mb-8 inline-block transition-colors'
        >
          &larr; Back to all companies
        </Link>

        <header className='mb-12 text-center md:text-left'>
          <h1 className='text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight'>
            {companyName} Frontend Interviews
          </h1>
          <p className='text-xl text-muted-foreground max-w-2xl'>
            Real, crowdsourced interview experiences for frontend developer
            roles at {companyName}. Prepare for system design, coding rounds,
            and behavioral questions.
          </p>
        </header>

        <div className='space-y-6'>
          {experiences.map((exp) => (
            <article
              key={exp.id}
              className='p-6 bg-card text-card-foreground border border-border rounded-2xl hover:border-primary/50 transition-all shadow-sm'
            >
              <h2 className='text-2xl font-bold mb-3'>
                <Link
                  href={`/interview-experience/${exp.slug}`}
                  className='hover:text-primary transition-colors'
                >
                  {exp.title}
                </Link>
              </h2>
              <div className='flex items-center gap-4 text-sm text-muted-foreground mb-4'>
                <div className='flex items-center gap-1.5'>
                  <FaUser className='w-3 h-3' />
                  <span>{exp.author}</span>
                </div>
                <div className='flex items-center gap-1.5'>
                  <FaCalendar className='w-3 h-3' />
                  <span>
                    {new Date(exp.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className='flex gap-2 flex-wrap'>
                {exp.tags?.slice(0, 4).map((tag: string) => (
                  <span
                    key={tag}
                    className='px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-xs font-medium'
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

        {/* Cross-promotion: Jobs */}
        <div className='mt-12 p-6 rounded-2xl border border-primary/20 bg-primary/5 text-center'>
          <p className='text-lg font-semibold mb-2'>
            🚀 {companyName} hiring frontend devs?
          </p>
          <p className='text-muted-foreground text-sm mb-4'>
            Check open frontend positions at {companyName} and 500+ other
            companies
          </p>
          <a
            href={`https://onlyfrontendjobs.com/jobs?q=${encodeURIComponent(companyName)}&utm_source=frontend-junction&utm_medium=company-page&utm_campaign=${company}`}
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity'
          >
            View Jobs at {companyName} →
          </a>
        </div>
      </div>
    </div>
  );
}
