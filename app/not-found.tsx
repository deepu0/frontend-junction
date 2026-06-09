import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Not Found | Frontend Junction',
  description: 'The page you are looking for does not exist.',
};

export default function NotFound() {
  return (
    <div className='container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 text-center'>
      <h1 className='text-6xl font-black text-primary mb-4'>404</h1>
      <h2 className='text-2xl font-bold mb-2'>Page Not Found</h2>
      <p className='text-muted-foreground mb-8 max-w-md'>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Check out our latest interview experiences or blog posts instead.
      </p>
      <div className='flex flex-wrap gap-4 justify-center'>
        <Link
          href='/interview-experience'
          className='px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity'
        >
          Browse Experiences
        </Link>
        <Link
          href='/blog'
          className='px-6 py-3 rounded-lg border border-border font-semibold hover:bg-accent transition-colors'
        >
          Read Blog
        </Link>
        <Link
          href='/companies'
          className='px-6 py-3 rounded-lg border border-border font-semibold hover:bg-accent transition-colors'
        >
          View Companies
        </Link>
      </div>
    </div>
  );
}
