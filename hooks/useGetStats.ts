'use client';

import { useState, useEffect } from 'react';
import { getSupabaseBrowserClient } from '@/lib/supabase-browser';

export interface Stats {
  stories: number;
  companies: number;
  members: number;
  successRate: string;
}

export default function useGetStats() {
  const [stats, setStats] = useState<Stats>({
    stories: 0,
    companies: 0,
    members: 0,
    successRate: '85%',
  });
  const [isLoading, setIsLoading] = useState(true);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    async function fetchStats() {
      try {
        // Run all count queries in parallel for maximum speed
        const [
          { count: expCount },
          { count: newCount },
          { count: scrapedCount },
          { count: userCount },
          { count: offersCount },
          // For unique companies, we still need the data if no RPC, but let's select ONLY the column
          { data: c1 },
          { data: c2 },
          { data: c3 },
        ] = await Promise.all([
          supabase
            .from('experiences')
            .select('*', { count: 'exact', head: true })
            .eq('verification_status', 'approved'),
          supabase
            .from('new_interview')
            .select('*', { count: 'exact', head: true })
            .eq('approval_status', 'accepted'),
          supabase
            .from('scraped_experiences')
            .select('*', { count: 'exact', head: true })
            .eq('status', 'approved'),
          supabase.from('users').select('*', { count: 'exact', head: true }),
          supabase
            .from('new_interview')
            .select('*', { count: 'exact', head: true })
            .eq('approval_status', 'accepted')
            .eq('offer_status', 'accepted'),
          supabase
            .from('experiences')
            .select('company_name')
            .eq('verification_status', 'approved'),
          supabase
            .from('new_interview')
            .select('company')
            .eq('approval_status', 'accepted'),
          supabase
            .from('scraped_experiences')
            .select('company')
            .eq('status', 'approved'),
        ]);

        const totalStories =
          (expCount || 0) + (newCount || 0) + (scrapedCount || 0);

        const companySet = new Set<string>();
        c1?.forEach(
          (i) => i.company_name && companySet.add(i.company_name as string)
        );
        c2?.forEach((i) => i.company && companySet.add(i.company as string));
        c3?.forEach((i) => i.company && companySet.add(i.company as string));

        let successRate = '85%';
        if (newCount && newCount > 0 && offersCount) {
          const rate = Math.round((offersCount / newCount) * 100);
          if (rate > 0) successRate = `${rate}%`;
        }

        setStats({
          stories: totalStories,
          companies: companySet.size,
          members: userCount || 0,
          successRate: successRate,
        });
      } catch (error) {
        console.error('[useGetStats] Error:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchStats();
  }, [supabase]);

  return { stats, isLoading };
}
