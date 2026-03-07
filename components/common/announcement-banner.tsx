'use client';

import React from 'react';
import Link from 'next/link';

export function AnnouncementBanner() {
  return (
    <div className='bg-primary text-primary-foreground text-sm font-medium'>
      <div className='container flex items-center justify-center gap-2 px-4 py-2 relative'>
        <span>🎯 Looking for frontend-only jobs?</span>
        <Link
          href='https://onlyfrontendjobs.com?utm_source=frontend-junction&utm_medium=banner&utm_campaign=jobs-promotion'
          target='_blank'
          rel='noopener noreferrer'
          className='underline underline-offset-2 font-semibold hover:opacity-80 transition-opacity whitespace-nowrap'
        >
          Visit OnlyFrontendJobs.com →
        </Link>
      </div>
    </div>
  );
}
