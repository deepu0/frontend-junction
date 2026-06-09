import { getExperiencesByCompanySlug } from '@/lib/getExperiencesByCompany';
import { getCompanies } from '@/lib/getCompanies';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import Script from 'next/script';
import { FaCalendar, FaUser } from 'react-icons/fa';
import { FaBriefcase } from 'react-icons/fa6';

export const dynamic = 'force-dynamic';
export const revalidate = 600; // Cache for 10 minutes

interface Props {
  params: Promise<{ company: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { company } = await params;

  // Find real name to format nicely
  const companies = await getCompanies();
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
  const experiences = await getExperiencesByCompanySlug(company);

  if (!experiences || experiences.length === 0) {
    notFound();
  }

  // Get nicely formatted company name
  const companies = await getCompanies();
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <Script
        id={`json-ld-collection-company-${company}`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
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

        {/* Cross-link to OnlyFrontendJobs */}
        <a
          href={`https://onlyfrontendjobs.com/companies/${company}?utm_source=frontend-junction&utm_medium=company_page&utm_campaign=${encodeURIComponent(company)}`}
          target='_blank'
          rel='noopener noreferrer'
          className='mt-10 block p-6 bg-card border border-primary/20 rounded-2xl hover:border-primary/50 transition-all shadow-sm group'
        >
          <div className='flex items-start gap-4'>
            <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 border border-primary/20'>
              <FaBriefcase className='w-4 h-4 text-primary' />
            </div>
            <div>
              <h3 className='text-lg font-bold text-foreground group-hover:text-primary transition-colors'>
                Browse {companyName} Frontend Jobs
              </h3>
              <p className='mt-1 text-sm text-muted-foreground'>
                See open frontend roles at {companyName} on OnlyFrontendJobs
                — India&apos;s dedicated frontend job board.
              </p>
            </div>
          </div>
        </a>
      </div>
    </div>
  );
}
