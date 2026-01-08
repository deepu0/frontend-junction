export interface ScrapedArticle {
  title: string;
  original_url: string;
  source: 'dev.to' | 'medium' | 'hashnode' | 'linkedin' | 'telegram';
  author: string;
  published_at: string;
  tags: string[];
  summary?: string;
  company?: string; // If extractable
  content?: string; // Raw content if needed for AI summary
  metadata?: Record<string, any>;
}

export interface ContentSource {
  name: string;
  fetchArticles(limit?: number): Promise<ScrapedArticle[]>;
}
