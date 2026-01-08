import { ContentSource, ScrapedArticle } from '../types';

export class LeetCodeSource implements ContentSource {
  name = 'leetcode';
  // LeetCode GraphQL Endpoint
  private GRAPHQL_URL = 'https://leetcode.com/graphql';

  async fetchArticles(limit: number = 10): Promise<ScrapedArticle[]> {
    try {
      // Query to fetch discussion topics from "Interview Experience" category
      // Category ID for Interview Experience is typically accessible via generic query or specific ID.
      // Based on public knowledge, we filter by tags. 'frontend'

      const query = `
        query categoryTopicList($categories: [String!]!, $first: Int!, $orderBy: TopicSortingOption, $skip: Int, $tags: [String!], $query: String) {
          categoryTopicList(categories: $categories, first: $first, orderBy: $orderBy, skip: $skip, tags: $tags, query: $query) {
            edges {
              node {
                id
                title
                commentCount
                viewCount
                pinned
                tags {
                  name
                  slug
                }
                post {
                  id
                  content
                  creationDate
                  author {
                    username
                  }
                }
              }
            }
          }
        }
      `;

      // LeetCode uses specific category slugs. Let's try to be less restrictive or use the right slug.
      // Trying to search globally in discuss if possible or use a known working category slug.
      // 'interview-question' is common. 'interview-experience' might be correct but requiring different params.

      const variables = {
        categories: [], // Empty to search all or trial
        first: limit,
        orderBy: 'newest',
        skip: 0,
        query: 'frontend interview experience', // Explicit search query
        tags: [],
      };

      const response = await fetch(this.GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Referer: 'https://leetcode.com/discuss/interview-experience',
          'User-Agent':
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
        body: JSON.stringify({ query, variables }),
      });

      if (!response.ok) {
        throw new Error(`LeetCode API failed: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.errors) {
        console.error('LeetCode GraphQL Errors:', result.errors);
        return [];
      }

      console.log(
        '[LeetCode] Response Data:',
        JSON.stringify(result.data?.categoryTopicList)
      );

      const topics = result.data?.categoryTopicList?.edges || [];
      console.log(`[LeetCode] Found ${topics.length} topics.`);

      return topics.map((edge: any) => {
        const node = edge.node;
        return {
          title: node.title,
          original_url: `https://leetcode.com/discuss/interview-experience/${node.id}`,
          source: 'leetcode',
          author: node.post?.author?.username || 'Anonymous',
          published_at: new Date(node.post?.creationDate * 1000).toISOString(),
          tags: node.tags.map((t: any) => t.name),
          summary: node.post?.content.substring(0, 200) + '...', // Simple truncation
          content: node.post?.content,
          metadata: {
            leetcode_id: node.id,
            views: node.viewCount,
            comments: node.commentCount,
          },
        };
      });
    } catch (error) {
      console.error('Error fetching from LeetCode:', error);
      return [];
    }
  }
}
