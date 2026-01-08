'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/session-provider';
import Login from './login';
import Profile from './profile';
import { motion } from 'framer-motion';

import { ModeToggle } from '@/components/mode-toggle';

export function SiteHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Explore', href: '/interview-experience' },
    { name: 'Jobs', href: '/jobs', disabled: true },
    { name: 'Mentorship', href: '/mentorship', disabled: true },
  ];

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60'>
      <div className='container flex h-16 items-center justify-between px-4'>
        <div className='flex items-center gap-8'>
          <Link href='/' className='flex items-center gap-2 group'>
            <div className='relative flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 group-hover:bg-primary/30 transition-colors'>
              <span className='text-lg font-bold text-primary'>FJ</span>
            </div>
            <span className='hidden font-bold sm:inline-block text-lg tracking-tight text-foreground group-hover:text-primary transition-colors'>
              Frontend Junction
            </span>
          </Link>

          <nav className='hidden md:flex items-center gap-6'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-muted-foreground',
                  item.disabled &&
                    'pointer-events-none opacity-50 cursor-not-allowed'
                )}
              >
                {item.name}
                {item.disabled && (
                  <span className='ml-1.5 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold text-primary'>
                    SOON
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className='flex items-center gap-4'>
          <ModeToggle />
          {user ? <Profile /> : <Login path={pathname} />}
        </div>
      </div>
    </header>
  );
}
