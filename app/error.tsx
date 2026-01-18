'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='min-h-screen flex flex-col items-center justify-center p-4'>
      <div className='max-w-md w-full bg-card border border-border rounded-2xl p-8 text-center'>
        <div className='mb-6'>
          <div className='w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4'>
            <svg
              className='w-8 h-8 text-destructive'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
              />
            </svg>
          </div>
          <h2 className='text-2xl font-bold text-foreground mb-2'>
            Something went wrong!
          </h2>
          <p className='text-muted-foreground'>
            We encountered an unexpected error. Please try again.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <div className='mb-6 p-4 bg-muted rounded-lg text-left'>
            <p className='text-sm font-mono text-destructive break-words'>
              {error.message}
            </p>
          </div>
        )}

        <button
          onClick={reset}
          className='w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors'
        >
          Try again
        </button>
      </div>
    </div>
  );
}
