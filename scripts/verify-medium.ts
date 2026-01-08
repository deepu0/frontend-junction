import { MediumSource } from '../lib/content-pipeline/sources/medium';

async function main() {
  console.log('Starting Medium verification...');
  const source = new MediumSource();
  try {
    const articles = await source.fetchArticles(5);
    console.log(`Successfully fetched ${articles.length} articles.`);
    articles.forEach((a) => {
      console.log(`- ${a.title} (${a.tags?.join(', ')})`);
    });
  } catch (error) {
    console.error('Error verifying Medium source:', error);
    process.exit(1);
  }
}

main();
