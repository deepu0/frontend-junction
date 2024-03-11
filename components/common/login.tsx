'use client';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@supabase/ssr';
import { usePathname } from 'next/navigation';
import React from 'react';
import handleLogin from '@/lib/handleLogin';

export default function Login() {
  const pathname = usePathname();
  const redirectTo = `/auth/callback?next=${pathname}`;

  const onClickLogin = async () => {
    await handleLogin({
      provider: 'google',
      redirectTo,
    });
  };

  return (
    <Button
      className='flex items-center gap-2 bg-red-800 hover:bg-red-500'
      variant='outline'
      onClick={onClickLogin}
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
