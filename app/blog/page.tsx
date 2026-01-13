import { posts } from '#site/content';
import { PostItem } from '@/components/post-item';
import { QueryPagination } from '@/components/query-pagination';
import { Tag } from '@/components/tag';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAllTags, sortPosts, sortTagsByCount } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Frontend Development Insights & Tutorials',
  description:
    'Deep dives into frontend development, performance optimization, React patterns, CSS techniques, and industry best practices from the Frontend Junction community.',
};

const POSTS_PER_PAGE = 6; // Changed to 6 for better grid (2x3)

interface BlogPageProps {
  searchParams: {
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const currentPage = Number(searchParams?.page) || 1;
  const sortedPosts = sortPosts(posts.filter((post) => post.published));
  const totalPages = Math.ceil(sortedPosts.length / POSTS_PER_PAGE);

  const displayPosts = sortedPosts.slice(
    POSTS_PER_PAGE * (currentPage - 1),
    POSTS_PER_PAGE * currentPage
  );

  const tags = getAllTags(posts);
  const sortedTags = sortTagsByCount(tags);

  return (
    <div className='container max-w-6xl py-6 lg:py-10 mt-10'>
      <div className='flex flex-col items-center text-center gap-4 mb-8'>
        <h1 className='inline-block font-black text-4xl lg:text-5xl'>Blog</h1>
        <p className='text-xl text-muted-foreground'>
          Gyan on all things web dev.
        </p>
      </div>

      <div className='mb-8'>
        <Card className='border-0 shadow-none bg-transparent'>
          <CardContent className='flex flex-wrapjustify-center gap-2 p-0'>
            <div className="flex flex-wrap justify-center gap-2">
              {sortedTags?.slice(0, 10).map((tag) => (
                <Tag tag={tag} key={tag} count={tags[tag]} />
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

      <QueryPagination
        totalPages={totalPages}
        className='justify-center mt-8'
      />
    </div>
  );
}
