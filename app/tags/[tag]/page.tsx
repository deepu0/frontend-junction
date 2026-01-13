import { posts } from '#site/content';
import { PostItem } from '@/components/post-item';
import { Tag } from '@/components/tag';
import { Card, CardContent } from '@/components/ui/card';
import { getAllTags, getPostsByTagSlug, sortTagsByCount } from '@/lib/utils';
import { slug } from 'github-slugger';
import { Metadata } from 'next';

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateMetadata({
  params,
}: TagPageProps): Promise<Metadata> {
  const { tag } = params;
  return {
    title: tag,
    description: `Posts on the topic of ${tag}`,
  };
}

export const generateStaticParams = () => {
  const tags = getAllTags(posts);
  const paths = Object.keys(tags).map((tag) => ({ tag: slug(tag) }));
  return paths;
};

export default function TagPage({ params }: TagPageProps) {
  const { tag } = params;
  const title = tag.split('-').join(' ');

  const displayPosts = getPostsByTagSlug(posts, tag);
  const tags = getAllTags(posts);
  const sortedTags = sortTagsByCount(tags);

  return (
    <div className='container max-w-6xl py-6 lg:py-10 mt-10'>
      <div className='flex flex-col items-center text-center gap-4 mb-8'>
        <h1 className='inline-block font-black text-4xl lg:text-5xl capitalize'>
          {title}
        </h1>
        <p className='text-xl text-muted-foreground'>Posts about {title}</p>
      </div>

      <div className='mb-8'>
        <Card className='border-0 shadow-none bg-transparent'>
          <CardContent className='flex flex-wrap justify-center gap-2 p-0'>
            <div className='flex flex-wrap justify-center gap-2'>
              {sortedTags
                ?.slice(0, 10)
                .map((t) => (
                  <Tag
                    tag={t}
                    key={t}
                    count={tags[t]}
                    current={slug(t) === tag}
                  />
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <hr className='mb-8' />

      {displayPosts?.length > 0 ? (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {displayPosts.map((post) => {
            const { slug, date, title, description, tags } = post;
            return (
              <PostItem
                key={slug}
                slug={slug}
                date={date}
                title={title}
                description={description}
                tags={tags}
                image={post.image}
              />
            );
          })}
        </div>
      ) : (
        <p>Nothing to see here yet</p>
      )}
    </div>
  );
}
