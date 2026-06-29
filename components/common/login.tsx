'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import handleLogin from '@/lib/handleLogin';
import { useLoading } from './loader';
import { useRouter } from 'next/navigation';

interface ILoginProps {
  path?: string;
}

export default function Login({ path = '' }: ILoginProps) {
  const { loading, setLoading } = useLoading();
  const router = useRouter();
  const pathname = usePathname();
  const nextPath = pathname === '/' ? '' : pathname;
  // If we are on the home page, redirect to /add-experience after login
  // If we are on another page, we might want to return there, but for now enforcing add-experience per original logic
  const targetPath = '/add-experience';
  const redirectTo = `/auth/callback?next=${targetPath}`;

  const onClickLogin = async () => {
    try {
      setLoading(true);
      await handleLogin({
        provider: 'google',
        redirectTo: path || redirectTo,
      });
      // Don't do anything here - Supabase will redirect the browser
    } catch (error) {
      console.error('Login failed:', error);
      setLoading(false);
      router.refresh();
    }
  };
  return (
    <Button
      className='flex items-center gap-2 bg-red-800 hover:bg-red-500'
      variant='outline'
      onClick={onClickLogin}
      disabled={loading}
    >
      Sign in with
      <Image
        style={{ height: '20px', width: 'auto' }}
        src='/companies/google.svg'
        alt='Google logo'
        width={20}
        height={20}
      />
    </Button>
  );
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
