'use client';

import { FaLinkedinIn, FaTwitter, FaLink } from 'react-icons/fa';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { cn } from '@/lib/utils';

interface ShareButtonsProps {
  url: string;
  title: string;
  className?: string;
}

export function ShareButtons({ url, title, className }: ShareButtonsProps) {
  const { toast } = useToast();
  const fullUrl = `https://www.frontend-junction.com${url}`;

  const shareLinks = [
    {
      name: 'LinkedIn',
      icon: FaLinkedinIn,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(fullUrl)}`,
      color: 'hover:text-[#0077b5]',
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(fullUrl)}`,
      color: 'hover:text-[#1DA1F2]',
    },
  ];

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullUrl);
    toast({
      title: 'Link Copied!',
      description: 'The blog post link has been copied to your clipboard.',
    });
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className='text-sm font-medium text-muted-foreground mr-2'>
        Share:
      </span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target='_blank'
          rel='noopener noreferrer'
          className={cn(
            'p-2 rounded-full border border-border bg-background hover:bg-muted transition-all duration-300 shadow-sm',
            link.color
          )}
          aria-label={`Share on ${link.name}`}
        >
          <link.icon className='w-4 h-4' />
        </a>
      ))}
      <button
        type="button"
        onClick={copyToClipboard}
        className='p-2 rounded-full border border-border bg-background hover:bg-muted transition-all duration-300 hover:text-primary shadow-sm'
        aria-label='Copy link'
      >
        <FaLink className='w-4 h-4' />
      </button>
    </div>
  );
}
