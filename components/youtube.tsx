import { cn } from '@/lib/utils';

interface YouTubeProps {
  id: string;
  title?: string;
  className?: string;
}

export function YouTube({
  id,
  title = 'YouTube video player',
  className,
}: YouTubeProps) {
  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-xl aspect-video my-8',
        className
      )}
    >
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title}
        allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
        allowFullScreen
        sandbox='allow-scripts allow-presentation'
        className='absolute top-0 left-0 w-full h-full border-0'
      />
    </div>
  );
}
