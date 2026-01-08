import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AuthCodeError() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center p-24'>
      <h1 className='text-4xl font-bold mb-4'>Authentication Error</h1>
      <p className='text-xl mb-8 text-center max-w-lg'>
        We encountered an error while validating your login. This usually
        happens if the link has expired or was already used.
      </p>
      <Link href='/'>
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
