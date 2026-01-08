'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

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
        // Simple search across titles in parallel
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
    <section className='relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden'>
      {/* Background Decorations with Floating Logos */}
      <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl mx-auto pointer-events-none'>
        <div className='absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-[120px]' />
        <div className='relative top-20 right-10 w-72 h-72 bg-blue-500/20 rounded-full blur-[120px]' />

        {/* Floating Company Logos */}
        <FloatingLogos />
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
            className='max-w-xl mx-auto mb-10 relative'
            ref={searchRef}
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
                  onFocus={() => search.length >= 2 && setShowPreview(true)}
                />
                <button
                  type='submit'
                  className='px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-medium rounded-full transition-colors'
                >
                  Search
                </button>
              </div>
            </form>

            {/* Search Preview Dropdown */}
            <AnimatePresence>
              {showPreview && (results.length > 0 || isSearching) && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className='absolute top-full left-0 right-0 mt-3 bg-background/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 text-left'
                >
                  <div className='p-2'>
                    {isSearching && results.length === 0 ? (
                      <div className='p-4 text-center text-muted-foreground'>
                        Searching...
                      </div>
                    ) : (
                      results.map((res) => {
                        const path = res.slug
                          ? `/interview-experience/${res.slug}`
                          : `/interview-experience/${res.type}-${res.id}`;
                        return (
                          <Link
                            key={`${res.type}-${res.id}`}
                            href={path}
                            className='flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors group'
                            onClick={() => setShowPreview(false)}
                          >
                            <div className='w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-lg'>
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
          </motion.div>

          {/* CTAs */}
          <div className='flex flex-col sm:flex-row items-center justify-center gap-4'>
            <Link href='/interview-experience'>
              <button className='px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-white font-medium transition-all backdrop-blur-sm'>
                Browse Experiences
              </button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Train Animation Component - Frontend Junction Theme 🚂
function FloatingLogos() {
  const logos = [
    { name: 'Google', path: '/companies/Google.png' },
    { name: 'Meta', path: '/companies/Meta.png' },
    { name: 'Microsoft', path: '/companies/Microsoft.png' },
    { name: 'Amazon', path: '/companies/amazon.png' },
    { name: 'Apple', path: '/companies/Apple.png' },
    { name: 'Flipkart', path: '/companies/Flipkart.png' },
    { name: 'Adobe', path: '/companies/Adobe.png' },
    { name: 'Uber', path: '/companies/Uber.png' },
    { name: 'Swiggy', path: '/companies/Swiggy.png' },
    { name: 'Zomato', path: '/companies/Zomato.png' },
    { name: 'Razorpay', path: '/companies/Razorpay.png' },
    { name: 'PhonePe', path: '/companies/PhonePe.png' },
  ];

  // Double for seamless loop
  const allLogos = [...logos, ...logos];

  return (
    <div className='absolute top-16 md:top-20 left-0 right-0 overflow-hidden pointer-events-none z-20'>
      {/* Track */}
      <div className='absolute bottom-2 left-0 right-0 h-0.5 bg-muted-foreground/20' />

      {/* Train - GPU accelerated infinite scroll */}
      <div className='train-container flex items-end'>
        {/* Engine */}
        <div className='flex-shrink-0 mr-1'>
          <div className='w-10 h-8 md:w-14 md:h-10 bg-gradient-to-b from-primary to-primary/80 rounded-t-md rounded-r-lg flex items-center justify-center'>
            <span className='text-[8px] md:text-xs font-bold text-white/90'>
              🚂
            </span>
          </div>
          <div className='flex gap-0.5 justify-center'>
            <div className='w-2 h-2 md:w-3 md:h-3 bg-muted-foreground/60 rounded-full' />
            <div className='w-2 h-2 md:w-3 md:h-3 bg-muted-foreground/60 rounded-full' />
          </div>
        </div>

        {/* Carriages */}
        {allLogos.map((logo, index) => (
          <div key={index} className='flex-shrink-0 flex items-end mx-0.5'>
            <div className='w-1 h-0.5 bg-muted-foreground/40 mb-2' />
            <div className='relative'>
              <div className='w-8 h-6 md:w-12 md:h-8 bg-card/80 backdrop-blur-sm border border-border/40 rounded flex items-center justify-center'>
                <div className='relative w-5 h-5 md:w-7 md:h-7'>
                  <Image
                    src={logo.path}
                    alt={logo.name}
                    fill
                    className='object-contain'
                  />
                </div>
              </div>
              <div className='flex gap-0.5 justify-center -mt-0.5'>
                <div className='w-1.5 h-1.5 md:w-2 md:h-2 bg-muted-foreground/50 rounded-full' />
                <div className='w-1.5 h-1.5 md:w-2 md:h-2 bg-muted-foreground/50 rounded-full' />
              </div>
            </div>
            <div className='w-1 h-0.5 bg-muted-foreground/40 mb-2' />
          </div>
        ))}
      </div>

      <style jsx global>{`
        .train-container {
          will-change: transform;
          animation: train-move 20s linear infinite;
        }
        @keyframes train-move {
          0% {
            transform: translate3d(0, 0, 0);
          }
          100% {
            transform: translate3d(-50%, 0, 0);
          }
        }
        @media (max-width: 768px) {
          .train-container {
            animation: train-move 15s linear infinite;
          }
        }
      `}</style>
    </div>
  );
}
