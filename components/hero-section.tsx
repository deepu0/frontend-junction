'use client';

import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/interview-experience?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section className='relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden'>
      {/* Background Decorations */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl mx-auto pointer-events-none'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px]' />
        <div className='absolute bottom-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[120px]' />
      </div>

      <div className='container px-4 mx-auto relative z-10 text-center'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className='inline-block py-1 px-3 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6 backdrop-blur-sm'>
            ✨ The Ultimate Career Hub for Frontend Devs
          </span>

          <h1 className='text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-gray-400'>
            Curated Frontend <br className='hidden md:block' />
            <span className='text-primary'>Experiences & Jobs</span>
          </h1>

          <p className='max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed'>
            Discover verified interview stories, handpicked job opportunities,
            and insider insights from top tech companies. No noise, just your
            next career move.
          </p>

          {/* Unified Search Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className='max-w-xl mx-auto mb-10'
          >
            <form onSubmit={handleSearch} className='relative group'>
              <div className='absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='relative flex items-center bg-background/80 backdrop-blur-xl border border-white/10 rounded-full p-2 shadow-2xl ring-1 ring-white/5 focus-within:ring-primary/50 transition-all'>
                <FaSearch className='ml-4 text-muted-foreground' />
                <input
                  type='text'
                  placeholder='Search companies, roles, or skills...'
                  className='flex-1 bg-transparent border-none focus:outline-none px-4 py-3 text-foreground placeholder:text-muted-foreground'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button
                  type='submit'
                  className='px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full transition-colors'
                >
                  Search
                </button>
              </div>
            </form>
          </motion.div>

          {/* CTAs */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link href='/interview-experience'>
              <button className='px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all backdrop-blur-sm'>
                Browse Experiences
              </button>
            </Link>
            {/* 
                        <Link href="/jobs">
                            <button className="px-8 py-3.5 rounded-full bg-transparent hover:bg-white/5 border border-white/10 text-white font-medium transition-all">
                                Find Jobs
                            </button>
                        </Link> 
                        */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
