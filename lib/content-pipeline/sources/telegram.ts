import { ContentSource, ScrapedArticle } from '../types';
import { parse } from 'node-html-parser';

export class TelegramSource implements ContentSource {
  name = 'telegram';
  private channelUrl = 'https://t.me/s/fe_junction';

  async fetchArticles(limit: number = 10): Promise<ScrapedArticle[]> {
    try {
      console.log(`[Telegram] Fetching ${this.channelUrl}...`);
      const response = await fetch(this.channelUrl);
      const html = await response.text();
      const root = parse(html);

      const articles: ScrapedArticle[] = [];
      const messages = root.querySelectorAll('.tgme_widget_message');

      for (const msg of messages) {
        if (articles.length >= limit) break;

        const textElement = msg.querySelector('.tgme_widget_message_text');
        const dateElement = msg.querySelector(
          '.tgme_widget_message_date .time'
        );
        const link = msg.getAttribute('data-post'); // e.g. fe_junction/123
        const fullLink = `https://t.me/${link}`;

        // Skip messages without text
        if (!textElement) continue;

        // Extract description/summary
        const text = textElement.text.trim() || 'No description';

        // Extract external link if present (priority)
        let externalUrl = '';
        const links = textElement.querySelectorAll('a');

        for (const a of links) {
          const href = a.getAttribute('href');
          if (
            href &&
            !href.includes('t.me') &&
            !href.includes('telegram.org')
          ) {
            externalUrl = href;
            break; // take first external link
          }
        }

        // If no external link, use the telegram post link itself, but mark title clearly
        const finalUrl = externalUrl || fullLink;

        // Try to infer a title from the first line or external URL text
        let title = 'Telegram Update';
        const firstLine = text.split('\n')[0];
        if (firstLine.length > 5 && firstLine.length < 100) {
          title = firstLine;
        } else if (externalUrl) {
          // primitive domain extraction
          try {
            const domain = new URL(externalUrl).hostname;
            title = `Resource: ${domain}`;
          } catch (e) {
            title = 'External Resource';
          }
        }

        // Push
        articles.push({
          title: title,
          original_url: finalUrl, // Deduplication key
          source: 'telegram',
          author: 'Frontend Junction (TG)',
          published_at:
            dateElement?.getAttribute('datetime') || new Date().toISOString(),
          tags: ['telegram', 'frontend'],
          summary: text.substring(0, 300),
          content: `Source: ${fullLink}\n\n${text}`, // Retain full text
          metadata: {
            telegram_id: link,
            has_external_link: !!externalUrl,
          },
        });
      }

      return articles;
    } catch (error) {
      console.error('Error fetching from Telegram:', error);
      return [];
    }
  }
}
