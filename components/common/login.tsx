'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { revalidatePath } from 'next/cache';
import { usePathname } from 'next/navigation';
import React from 'react';
import handleLogin from '@/lib/handleLogin';
import { useLoading } from './loader';
import { useRouter } from 'next/navigation';

ILogin: {
}
export default function Login({ path = '' }: any) {
  const { loading, setLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const redirectTo = `/auth/callback?next=${pathname}`;

  const onClickLogin = async () => {
    setLoading(true);
    await handleLogin({
      provider: 'google',
      redirectTo: path || redirectTo,
    });
    revalidatePath('/', 'layout');

    //await delay(2000);
    router.refresh();

    setLoading(false);
  };
  return (
    <Button
      className='flex items-center gap-2 bg-red-800 hover:bg-red-500'
      variant='outline'
      onClick={onClickLogin}
      disabled={loading}
    >
      Sign in with
      <img
        style={{ height: '20px' }}
        src='/companies/google.svg'
        alt='google'
      />
    </Button>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
