'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

export function MobileStickyCta() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Only show on homepage or interview-experience listing
    const targetPages = ['/', '/interview-experience'];
    if (!targetPages.includes(pathname)) {
      setIsVisible(false);
      return;
    }

    const handleScroll = () => {
      // Show after 300px of scrolling
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [pathname]);

  // Hide if search is active (optional, but cleaner)
  // For now, let's keep it simple

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className='fixed bottom-0 left-0 right-0 z-40 md:hidden p-4 pb-8 bg-background/80 backdrop-blur-xl border-t border-white/10'
        >
          <div className='container mx-auto max-w-sm'>
            <Link href='/interview-experience' passHref>
              <Button
                className='w-full h-12 text-base font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95'
                size='lg'
              >
                Browse All Experiences
              </Button>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
