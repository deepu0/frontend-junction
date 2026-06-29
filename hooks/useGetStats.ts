'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export interface Stats {
  stories: number;
  companies: number;
  members: number;
}

export default function useGetStats() {
  const [stats, setStats] = useState<Stats>({
    stories: 0,
    companies: 0,
    members: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  // react-doctor-disable-next-line react-doctor/no-fetch-in-effect
  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await fetch('/api/public/stats');
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();

        setStats({
          stories: data.stories || 0,
          companies: data.companies || 0,
          members: data.members || 0,
        });
      } catch (error) {
        console.error('[useGetStats] Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { stats, isLoading };
}
