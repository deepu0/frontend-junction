// components/hero/HeroSection.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef, memo } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

// ✅ DIRECT IMPORT - No dynamic, no ssr:false
import FloatingLogos from '@/components/hero/floating-logos';

// Memoized Hero Content to prevent re-renders when high-level state updates
const HeroContent = memo(
  ({
    search,
    setSearch,
    handleSearch,
    searchRef,
    setShowPreview,
    isSearching,
    results,
    showPreview,
  }: any) => {
    return (
      <div className='container px-4 mx-auto text-center'>
        <div className='animate-in fade-in slide-in-from-bottom-4 duration-1000'>
          <span className='inline-block py-1 px-3 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-6'>
            ✨ The Ultimate Career Junction for Frontend Devs
          </span>

          <h1 className='text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/70'>
            Curated Frontend <br className='hidden md:block' />
            <span className='text-primary'>Experiences & Jobs</span>
          </h1>

          <p className='max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed'>
            Discover verified interview stories, handpicked job opportunities,
            and insider insights from top tech companies. No noise, just your
            next career move.
          </p>

          {/* Search */}
          <div className='max-w-xl mx-auto mb-10 relative z-20' ref={searchRef}>
            <form onSubmit={handleSearch} className='relative group'>
              <div className='absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity' />
              <div className='relative flex items-center bg-background/80 backdrop-blur-md border border-border rounded-full p-2 shadow-2xl ring-1 ring-primary/5 focus-within:ring-primary/50 transition-all'>
                <FaSearch className='ml-4 text-muted-foreground' />
                <input
                  type='text'
                  placeholder='Search companies, roles, or skills...'
                  className='flex-1 bg-transparent border-none focus:outline-none px-4 py-3 text-foreground placeholder:text-muted-foreground'
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onFocus={() => search.length >= 2 && setShowPreview(true)}
                />
                <button
                  type='submit'
                  className='px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full transition-all active:scale-95'
                >
                  Search
                </button>
              </div>
            </form>

            <AnimatePresence>
              {showPreview && (results.length > 0 || isSearching) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className='absolute top-full left-0 right-0 mt-3 bg-background/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl overflow-hidden z-50 text-left'
                >
                  <div className='p-2'>
                    {isSearching && results.length === 0 ? (
                      <div className='p-4 text-center text-muted-foreground'>
                        Searching...
                      </div>
                    ) : (
                      results.map((res: any) => {
                        const path = res.slug
                          ? `/interview-experience/${res.slug}`
                          : `/interview-experience/${res.type}-${res.id}`;
                        return (
                          <Link
                            key={`${res.type}-${res.id}`}
                            href={path}
                            className='flex items-center gap-3 p-3 hover:bg-accent rounded-xl transition-colors group'
                            onClick={() => setShowPreview(false)}
                          >
                            <div className='w-10 h-10 rounded-lg bg-accent flex items-center justify-center text-lg'>
                              💼
                            </div>
                            <div className='flex-1 overflow-hidden'>
                              <div className='font-medium text-foreground truncate group-hover:text-primary transition-colors'>
                                {res.title}
                              </div>
                              <div className='text-xs text-muted-foreground truncate'>
                                {res.company}
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* CTA */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4 pb-16'>
            <Link href='/interview-experience'>
              <button className='px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all backdrop-blur-sm active:scale-95 duration-200'>
                Browse Experiences
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
);

HeroContent.displayName = 'HeroContent';

export default function HeroSection() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const supabase = getSupabaseBrowserClient();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowPreview(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchPreview = async () => {
      if (search.trim().length < 2) {
        setResults([]);
        return;
      }
      setIsSearching(true);
      try {
        const [{ data: d1 }, { data: d2 }, { data: d3 }] = await Promise.all([
          supabase
            .from('experiences')
            .select('id, title, company_name, slug')
            .ilike('title', `%${search}%`)
            .limit(2),
          supabase
            .from('new_interview')
            .select('id, title, company, slug')
            .ilike('title', `%${search}%`)
            .limit(2),
          supabase
            .from('scraped_experiences')
            .select('id, title, company, slug')
            .ilike('title', `%${search}%`)
            .limit(2),
        ]);

        const combined = [
          ...(d1?.map((i) => ({
            ...i,
            type: 'legacy',
            company: i.company_name,
          })) || []),
          ...(d2?.map((i) => ({ ...i, type: 'user' })) || []),
          ...(d3?.map((i) => ({ ...i, type: 'scraped' })) || []),
        ].slice(0, 5);

        setResults(combined);
        setShowPreview(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    };

    const timer = setTimeout(fetchPreview, 300);
    return () => clearTimeout(timer);
  }, [search, supabase]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/interview-experience?search=${encodeURIComponent(search)}`);
    }
  };

  return (
    <section className='relative min-h-screen'>
      {/* Background - Optimized with Hardware Acceleration */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[80px] md:blur-[120px] will-change-transform' />
        <div className='absolute top-40 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[80px] md:blur-[120px] will-change-transform' />
      </div>

      <div className='relative z-10'>
        {/* Navbar spacing */}
        <div className='h-16 sm:h-20' />

        {/* 🚂 Train */}
        <div className='relative w-screen left-1/2 -translate-x-1/2 mb-8 sm:mb-10 md:mb-12'>
          <FloatingLogos />
        </div>

        {/* Memoized Hero Content */}
        <HeroContent
          search={search}
          setSearch={setSearch}
          handleSearch={handleSearch}
          searchRef={searchRef}
          setShowPreview={setShowPreview}
          isSearching={isSearching}
          results={results}
          showPreview={showPreview}
        />
      </div>
    </section>
  );
}
