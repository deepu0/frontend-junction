import { cache } from 'react';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

const useGetCompanies = cache(async () => {
  try {
    const { data, error } = await supabase
      .from('company')
      .select('id,company_name,logo');
    if (error) throw error;
    return transformData(data) || [];
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Failed to fetch companies:', err);
    }
    return [];
  }
});

export default useGetCompanies;

const transformData = (data: any) => {
  if (data.length > 0) {
    return data.map((company: any) => ({
      id: company.id,
      companyName: company.company_name,
      logoUrl: company?.logo || '',
    }));
  }
};
