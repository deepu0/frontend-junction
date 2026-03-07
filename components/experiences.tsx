'use client';
import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import CardComponent from './common/card';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaSortAmountDown } from 'react-icons/fa';
import { useAuth } from './session-provider';

interface IExperienceProps {
  interviewData: any[];
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

const InterviewExperiences = ({ interviewData = [] }: IExperienceProps) => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'community' | 'web' | 'pending'
  >('all');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const isAdmin = user?.role === 'admin';
  const ITEMS_PER_PAGE = 12;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Update searchQuery when URL parameter changes
  useEffect(() => {
    const search = searchParams.get('search');
    if (search !== null) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Reset infinite scroll when any filter changes
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [searchQuery, activeFilter, selectedCompanies, selectedYear, sortBy]);

  // Extract unique companies for dropdown
  const allCompanies = useMemo(() => {
    const companies = new Set<string>();
    interviewData.forEach((item) => {
      if (item.company) companies.add(item.company);
    });
    return Array.from(companies).sort();
  }, [interviewData]);

  // Extract unique years from data
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    interviewData.forEach((item) => {
      if (item.date) {
        const year = new Date(item.date).getFullYear().toString();
        if (!isNaN(Number(year))) years.add(year);
      }
      // Also check title for year mentions like "2026"
      const titleMatch = item.title?.match(/\b(202[3-9])\b/);
      if (titleMatch) years.add(titleMatch[1]);
    });
    return Array.from(years).sort().reverse();
  }, [interviewData]);

  const filteredData = useMemo(() => {
    let data = [...interviewData];

    // 1. Filter out pending posts for non-admins
    if (!isAdmin) {
      data = data.filter((item) => item.status !== 'pending');
    } else if (activeFilter === 'pending') {
      data = data.filter((item) => item.status === 'pending');
    }

    // 2. Source Filtering
    if (activeFilter === 'community') {
      data = data.filter(
        (item) => item.type === 'user' || item.type === 'legacy'
      );
    } else if (activeFilter === 'web') {
      data = data.filter((item) => item.type === 'scraped');
    }

    // 3. Company Filtering
    if (selectedCompanies.length > 0) {
      data = data.filter(
        (item) => item.company && selectedCompanies.includes(item.company)
      );
    }

    // 4. Year Filtering
    if (selectedYear) {
      data = data.filter((item) => {
        if (item.date) {
          const year = new Date(item.date).getFullYear().toString();
          if (year === selectedYear) return true;
        }
        if (item.title?.includes(selectedYear)) return true;
        return false;
      });
    }

    // 5. Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      data = data.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          (item.description &&
            item.description.toLowerCase().includes(query)) ||
          item.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
          (item.company && item.company.toLowerCase().includes(query))
      );
    }

    // 6. Sorting
    data.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return data;
  }, [
    interviewData,
    searchQuery,
    activeFilter,
    selectedCompanies,
    selectedYear,
    sortBy,
    isAdmin,
  ]);

  const toggleCompany = (company: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(company)
        ? prev.filter((c) => c !== company)
        : [...prev, company]
    );
  };

  const totalCount = interviewData.filter(
    (item) => item.status !== 'pending'
  ).length;
  const companyCount = allCompanies.length;
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
              {isFiltered ? filteredData.length : totalCount}
            </span>
            <span className='text-sm text-muted-foreground'>
              {isFiltered ? (
                <>
                  of{' '}
                  <span className='font-semibold text-foreground'>
                    {totalCount}
                  </span>{' '}
                  Experiences
                </>
              ) : (
                'Experiences'
              )}
            </span>
          </div>
          <div className='flex items-center gap-2 px-4 py-2 rounded-xl bg-violet-500/5 border border-violet-500/10'>
            <span className='text-2xl font-bold text-violet-600'>
              {companyCount}+
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
                placeholder='Search companies, roles, tags...'
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
            <div className='flex flex-wrap items-center gap-3 pt-2 border-t border-border/50'>
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
          <div className='flex flex-wrap items-center gap-3 pt-2 border-t border-border/50'>
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
                <option value=''>+ More Companies</option>
                {allCompanies
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

      {/* Results count when filtered */}
      {isFiltered && (
        <div className='mb-6 text-sm text-muted-foreground'>
          Showing{' '}
          <span className='font-semibold text-foreground'>
            {filteredData.length}
          </span>{' '}
          {filteredData.length === 1 ? 'experience' : 'experiences'}
          {searchQuery && (
            <>
              {' '}
              for &quot;<span className='text-primary'>{searchQuery}</span>
              &quot;
            </>
          )}
          {selectedYear && (
            <>
              {' '}
              in <span className='text-primary'>{selectedYear}</span>
            </>
          )}
        </div>
      )}

      {/* Grid */}
      <motion.div
        layout
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      >
        <AnimatePresence mode='popLayout'>
          {filteredData.slice(0, visibleCount).map((interview) => (
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

      {/* Load More Sentinel */}
      {visibleCount < filteredData.length && (
        <div
          className='w-full py-12 flex justify-center'
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                (entries) => {
                  if (entries[0].isIntersecting) {
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
                  }
                },
                { threshold: 0.1 }
              );
              observer.observe(el);
            }
          }}
        >
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
              Loading more brilliance...
            </span>
          </div>
        </div>
      )}

      {filteredData.length === 0 && (
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
};

export default InterviewExperiences;
