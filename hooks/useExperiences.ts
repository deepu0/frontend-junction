'use client';

import { useState, useEffect } from 'react';
import useGetExperiences from './useGetExperiences';

export function useExperiences() {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const data = await useGetExperiences();
        setExperiences(data as any[]);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  return { experiences, isLoading, error };
}
