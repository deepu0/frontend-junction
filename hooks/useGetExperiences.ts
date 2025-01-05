import React from 'react';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export default async function useGetExperiences() {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select(
        'id, title, summary, role, status, location, original_link,verification_status,detail_experience,user_id'
      )
      .order('created_at', { ascending: false })
      .eq('verification_status', 'approved');
    const { data: dataNew, error: errorNew } = await supabase
      .from('new_interview')
      .select('id, title, offer_status, company, location, blog_link,added_by')
      .order('created_at', { ascending: false })
      .eq('approval_status', 'accepted');

    console.log('test', dataNew, errorNew);
    if (error) throw error;
    return [...transformData(data), ...transformNewData(dataNew)];
  } catch (err) {
    console.log(err);
  } finally {
    console.log('done');
  }
}

const transformNewData = (data: any) => {
  if (data.length > 0) {
    return data.map((experience: any) => ({
      id: experience.id,
      title: experience.title,
      imageSrc: experience?.companies || '',
      description: experience?.summary || experience?.detail_experience || '',
      tags: experience?.tags || [],
      status: experience?.status,
      link: experience?.blog_link,
    }));
  }
};

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
