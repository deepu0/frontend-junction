import { supabase } from '@/lib/supabase';

export default async function getExperiences() {
  try {
    // Run all 3 queries in parallel for faster page loads
    const [experiencesResult, newInterviewResult, scrapedResult] =
      await Promise.all([
        supabase
          .from('experiences')
          .select(
            'id, title, summary, status, verification_status, detail_experience, created_at, company_name'
          )
          .order('created_at', { ascending: false })
          .eq('verification_status', 'approved'),

        supabase
          .from('new_interview')
          .select(
            'id, title, slug, company, description, tags, approval_status, blog_link, created_at'
          )
          .order('created_at', { ascending: false }),

        supabase
          .from('scraped_experiences')
          .select(
            'id, title, slug, company, summary, tags, source, author, status, published_at, scraped_at, metadata'
          )
          .order('published_at', { ascending: false })
          .eq('status', 'approved'),
      ]);

    const { data, error } = experiencesResult;
    const { data: dataNew, error: errorNew } = newInterviewResult;
    const { data: scrapedData, error: scrapedError } = scrapedResult;

    if (error) {
      console.error('experiences error:', error);
      throw error;
    }
    if (errorNew) {
      console.error('new_interview error:', errorNew);
      throw errorNew;
    }
    if (scrapedError) {
      console.error('scraped_experiences error:', scrapedError);
      throw scrapedError;
    }

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
    console.error('getExperiences failed:', err);
    return [];
  }
}

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
      rawId: experience.id,
      title: experience.title,
      imageSrc: '',
      description: experience?.description || '',
      tags: experience?.tags || [],
      status: experience?.approval_status || 'accepted',
      link: getLink(experience, 'user'),
      date: experience.created_at,
      type: 'user',
      slug: experience.slug,
      company: experience.company,
      source: 'Community',
      blogLink: experience.blog_link,
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
