import { posts } from '#site/content';
import { MDXContent } from '@/components/mdx-components';
import { notFound } from 'next/navigation';
import Image from 'next/image';

import '@/styles/mdx.css';
import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import { Tag } from '@/components/tag';
import ViewCounter from '@/components/view-counter';
import { ShareButtons } from '@/components/share-buttons';
interface PostPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

async function getPostFromParams(params: { slug: string[] }) {
  const slug = params?.slug?.join('/');
  const post = posts.find((post) => post.slugAsParams === slug);

  return post;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = await getPostFromParams(resolvedParams);

  if (!post) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('title', post.title);

  return {
    title: post.title,
    description: post.description,
    authors: { name: siteConfig.author },
    alternates: {
      canonical: post.slug,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: post.slug,
      images: [
        {
          url: new URL(
            `/api/og?${ogSearchParams.toString()}`,
            'https://www.frontend-junction.com'
          ),
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: [`/api/og?${ogSearchParams.toString()}`],
    },
  };
}

export async function generateStaticParams(): Promise<{ slug: string[] }[]> {
  return posts.map((post) => ({ slug: post.slugAsParams.split('/') }));
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params;
  const post = await getPostFromParams(resolvedParams);

  if (!post || !post.published) {
    notFound();
  }

  return (
    <article className='container py-6 prose dark:prose-invert max-w-3xl mx-auto mt-12'>
      <h1 className='mb-2 mt-2'>{post.title}</h1>
      <div className='flex gap-2 mb-2 flex-wrap'>
        {post.tags?.map((tag) => <Tag tag={tag} key={tag} />)}
      </div>
      <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pt-2'>
        <ViewCounter slug={post.slugAsParams} />
        <ShareButtons url={post.slug} title={post.title} />
      </div>
      {post.image && (
        <div className='relative aspect-video my-8 overflow-hidden rounded-xl border border-border'>
          <Image
            src={post.image.src}
            alt={post.title}
            fill
            className='object-cover'
            sizes='(max-width: 768px) 100vw, 800px'
            priority
          />
        </div>
      )}
      {post.description ? (
        <p className='text-xl mt-0 text-muted-foreground'>{post.description}</p>
      ) : null}
      <hr className='my-4' />
      <MDXContent code={post.body} />
    </article>
  );
}
