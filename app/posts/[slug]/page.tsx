import fs from 'fs';
import Head from 'next/head';
import matter from 'gray-matter';
import getPostMetadata from '@/lib/getPostMetaData';
import MarkdownRenderer from '@/components/markdown-renderer';
import { Metadata } from 'next';

const getPostContent = (slug: string) => {
  const folder = 'posts/';
  const file = `${folder}${slug}.md`;
  const content = fs.readFileSync(file, 'utf8');
  const matterResult = matter(content);
  return matterResult;
};

export const generateStaticParams = async () => {
  const posts = getPostMetadata();
  return posts.map((post: any) => ({
    slug: post.slug,
  }));
};

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const slug = params.slug;

  const { data: post } = getPostContent(slug);

  if (!post) {
    return {};
  }

  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('title', post.title);

  return {
    title: post.title,
    description: post.description,
    authors: { name: 'Deepak' },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      url: post.slug,
      images: [
        {
          url: `/api/og?${ogSearchParams.toString()}`,
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

const PostPage = (props: any) => {
  const slug = props.params.slug;
  const post = getPostContent(slug);
  const h2Style: React.CSSProperties = {
    color: '#ff5733',
    fontSize: '24px',
    margin: '20px 0',
  };
  const aStyle: React.CSSProperties = {
    color: '#ff5733',
  };

  const strongStyle: React.CSSProperties = {
    color: '#33aaff',
    fontWeight: 'bold',
  };
  const preStyle: React.CSSProperties = {
    color: 'greenyellow',
  };

  return (
    <div className='mt-20'>
      <div className=' text-center'>
        <h1 className='text-3xl text-white-600'>{post.data.title}</h1>
        <p className='text-orange-400 mt-2'>{post.data.date}</p>
      </div>
      <article className='prose p-10 text-white m-auto'>
        <MarkdownRenderer
          content={post.content}
          h2Style={h2Style}
          strongStyle={strongStyle}
          aStyle={aStyle}
          preStyle={preStyle}
        />
      </article>
    </div>
  );
};

export default PostPage;
