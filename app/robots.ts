import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.frontend-junction.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/dashboard/', '/add-experience'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
