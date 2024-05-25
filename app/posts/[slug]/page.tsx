import fs from 'fs';
import Head from 'next/head';
import matter from 'gray-matter';
import getPostMetadata from '@/lib/getPostMetaData';
import MarkdownRenderer from '@/components/markdown-renderer';

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
  const ogImageUrl = `/opengraph-image.jpeg`;

  return (
    <div className='mt-20'>
      <Head>
        <title>{post.data.title}</title>
        <meta
          name='description'
          content={post.data.subtitle || post.data.description}
        />
        <meta property='og:title' content={post.data.title} />
        <meta
          property='og:description'
          content={post.data.subtitle || post.data.description}
        />
        <meta property='og:type' content='article' />
        <meta
          property='og:url'
          content={`https://frontend-junction.com/posts/${slug}`}
        />
        <meta property='og:image' content={ogImageUrl} />
        <meta name='twitter:card' content='summary_large_image' />
        <meta name='twitter:title' content={post.data.title} />
        <meta
          name='twitter:description'
          content={post.data.subtitle || post.data.description}
        />
        <meta name='twitter:image' content={ogImageUrl} />
      </Head>
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
