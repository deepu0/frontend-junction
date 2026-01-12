'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/session-provider';
import Login from './login';
import Profile from './profile';
import { motion } from 'framer-motion';

import { ModeToggle } from '@/components/mode-toggle';
import { Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

export function SiteHeader() {
  const { user } = useAuth();
  const pathname = usePathname();

  const navItems = [
    { name: 'Explore', href: '/interview-experience' },
    { name: 'Blog', href: '/blog' },
    { name: 'Jobs', href: '/jobs', disabled: true },
    { name: 'Mentorship', href: 'https://topmate.io/deepak_sharma' },
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

          <nav className='hidden md:flex items-center gap-4'>
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                target={item.href.startsWith('http') ? '_blank' : undefined}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary whitespace-nowrap',
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
          <div className='hidden md:flex items-center gap-4 mr-2'>
            <ModeToggle />
            {user ? <Profile /> : <Login path={pathname} />}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant='ghost'
                className='px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden'
              >
                <Menu className='h-6 w-6' />
                <span className='sr-only'>Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side='left' className='pr-0'>
              <SheetHeader>
                <SheetTitle className='text-left font-bold'>Menu</SheetTitle>
              </SheetHeader>
              <nav className='flex flex-col gap-4 mt-8'>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-primary',
                      pathname === item.href
                        ? 'text-foreground font-bold'
                        : 'text-muted-foreground',
                      item.disabled && 'opacity-50 cursor-not-allowed'
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
            </SheetContent>
          </Sheet>

          {/* Mobile Tools (visible only on mobile) */}
          <div className='flex md:hidden items-center gap-2'>
            <ModeToggle />
            {user ? <Profile /> : <Login path={pathname} />}
          </div>
        </div>
      </div>
    </header>
  );
}
