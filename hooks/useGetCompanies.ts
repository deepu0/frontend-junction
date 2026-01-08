import React from 'react';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export default async function useGetCompanies() {
  try {
    const { data, error } = await supabase
      .from('company')
      .select('id,company_name,logo');
    if (error) throw error;
    return transformData(data) || [];
  } catch (err) {
    console.log(err);
  } finally {
    // Completed fetch
  }
}

const transformData = (data: any) => {
  if (data.length > 0) {
    return data.map((company: any) => ({
      id: company.id,
      companyName: company.company_name,
      logoUrl: company?.logo || '',
    }));
  }
};
