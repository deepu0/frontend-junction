'use client';

import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';

interface ViewCounterProps {
  slug: string;
  noIncrement?: boolean;
  apiPath?: string;
}

export default function ViewCounter({
  slug,
  noIncrement = false,
  apiPath = '/api/blog/view',
}: ViewCounterProps) {
  const [views, setViews] = useState<number | null>(null);

  // react-doctor-disable-next-line react-doctor/no-fetch-in-effect
  useEffect(() => {
    const fetchViews = async () => {
      try {
        const response = await fetch(`${apiPath}/${slug}`);
        const data = await response.json();
        setViews(typeof data.count === 'number' ? data.count : 0);
      } catch (e) {
        console.error('Failed to fetch views:', e);
        setViews(0);
      }
    };

    const incrementViews = async () => {
      try {
        await fetch(`${apiPath}/${slug}`, { method: 'POST' });
      } catch (e) {
        console.error('Failed to increment views:', e);
      }
    };

    fetchViews();

    if (!noIncrement) {
      const timer = setTimeout(() => {
        incrementViews();
        setViews((prev) => (typeof prev === 'number' ? prev + 1 : 1));
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [slug, noIncrement, apiPath]);

  if (views === null || views === undefined)
    return <div className='w-12 h-4 animate-pulse bg-muted rounded' />;

  return (
    <div className='flex items-center gap-1.5 text-sm text-muted-foreground shrink-0'>
      <Eye className='w-4 h-4' />
      <span>{views.toLocaleString()} views</span>
    </div>
  );
}
