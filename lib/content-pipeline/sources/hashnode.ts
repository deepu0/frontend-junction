import { ContentSource, ScrapedArticle } from '../types';

export class HashnodeSource implements ContentSource {
  name = 'hashnode';
  private GQL_URL = 'https://gql.hashnode.com';

  async fetchArticles(limit: number = 10): Promise<ScrapedArticle[]> {
    try {
      const query = `
        query {
          tag(slug: "interview") {
            posts(first: ${limit}) {
              edges {
                node {
                  title
                  url
                  author {
                    name
                  }
                  publishedAt
                  tags {
                    name
                  }
                  brief
                  content {
                    markdown
                  }
                }
              }
            }
          }
        }
      `;

      const response = await fetch(this.GQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error(`Hashnode API error: ${response.statusText}`);
      }

      const { data } = await response.json();
      const posts = data?.tag?.posts?.edges || [];

      return posts.map(({ node }: any) => ({
        title: node.title,
        original_url: node.url,
        source: 'hashnode',
        author: node.author?.name || 'Hashnode Author',
        published_at: node.publishedAt || new Date().toISOString(),
        tags: node.tags?.map((t: any) => t.name) || [],
        summary: node.brief || '',
        content: node.content?.markdown || '',
        metadata: {
          hashnode_brief: node.brief,
        },
      }));
    } catch (error) {
      console.error('Error fetching from Hashnode:', error);
      return [];
    }
  }
}
