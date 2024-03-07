'use client';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@supabase/ssr';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function Login() {
  const pathname = usePathname();
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback?next=${pathname}`,
      },
    });
  };

  return (
    <Button
      className='flex items-center gap-2 bg-red-800 hover:bg-red-500'
      variant='outline'
      onClick={handleLogin}
    >
      Sign in with{' '}
      <img
        style={{ height: '20px' }}
        src='/companies/google.svg'
        alt='google'
      />
    </Button>
  );
}
