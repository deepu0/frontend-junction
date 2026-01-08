import { ContentSource, ScrapedArticle } from '../types';

export class DevToSource implements ContentSource {
  name = 'dev.to';

  async fetchArticles(limit: number = 10): Promise<ScrapedArticle[]> {
    try {
      // Fetch articles with 'interview' tag
      const tags = ['interview', 'frontend', 'javascript', 'react'];
      let allArticles: any[] = [];

      // We fetch a bit from each tag to get variety
      for (const tag of tags) {
        const response = await fetch(
          `https://dev.to/api/articles?tag=${tag}&per_page=${Math.ceil(limit / tags.length)}`
        );
        if (response.ok) {
          const data = await response.json();
          allArticles = [...allArticles, ...data];
        }
      }

      // Deduplicate by ID
      const seen = new Set();
      const uniqueArticles = allArticles.filter((item) => {
        const duplicate = seen.has(item.id);
        seen.add(item.id);
        return !duplicate;
      });

      return uniqueArticles.slice(0, limit).map((item: any) => ({
        title: item.title,
        original_url: item.url,
        source: 'dev.to',
        author: item.user?.name || 'Dev.to Author',
        published_at: item.published_at || new Date().toISOString(),
        tags: item.tag_list || [],
        summary: item.description || '',
        content: item.body_markdown || item.body_html || '', // Dev.to provides markdown often
        metadata: {
          devto_id: item.id,
          likes: item.public_reactions_count,
        },
      }));
    } catch (error) {
      console.error('Error fetching from Dev.to:', error);
      return [];
    }
  }
}
