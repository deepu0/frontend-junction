import { Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from './ui/button';
import { cn, formatDate } from '@/lib/utils';
import { Tag } from './tag';
import ViewCounter from './view-counter';

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
    <article className='flex flex-col gap-2 border-border border-b py-3'>
      {image && (
        <div className='relative aspect-video mb-4 overflow-hidden rounded-lg border border-border'>
          <Image
            src={typeof image === 'string' ? image : image.src}
            alt={title}
            fill
            className='object-cover transition-transform hover:scale-105 duration-500'
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          />
        </div>
      )}
      <div>
        <h2 className='text-2xl font-bold'>
          <Link href={'/' + slug}>{title}</Link>
        </h2>
      </div>
      <div className='flex gap-2'>
        {tags?.map((tag) => <Tag tag={tag} key={tag} />)}
      </div>
      <div className='max-w-none text-muted-foreground'>{description}</div>
      <div className='flex justify-between items-center'>
        <dl>
          <dt className='sr-only'>Published On</dt>
          <dd className='text-sm sm:text-base font-medium flex items-center gap-1'>
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
            className={cn(buttonVariants({ variant: 'link' }), 'py-0')}
          >
            Read more →
          </Link>
        </div>
      </div>
    </article>
  );
}
