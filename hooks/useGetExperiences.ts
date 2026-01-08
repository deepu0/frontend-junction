import React from 'react';
import { supabase } from '@/lib/supabase';

export const revalidate = 60;

export default async function useGetExperiences() {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select(
        'id, title, summary, role, status, location, original_link,verification_status,detail_experience,user_id, created_at, company_name'
      )
      .order('created_at', { ascending: false })
      .eq('verification_status', 'approved');

    const { data: dataNew, error: errorNew } = await supabase
      .from('new_interview')
      .select(
        'id, title, offer_status, company, location, description, tags, blog_link, added_by, created_at, slug'
      )
      .order('created_at', { ascending: false })
      .eq('approval_status', 'accepted');

    const { data: scrapedData, error: scrapedError } = await supabase
      .from('scraped_experiences')
      .select('*, slug, company, metadata')
      .order('published_at', { ascending: false })
      .eq('status', 'approved')
      .limit(200);

    if (error) throw error;
    if (errorNew) throw errorNew;
    if (scrapedError) throw scrapedError;

    const allExperiences = [
      ...transformData(data),
      ...transformNewData(dataNew),
      ...transformScrapedData(scrapedData),
    ];

    // Global Sort: Newest First
    return allExperiences.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  } catch (err) {
    console.log(err);
    return [];
  }
}

// ... getLink helper remains the same ...
const getLink = (item: any, type: string) => {
  if (item.slug) return `/interview-experience/${item.slug}`;
  if (type === 'scraped') return `/interview-experience/scraped-${item.id}`;
  if (type === 'user') return `/interview-experience/user-${item.id}`;
  if (type === 'legacy') return `/interview-experience/exp-${item.id}`;
  return '#';
};

const transformScrapedData = (data: any) => {
  if (data && data.length > 0) {
    return data.map((item: any) => ({
      id: `scraped-${item.id}`,
      title: item.title,
      imageSrc: '',
      description:
        item.summary || `Read this interview experience on ${item.source}`,
      tags: item.tags || [item.source],
      status: 'approved',
      link: getLink(item, 'scraped'),
      source: item.source,
      author: item.author,
      date: item.published_at || item.scraped_at,
      type: 'scraped',
      slug: item.slug,
      company: item.company,
      companyDomain: item.metadata?.company_domain,
    }));
  }
  return [];
};

const transformNewData = (data: any) => {
  if (data && data.length > 0) {
    return data.map((experience: any) => ({
      id: `user-${experience.id}`,
      title: experience.title,
      imageSrc: '',
      description: experience?.description || experience?.summary || '',
      tags: experience?.tags || [],
      status: experience?.status || 'approved',
      link: getLink(experience, 'user'),
      date: experience.created_at,
      type: 'user',
      slug: experience.slug,
      company: experience.company,
      source: 'Community',
    }));
  }
  return [];
};

const transformData = (data: any) => {
  if (data && data.length > 0) {
    return data
      .filter((data: any) => data.verification_status === 'approved')
      .map((experience: any) => ({
        id: `exp-${experience.id}`,
        title: experience.title,
        imageSrc: '',
        description: experience?.summary || experience?.detail_experience || '',
        tags: experience?.tags || [],
        status: experience?.status,
        link: getLink(experience, 'legacy'),
        date: experience.created_at,
        type: 'legacy',
        company: experience.company_name,
        source: 'Community',
      }));
  }
  return [];
};
