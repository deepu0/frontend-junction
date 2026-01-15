import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function getExperienceById(id: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  if (!url) return null;

  const cookieStore = await cookies();
  const supabase = createServerClient(url, key, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
    },
  });

  let table = '';
  let dbId = '';
  let type = '';

  if (id.startsWith('scraped-')) {
    table = 'scraped_experiences';
    dbId = id.replace('scraped-', '');
    type = 'scraped';
  } else if (id.startsWith('user-')) {
    table = 'new_interview';
    dbId = id.replace('user-', '');
    type = 'user';
  } else if (id.startsWith('exp-')) {
    table = 'experiences';
    dbId = id.replace('exp-', '');
    type = 'legacy';
  } else {
    // Fallback or invalid
    return null;
  }

  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('id', dbId)
    .single();

  if (error || !data) return null;

  // Normalize
  if (type === 'scraped') {
    return {
      id: data.id,
      title: data.title,
      summary: data.summary,
      content: data.metadata?.content || data.summary, // Fallback
      author: data.author,
      source: data.source,
      original_link: data.original_url,
      date: data.published_at,
      tags: data.tags,
    };
  } else if (type === 'user') {
    return {
      id: data.id,
      title: data.title,
      summary: data.description,
      content: data.description,
      author: 'Community Member',
      source: 'Frontend Junction',
      original_link: data.blog_link,
      date: data.created_at,
      tags: data.tags || [],
    };
  } else {
    return {
      id: data.id,
      title: data.title,
      summary: data.summary || data.detail_experience,
      content: data.detail_experience,
      author: 'Community Member',
      source: 'Frontend Junction',
      original_link: data.original_link,
      date: data.created_at,
      tags: data.tags || [],
    };
  }
}
