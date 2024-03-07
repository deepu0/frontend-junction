import React from 'react';
import { supabase } from '@/lib/supabase';

export default async function useGetExperiences() {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select(
        'id, title, summary, role, status, location, original_link,verification_status,detail_experience'
      )
      .order('created_at', { ascending: false });
    //.eq('verification_status', 'approved');

    if (error) throw error;
    return transformData(data) || [];
  } catch (err) {
    console.log(err);
  } finally {
    console.log('done');
  }
}

const transformData = (data: any) => {
  if (data.length > 0) {
    return data
      .filter((data: any) => data.verification_status === 'approved')
      .map((experience: any) => ({
        id: experience.id,
        title: experience.title,
        imageSrc: experience?.companies || '',
        description: experience?.summary || experience?.detail_experience || '',
        tags: experience?.tags || [],
        status: experience?.status,
        link: experience?.original_link,
      }));
  }
};
