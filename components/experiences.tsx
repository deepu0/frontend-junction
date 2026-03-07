'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import CardComponent from './common/card';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import { useAuth } from './session-provider';
import {
  fetchPaginatedExperiences,
  ExperienceFilters,
} from '@/actions/experiences';

interface IExperienceProps {
  initialData: any[];
  initialTotalCount: number;
  availableCompanies: string[];
  availableYears: string[];
}

const FAMOUS_COMPANIES = [
  'Google',
  'Amazon',
  'Meta',
  'Netflix',
  'Microsoft',
  'Apple',
  'Uber',
  'Stripe',
  'Flipkart',
  'Swiggy',
  'Adobe',
];

const ITEMS_PER_PAGE = 12;

export default function InterviewExperiences({
  initialData = [],
  initialTotalCount = 0,
  availableCompanies = [],
  availableYears = [],
}: IExperienceProps) {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const isAdmin = user?.role === 'admin';

  // State setup from URL or defaults
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get('search') || ''
  );
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'community' | 'web' | 'pending'
  >((searchParams.get('source') as any) || 'all');

  const compParam = searchParams.get('companies');
  const initialSelectedCompanies = compParam ? compParam.split(',') : [];
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>(
    initialSelectedCompanies
  );

  const [selectedYear, setSelectedYear] = useState<string | null>(
    searchParams.get('year') || null
  );
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>(
    (searchParams.get('sort') as any) || 'newest'
  );

  // Data state
  const [data, setData] = useState<any[]>(initialData);
  const [totalCount, setTotalCount] = useState<number>(initialTotalCount);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // Initial load of filters
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Infinite scroll load
  const [hasMore, setHasMore] = useState(
    initialData.length < initialTotalCount
  );

  // Update URL function (so shares preserve filters)
  const updateURLParams = useCallback(() => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (activeFilter !== 'all') params.set('source', activeFilter);
    if (selectedCompanies.length > 0)
      params.set('companies', selectedCompanies.join(','));
    if (selectedYear) params.set('year', selectedYear);
    if (sortBy !== 'newest') params.set('sort', sortBy);

    const newQuery = params.toString();
    router.replace(`${pathname}${newQuery ? `?${newQuery}` : ''}`, {
      scroll: false,
    });
  }, [
    searchQuery,
    activeFilter,
    selectedCompanies,
    selectedYear,
    sortBy,
    pathname,
    router,
  ]);

  // --- Effects for Data Fetching --- //

  // 1. Fetch data on filter change (debounce search slightly)
  useEffect(() => {
    updateURLParams();

    const fetchFilters = async () => {
      setIsLoading(true);
      setPage(1); // Reset to page 1

      const filters: ExperienceFilters = {
        page: 1,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        source: activeFilter,
        companies: selectedCompanies,
        year: selectedYear,
        sortBy,
        isAdmin,
      };

      const result = await fetchPaginatedExperiences(filters);
      setData(result.data);
      setTotalCount(result.totalCount);
      setHasMore(result.data.length < result.totalCount);
      setIsLoading(false);
    };

    const debounceTimer = setTimeout(() => {
      fetchFilters();
    }, 300); // 300ms debounce for typing search

    return () => clearTimeout(debounceTimer);
  }, [
    searchQuery,
    activeFilter,
    selectedCompanies,
    selectedYear,
    sortBy,
    isAdmin,
    updateURLParams,
  ]);

  // 2. Fetch data on pagination (infinite scroll)
  useEffect(() => {
    if (page === 1) return; // Handled by filter fetch

    const fetchMoreData = async () => {
      setIsLoadingMore(true);

      const filters: ExperienceFilters = {
        page,
        limit: ITEMS_PER_PAGE,
        search: searchQuery,
        source: activeFilter,
        companies: selectedCompanies,
        year: selectedYear,
        sortBy,
        isAdmin,
      };

      const result = await fetchPaginatedExperiences(filters);
      setData((prev) => [...prev, ...result.data]);
      setHasMore([...data, ...result.data].length < result.totalCount);
      setIsLoadingMore(false);
    };

    fetchMoreData();
  }, [page]); // only run when page increments

  // Intersection Observer for infinite scrolling
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isLoadingMore || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();

      if (node) {
        observerRef.current = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              setPage((prev) => prev + 1);
            }
          },
          { threshold: 0.1 }
        );
        observerRef.current.observe(node);
      }
    },
    [isLoading, isLoadingMore, hasMore]
  );

  const toggleCompany = (company: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(company)
        ? prev.filter((c) => c !== company)
        : [...prev, company]
    );
  };

  const isFiltered =
    searchQuery ||
    activeFilter !== 'all' ||
    selectedCompanies.length > 0 ||
    selectedYear;

  return (
    <div className='w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
      {/* Header & Controls */}
      <div className='mb-12 space-y-6'>
        <div className='text-center space-y-4'>
          <h1 className='text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-violet-600'>
            Interview Experiences
          </h1>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            Discover real interview stories from the community and across the
            web.
          </p>
        </div>

        {/* Stats Bar */}
        <div className='flex flex-wrap items-center justify-center gap-x-6 gap-y-2'>
          <div className='flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/5 border border-primary/10'>
            <span className='text-2xl font-bold text-primary'>
              {totalCount}
            </span>
            <span className='text-sm text-muted-foreground'>
              {isFiltered ? 'Matching Experiences' : 'Total Experiences'}
            </span>
          </div>
          <div className='flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/5 border border-violet-500/10'>
            <span className='text-2xl font-bold text-violet-600'>
              {availableCompanies.length}+
            </span>
            <span className='text-sm text-muted-foreground'>Companies</span>
          </div>
          {availableYears.length > 0 && (
            <div className='flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10'>
              <span className='text-2xl font-bold text-emerald-600'>
                {availableYears[0]}
              </span>
              <span className='text-sm text-muted-foreground'>Latest Year</span>
            </div>
          )}
        </div>

        {/* Controls Container */}
        <div className='flex flex-col gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm sticky top-20 z-40'>
          <div className='flex flex-col md:flex-row gap-4 justify-between'>
            {/* Search */}
            <div className='relative w-full md:w-96 group'>
              <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors' />
              <input
                type='text'
                placeholder='Search companies, titles, tags...'
                className='w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className='flex items-center gap-3'>
              {/* Main Filter Tabs */}
              <div className='flex items-center gap-1 p-1 bg-muted rounded-xl bg-background/50 border border-border'>
                {[
                  'all',
                  'community',
                  'web',
                  ...(isAdmin ? ['pending'] : []),
                ].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter as any)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeFilter === filter
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <select
                className='bg-background border border-border rounded-xl text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer'
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as 'newest' | 'oldest')
                }
              >
                <option value='newest'>Newest First</option>
                <option value='oldest'>Oldest First</option>
              </select>
            </div>
          </div>

          {/* Year Filters */}
          {availableYears.length > 0 && (
            <div className='hidden md:flex flex-wrap items-center gap-3 pt-2 border-t border-border/50'>
              <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider mr-1'>
                Year:
              </span>
              <button
                onClick={() => setSelectedYear(null)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  selectedYear === null
                    ? 'bg-primary/20 text-primary border-primary/50'
                    : 'bg-background hover:bg-muted text-muted-foreground border-border'
                }`}
              >
                All
              </button>
              {availableYears.map((year) => (
                <button
                  key={year}
                  onClick={() =>
                    setSelectedYear(selectedYear === year ? null : year)
                  }
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    selectedYear === year
                      ? 'bg-primary/20 text-primary border-primary/50'
                      : 'bg-background hover:bg-muted text-muted-foreground border-border'
                  }`}
                >
                  {year}
                </button>
              ))}
            </div>
          )}

          {/* Company Filters */}
          <div className='hidden md:flex flex-wrap items-center gap-3 pt-2 border-t border-border/50'>
            <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider mr-1'>
              Companies:
            </span>

            {FAMOUS_COMPANIES.map((company) => (
              <button
                key={company}
                onClick={() => toggleCompany(company)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                  selectedCompanies.includes(company)
                    ? 'bg-primary/20 text-primary border-primary/50'
                    : 'bg-background hover:bg-muted text-muted-foreground border-border'
                }`}
              >
                {company}
              </button>
            ))}

            <div className='ml-auto'>
              <select
                className='bg-background border border-border rounded-lg text-xs px-2 py-1.5 focus:outline-none cursor-pointer'
                onChange={(e) => {
                  if (e.target.value) toggleCompany(e.target.value);
                }}
                value=''
              >
                <option value=''>+ More</option>
                {availableCompanies
                  .filter((c) => !FAMOUS_COMPANIES.includes(c))
                  .map((c) => (
                    <option
                      key={c}
                      value={c}
                      disabled={selectedCompanies.includes(c)}
                    >
                      {c}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {selectedCompanies.length > 0 && (
            <div className='flex flex-wrap gap-2 pt-1'>
              {selectedCompanies.map((c) => (
                <span
                  key={c}
                  className='inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-accent text-accent-foreground text-xs font-medium border border-border'
                >
                  {c}
                  <button
                    onClick={() => toggleCompany(c)}
                    className='hover:text-destructive ml-1'
                  >
                    ×
                  </button>
                </span>
              ))}
              <button
                onClick={() => setSelectedCompanies([])}
                className='text-xs text-muted-foreground hover:text-foreground'
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Loading Overlay for Filters */}
      {isLoading && data.length > 0 && (
        <div className='w-full flex justify-center py-4 text-sm text-muted-foreground animate-pulse'>
          Updating results...
        </div>
      )}

      {/* Grid */}
      <motion.div
        layout
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${isLoading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <AnimatePresence mode='popLayout'>
          {data.map((interview) => (
            <motion.div
              key={interview.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <CardComponent {...interview} isAdmin={isAdmin} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Infinite Scroll Sentinel */}
      {hasMore && !isLoading && (
        <div className='w-full py-12 flex justify-center' ref={sentinelRef}>
          <div className='flex items-center gap-3 text-muted-foreground animate-pulse'>
            <div className='w-2 h-2 rounded-full bg-primary' />
            <div
              className='w-2 h-2 rounded-full bg-primary'
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className='w-2 h-2 rounded-full bg-primary'
              style={{ animationDelay: '0.4s' }}
            />
            <span className='text-sm font-medium ml-2'>
              Fetching more brilliantly...
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && data.length === 0 && (
        <div className='text-center py-20'>
          <p className='text-xl text-muted-foreground'>
            No experiences found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
              setSelectedCompanies([]);
              setSelectedYear(null);
            }}
            className='mt-4 text-primary hover:underline'
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}
