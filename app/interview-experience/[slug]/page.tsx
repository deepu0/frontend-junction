import { getExperienceBySlug } from '@/lib/getExperienceBySlug';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { FaExternalLinkAlt, FaCalendar, FaUser } from 'react-icons/fa';
import { Metadata } from 'next';
import ReactMarkdown from 'react-markdown';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // ISR

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const experience = await getExperienceBySlug(params.slug);
  if (!experience) return { title: 'Not Found' };

  return {
    title: `${experience.title} | Frontend Junction`,
    description: experience.summary?.substring(0, 160),
    openGraph: {
      title: experience.title,
      description: experience.summary?.substring(0, 160),
      type: 'article',
      authors: [experience.author as string],
    },
  };
}

export default async function ExperienceSlugPage({ params }: Props) {
  const experience = await getExperienceBySlug(params.slug);

  if (!experience) {
    notFound();
  }

  return (
    <div className='min-h-screen bg-background text-foreground pt-24 pb-16'>
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

            <h1 className='text-3xl md:text-5xl font-bold text-foreground mb-6 leading-tight'>
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
              <div className='px-2 py-0.5 rounded border border-border text-xs uppercase tracking-wider font-semibold'>
                {experience.source}
              </div>
            </div>
          </header>

          {/* Content Analysis (AI Generated or Raw) */}
          <div className='prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary hover:prose-a:underline prose-img:rounded-xl'>
            <ReactMarkdown>
              {experience.content || experience.summary || ''}
            </ReactMarkdown>
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
      </div>
    </div>
  );
}
