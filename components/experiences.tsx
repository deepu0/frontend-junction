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

const FAMOUS_COMPANIES = ['Google', 'Amazon', 'Meta', 'Netflix', 'Microsoft'];

const InterviewExperiences = ({ interviewData = [] }: IExperienceProps) => {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState<
    'all' | 'community' | 'web' | 'pending'
  >('all');
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([]);

  const isAdmin = user?.role === 'admin';

  // Update searchQuery when URL parameter changes
  useEffect(() => {
    const search = searchParams.get('search');
    if (search !== null) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Extract unique companies for dropdown
  const allCompanies = useMemo(() => {
    const companies = new Set<string>();
    interviewData.forEach((item) => {
      if (item.company) companies.add(item.company);
    });
    return Array.from(companies).sort();
  }, [interviewData]);

  const filteredData = useMemo(() => {
    let data = [...interviewData];

    // 1. Filter out pending posts for non-admins
    if (!isAdmin) {
      // Hide ONLY if status is explicitly 'pending'. Show everything else (accepted, approved, null, legacy).
      data = data.filter((item) => item.status !== 'pending');
    } else if (activeFilter === 'pending') {
      // If admin specifically selects Pending, show ONLY pending
      data = data.filter((item) => item.status === 'pending');
    }
    // If admin is on All/Community/Web, they see EVERYTHING including pending.

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

    // Filter by Search
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

    return data;
  }, [interviewData, searchQuery, activeFilter, selectedCompanies]);

  const toggleCompany = (company: string) => {
    setSelectedCompanies((prev) =>
      prev.includes(company)
        ? prev.filter((c) => c !== company)
        : [...prev, company]
    );
  };

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

        {/* Controls Container */}
        <div className='flex flex-col gap-4 bg-card/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm sticky top-20 z-40'>
          <div className='flex flex-col md:flex-row gap-4 justify-between'>
            {/* Search */}
            <div className='relative w-full md:w-96 group'>
              <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors' />
              <input
                type='text'
                placeholder='Search roles, tags...'
                className='w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground placeholder:text-muted-foreground'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Main Filter Tabs */}
            <div className='flex items-center gap-2 p-1 bg-muted rounded-xl bg-background/50 border border-border'>
              {['all', 'community', 'web', ...(isAdmin ? ['pending'] : [])].map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter as any)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeFilter === filter
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Advanced Filters: Chips & Dropdown */}
          <div className='flex flex-wrap items-center gap-3 pt-2 border-t border-border/50'>
            <span className='text-xs font-medium text-muted-foreground uppercase tracking-wider mr-2'>
              Top Companies:
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
              {/* Placeholder for Dropdown - implementing via simple HTML for reliability or Importing specific components would be better. 
                         I'll use a simple HTML select for valid companies if UI components are tricky, 
                         BUT I will try to use a standard HTML detail/summary dropdown or just a button 
                         that toggles a list for now to avoid specific ShadCN errors if imports miss.
                      */}
              <select
                className='bg-background border border-border rounded-lg text-xs px-2 py-1.5 focus:outline-none'
                onChange={(e) => {
                  if (e.target.value) toggleCompany(e.target.value);
                }}
                value=''
              >
                <option value=''>+ Filter by Company</option>
                {allCompanies.map((c) => (
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
                Clear content
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <motion.div
        layout
        className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
      >
        <AnimatePresence mode='popLayout'>
          {filteredData.map((interview) => (
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

      {filteredData.length === 0 && (
        <div className='text-center py-20'>
          <p className='text-xl text-muted-foreground'>
            No experiences found matching your criteria.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setActiveFilter('all');
            }}
            className='mt-4 text-primary hover:underline'
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default InterviewExperiences;
