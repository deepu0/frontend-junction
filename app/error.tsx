'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
      <h1 className='text-5xl font-black text-destructive mb-4'>Oops!</h1>
      <h2 className='text-xl font-bold mb-2'>Something went wrong</h2>
      <p className='text-muted-foreground mb-8 max-w-md'>
        An unexpected error occurred. Please try again or navigate to another
        page.
      </p>
      <div className='flex flex-wrap gap-4 justify-center'>
        <button
          onClick={reset}
          className='px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity'
        >
          Try Again
        </button>
        <Link
          href='/'
          className='px-6 py-3 rounded-lg border border-border font-semibold hover:bg-accent transition-colors'
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
