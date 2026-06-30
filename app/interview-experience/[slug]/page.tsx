import { getExperienceBySlug } from '@/lib/getExperienceBySlug';
import { sanitizeHtml } from '@/lib/sanitize-html';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaExternalLinkAlt, FaCalendar, FaUser } from 'react-icons/fa';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';
import ViewCounter from '@/components/view-counter';
import Script from 'next/script';
import { FaqSchema } from '@/components/structured-data';

export const revalidate = 60; // ISR: revalidate every 60 seconds

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);
  if (!experience) return { title: 'Not Found' };

  const url = `https://www.frontend-junction.com/interview-experience/${slug}`;
  const publishedTime = new Date(experience.date).toISOString();

  // Extract potential company name from title for keywords
  const titleWords = experience.title.split(' ');
  const companyHint = titleWords[0]; // Often the first word is the company

  return {
    title: `${experience.title} | Frontend Junction`,
    description:
      experience.summary?.substring(0, 160) ||
      `Read about the ${experience.title} interview experience on Frontend Junction.`,
    keywords: [
      ...(experience.tags || []),
      'frontend interview',
      'interview experience',
      companyHint,
      'software engineer interview',
      'web development',
    ].filter(Boolean),
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: experience.title,
      description:
        experience.summary?.substring(0, 160) ||
        `Detailed overview of ${experience.title} frontend interview.`,
      url,
      type: 'article',
      publishedTime,
      authors: [experience.author as string],
      siteName: 'Frontend Junction',
      images: [
        {
          url: '/opengraph-image.jpeg',
          width: 1200,
          height: 630,
          alt: experience.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: experience.title,
      description:
        experience.summary?.substring(0, 160) ||
        `Detailed overview of ${experience.title} frontend interview.`,
      images: ['/opengraph-image.jpeg'],
    },
  };
}

export default async function ExperienceSlugPage({ params }: Props) {
  const { slug } = await params;
  const experience = await getExperienceBySlug(slug);

  if (!experience) {
    notFound();
  }

  const currentUrl = `https://www.frontend-junction.com/interview-experience/${slug}`;

  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: experience.title,
    description: experience.summary?.substring(0, 160),
    image: 'https://www.frontend-junction.com/opengraph-image.jpeg',
    datePublished: new Date(experience.date).toISOString(),
    author: {
      '@type': 'Person',
      name: experience.author || 'Community Member',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Frontend Junction',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.frontend-junction.com/apple-touch-icon.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': currentUrl,
    },
  };

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
        name: 'Interview Experiences',
        item: 'https://www.frontend-junction.com/interview-experience',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: experience.title,
        item: currentUrl,
      },
    ],
  };

  const titleWords = experience.title.split(' ');
  const companyName = titleWords[0];

  const faqs = [
    {
      question: `What is the interview process at ${companyName}?`,
      answer: `The interview process at ${companyName} typically includes a recruiter screen, technical phone interview, and onsite rounds covering coding, system design, and behavioral questions. Read this experience for specific details.`,
    },
    {
      question: `How to prepare for ${companyName} frontend interview?`,
      answer: `Focus on JavaScript fundamentals, React concepts, CSS layout, system design for frontend, and practice coding challenges. Review real interview experiences like this one on Frontend Junction.`,
    },
    {
      question: `What questions are asked in ${companyName} frontend interview?`,
      answer: `Common topics include DOM manipulation, React lifecycle, state management, performance optimization, accessibility, and frontend system design. This experience shares specific questions encountered.`,
    },
  ];

  return (
    <div className='min-h-screen bg-background text-foreground pt-24 pb-16'>
      {/* Inject Structured Data */}
      <Script
        id={`json-ld-article-${slug}`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <Script
        id={`json-ld-breadcrumb-${slug}`}
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbLd).replace(/</g, '\\u003c'),
        }}
      />
      <FaqSchema faqs={faqs} />

      <div className='container mx-auto px-4 max-w-4xl'>
        {/* Back Link */}
        <Link
          href='/interview-experience'
          className='text-muted-foreground hover:text-primary mb-8 inline-block transition-colors'
        >
          &larr; Back to all experiences
        </Link>

        <article className='bg-card text-card-foreground rounded-3xl p-8 md:p-12 shadow-xl border border-border'>
          {/* Header */}
          <header className='mb-10 text-center md:text-left'>
            <div className='flex gap-2 mb-6 justify-center md:justify-start flex-wrap'>
              {experience.tags?.map((tag: string) => (
                <span
                  key={tag}
                  className='px-3 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 text-sm font-medium'
                >
                  #{tag}
                </span>
              ))}
            </div>

            <h1 className='text-xl md:text-2xl font-bold text-foreground mb-6 leading-snug'>
              {experience.title}
            </h1>

            <div className='flex flex-wrap items-center justify-center md:justify-start gap-6 text-muted-foreground border-b border-border pb-8'>
              <div className='flex items-center gap-2'>
                <FaUser className='w-4 h-4' />
                <span className='font-medium'>{experience.author}</span>
              </div>
              <div className='flex items-center gap-2'>
                <FaCalendar className='w-4 h-4' />
                <span>
                  {new Date(experience.date).toLocaleDateString(undefined, {
                    dateStyle: 'long',
                  })}
                </span>
              </div>
              <div className='flex items-center gap-2'>
                <ViewCounter
                  slug={experience.id}
                  apiPath='/api/interview/view'
                />
              </div>
              <div className='px-2 py-0.5 rounded border border-border text-xs uppercase tracking-wider font-semibold'>
                {experience.source}
              </div>
            </div>
          </header>

          {/* Content Analysis (AI Generated or Raw) */}
          <div className='prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl'>
            {experience.content?.trim().startsWith('<') ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: sanitizeHtml(experience.content),
                }}
              />
            ) : (
              <ReactMarkdown>
                {experience.content || experience.summary || ''}
              </ReactMarkdown>
            )}
          </div>

          {/* Original Source CTA */}
          <div className='mt-16 pt-10 border-t border-border bg-muted/30 -mx-8 -mb-8 md:-mx-12 md:-mb-12 p-8 md:p-12 rounded-b-3xl flex flex-col items-center text-center'>
            <h4 className='font-bold text-xl mb-2 text-foreground'>
              Original Source
            </h4>
            <p className='text-muted-foreground mb-6 max-w-lg'>
              This experience was originally published on {experience.source}.
              Support the author by visiting the original post.
            </p>

            {experience.original_link && (
              <Link
                href={experience.original_link}
                target='_blank'
                rel='noopener noreferrer'
                className='flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold hover:opacity-90 transition-all transform hover:-translate-y-0.5'
              >
                Read on {experience.source}
                <FaExternalLinkAlt className='w-4 h-4' />
              </Link>
            )}
          </div>
        </article>

        {/* Jobs CTA */}
        <div className='mt-8 p-6 rounded-2xl border border-primary/20 bg-primary/5 text-center'>
          <p className='text-lg font-semibold mb-2'>Ready to apply?</p>
          <p className='text-muted-foreground text-sm mb-4'>
            Browse open frontend positions at top companies
          </p>
          <a
            href='https://onlyfrontendjobs.com?utm_source=frontend-junction&utm_medium=experience-page'
            target='_blank'
            rel='noopener noreferrer'
            className='inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity'
          >
            Browse Frontend Jobs →
          </a>
        </div>
      </div>
    </div>
  );
}
