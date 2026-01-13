import { Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from './ui/button';
import { cn, formatDate } from '@/lib/utils';
import { Tag } from './tag';
import ViewCounter from './view-counter';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';

interface PostItemProps {
  slug: string;
  title: string;
  description?: string;
  date: string;
  image?: string | { src: string; width: number; height: number };
  tags?: Array<string>;
}

export function PostItem({
  slug,
  title,
  description,
  date,
  image,
  tags,
}: PostItemProps) {
  return (
    <Card className='flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300'>
      {image && (
        <div className='relative aspect-video w-full overflow-hidden'>
          <Image
            src={typeof image === 'string' ? image : image.src}
            alt={title}
            fill
            className='object-cover transition-transform hover:scale-105 duration-500'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      )}
      <CardHeader>
        <div className='flex gap-2 mb-2'>
          {tags?.map((tag) => <Tag tag={tag} key={tag} />)}
        </div>
        <h2 className='text-2xl font-bold leading-tight'>
          <Link
            href={'/' + slug}
            className='hover:text-primary transition-colors'
          >
            {title}
          </Link>
        </h2>
      </CardHeader>
      <CardContent className='flex-grow'>
        <div className='text-muted-foreground line-clamp-3'>{description}</div>
      </CardContent>
      <CardFooter className='flex justify-between items-center text-sm text-muted-foreground border-t bg-muted/20 p-4'>
        <dl>
          <dt className='sr-only'>Published On</dt>
          <dd className='flex items-center gap-1'>
            <Calendar className='h-4 w-4' />
            <time dateTime={date}>{formatDate(date)}</time>
          </dd>
        </dl>
        <div className='flex items-center gap-4'>
          <ViewCounter
            slug={slug.split('/').slice(1).join('/')}
            noIncrement={true}
          />
          <Link
            href={'/' + slug}
            className={cn(
              buttonVariants({ variant: 'link' }),
              'py-0 h-auto px-0'
            )}
          >
            Read more →
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
