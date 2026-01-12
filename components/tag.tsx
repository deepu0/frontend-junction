import Link from 'next/link';
import { slug } from 'github-slugger';
import { badgeVariants } from './ui/badge';
import { cn } from '@/lib/utils';

interface TagProps {
  tag: string;
  current?: boolean;
  count?: number;
}
export function Tag({ tag, current, count }: TagProps) {
  return (
    <Link
      className={badgeVariants({
        variant: current ? 'default' : 'outline',
        className: cn(
          'no-underline rounded-md',
          !current &&
            'bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors'
        ),
      })}
      href={`/tags/${slug(tag)}`}
    >
      {tag} {count ? `(${count})` : null}
    </Link>
  );
}
