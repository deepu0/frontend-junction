'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const STORAGE_KEY = 'ofj-banner-dismissed';

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(true); // start hidden; updated after hydration

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setDismissed(false);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, '1');
    setDismissed(true);
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className='overflow-hidden'
        >
          <div className='bg-primary text-primary-foreground text-sm font-medium'>
            <div className='container flex items-center justify-center gap-2 px-4 py-2 relative'>
              <span>🎯 Looking for frontend-only jobs?</span>
              <Link
                href='https://onlyfrontendjobs.com'
                target='_blank'
                rel='noopener noreferrer'
                className='underline underline-offset-2 font-semibold hover:opacity-80 transition-opacity whitespace-nowrap'
              >
                Visit OnlyFrontendJobs.com →
              </Link>
              <button
                onClick={() => handleDismiss()}
                aria-label='Dismiss announcement'
                className='absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-primary-foreground/20 transition-colors'
              >
                <X className='h-3.5 w-3.5' />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
