export default function Loading() {
  return (
    <div className='flex flex-col min-h-screen w-full animate-pulse'>
      {/* Hero Skeleton */}
      <section className='pt-32 pb-20 lg:pt-48 lg:pb-32'>
        <div className='container px-4 mx-auto text-center'>
          <div className='h-6 w-48 bg-muted/20 rounded-full mx-auto mb-6' />
          <div className='h-16 w-3/4 bg-muted/20 rounded-xl mx-auto mb-4' />
          <div className='h-8 w-1/2 bg-muted/10 rounded-lg mx-auto mb-10' />
          <div className='h-14 w-full max-w-xl bg-muted/20 rounded-full mx-auto mb-10' />
          <div className='h-12 w-40 bg-muted/20 rounded-full mx-auto' />
        </div>
      </section>

      {/* Stats Skeleton */}
      <section className='py-12'>
        <div className='container mx-auto px-4'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[...Array(4)].map((_, i) => (
              <div key={i} className='h-24 bg-muted/10 rounded-xl' />
            ))}
          </div>
        </div>
      </section>

      {/* Cards Skeleton */}
      <section className='py-20 container mx-auto px-4'>
        <div className='h-10 w-48 bg-muted/20 rounded-lg mb-8' />
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {[...Array(6)].map((_, i) => (
            <div key={i} className='h-64 bg-muted/10 rounded-2xl' />
          ))}
        </div>
      </section>
    </div>
  );
}
