'use client';
import Link from 'next/link';
import { ModeToggle } from './toggle-theme';
import Image from 'next/image';
import { useTheme } from 'next-themes';
import Login from './login';
import { useAuth } from '../session-provider';
import Profile from './profile';
import LogoSvg from '../../public/l.svg';

export function SiteHeader() {
  const { user = '' } = useAuth();
  const { theme } = useTheme();

  return (
    <header
      className={`z-[50] fixed top-0 w-full border-b ${theme === 'light' ? 'bg-white-200' : 'bg-gray-800'} `}
    >
      <div className='container mb-2 mt-2 flex content-center items-center justify-between text-base'>
        <Link href='/'>
          <Image
            src='/logo-white.png'
            alt='Frontend Junction'
            width={170}
            height={60}
          />
        </Link>
        <div className='flex flex-1 items-center  space-x-2 justify-end'>
          <nav className='flex items-center gap-2'>
            {/* <ModeToggle /> */}
            {user ? <Profile /> : <Login />}
          </nav>
        </div>
      </div>
    </header>
  );
}
