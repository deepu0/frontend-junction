import { ContentSource, ScrapedArticle } from '../types';
import Parser from 'rss-parser';

export class MediumSource implements ContentSource {
  name = 'medium';
  private parser = new Parser();

  async fetchArticles(limit: number = 10): Promise<ScrapedArticle[]> {
    try {
      const TAGS = [
        'frontend-interview-experience',
        'frontend-interview-questions',
        'javascript-interview-questions',
        'react-interview-questions',
        'angular-interview',
        'vue-interview',
        'html-interview',
        'css-interview',
        'web-interview',
        'frontend-interview',
        'javascript-interview',
        'react-interview',
      ];

      let allItems: any[] = [];

      // Fetch from multiple tags in parallel
      const tagResults = await Promise.all(
        TAGS.map(async (tag) => {
          try {
            const FEED_URL = `https://medium.com/feed/tag/${tag}`;
            const feed = await this.parser.parseURL(FEED_URL);
            return feed.items || [];
          } catch (e) {
            console.warn(`Failed to fetch Medium tag: ${tag}`);
            return [];
          }
        })
      );
      for (const items of tagResults) {
        allItems = [...allItems, ...items];
      }

      // Deduplicate by URL or Title
      const seen = new Set();
      const uniqueItems = allItems.filter((item) => {
        const key = item.link || item.title;
        const duplicate = seen.has(key);
        seen.add(key);
        return !duplicate;
      });

      // Strict Filtering for "Frontend Interview Experience"
      const relevantItems = uniqueItems.filter((item) => {
        const title = (item.title || '').toLowerCase();
        const categories = (item.categories || []).map((c: string) =>
          c.toLowerCase()
        );
        const content = (
          item.contentSnippet ||
          item.content ||
          ''
        ).toLowerCase();

        const combinedText = `${title} ${categories.join(' ')}`;

        // 1. Must be about "Interview"
        const hasInterview =
          combinedText.includes('interview') ||
          combinedText.includes('questions') ||
          combinedText.includes('experience');

        // 2. Must be about Frontend technologies
        const frontendKeywords = [
          'frontend',
          'front-end',
          'web',
          'javascript',
          'js',
          'react',
          'html',
          'css',
          'angular',
          'vue',
          'nextjs',
          'typescript',
        ];
        const hasFrontend = frontendKeywords.some((keyword) =>
          combinedText.includes(keyword)
        );

        // 3. Strict Title/Content Checks for "Personal Experience"
        // Must indicate a narrative: "My Experience", "I interviewed", "Process", "Journey"
        const narrativeKeywords = [
          'my interview experience',
          'my experience',
          'interview experience',
          'interview process',
          'interview journey',
          'recruitment process',
          'offer',
          'rejected',
          'selected',
          'cleared',
          'got the job',
          'interviewed at',
        ];

        // key phrases that suggest it's a listicle/tutorial (Exclude these)
        const listicleKeywords = [
          'top 10',
          'top 20',
          'top 50',
          'questions',
          'guide',
          'roadmap',
          'pattern',
          'explained',
          'tutorial',
          'introduction',
          'basics',
          'vs',
          'difference between',
          'cheatsheet',
        ];

        const hasNarrative = narrativeKeywords.some((kw) =>
          combinedText.includes(kw)
        );
        // Allow "questions" if "experience" is effectively strong, but user explicitly rejected "10 Essential Questions"
        // So if it looks like a list, reject it even if it says "experience" (rare, but possible).
        // Actually, user rejected: "10 Essential React interview questions..." -> has "questions"
        // User rejected: "React Fiber Explained" -> has "explained"
        // User accepted: "My Interview Experience..."

        const isListicle = listicleKeywords.some((kw) =>
          title.toLowerCase().includes(kw)
        );

        // Final Check:
        // 1. Must be Frontend + Interview
        // 2. Must NOT be a listicle title
        // 3. Must have narrative keywords OR explicit "Interview Experience" tag/title

        return (
          hasInterview &&
          hasFrontend &&
          !isListicle &&
          (hasNarrative || title.toLowerCase().includes('interview experience'))
        );
      });

      return relevantItems.slice(0, limit).map((item: any) => ({
        title: item.title || 'Untitled',
        original_url: item.link || '',
        source: 'medium',
        author: item.creator || 'Medium Author',
        published_at: item.isoDate || new Date().toISOString(),
        tags: item.categories || [], // RSS parser puts tags in categories
        summary: item.contentSnippet || item.content?.substring(0, 200) || '',
        content: item['content:encoded'] || item.content || '',
        metadata: {
          medium_guid: item.guid,
        },
      }));
    } catch (error) {
      console.error('Error fetching from Medium RSS:', error);
      return [];
    }
  }
}
