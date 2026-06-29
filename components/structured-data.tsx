import Script from 'next/script';

interface OrganizationSchemaProps {
  name?: string;
  url?: string;
  logo?: string;
}

export function OrganizationSchema({
  name = 'Frontend Junction',
  url = 'https://www.frontend-junction.com',
  logo = 'https://www.frontend-junction.com/logo.png',
}: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    logo,
    sameAs: [
      'https://linkedin.com/in/depaksharma',
      'https://twitter.com/frontendjunction',
    ],
  };

  return (
    <Script
      id='organization-schema'
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  );
}

interface ArticleSchemaProps {
  title: string;
  description: string;
  author: string;
  datePublished: string;
  url: string;
  image?: string;
}

export function ArticleSchema({
  title,
  description,
  author,
  datePublished,
  url,
  image,
}: ArticleSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    author: {
      '@type': 'Person',
      name: author,
    },
    datePublished,
    dateModified: datePublished,
    publisher: {
      '@type': 'Organization',
      name: 'Frontend Junction',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.frontend-junction.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(image && { image }),
  };

  return (
    <Script
      id='article-schema'
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  );
}

const websiteSchemaData = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Frontend Junction',
  url: 'https://www.frontend-junction.com',
  description: 'Your Hub for Frontend Interview Insights',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate:
        'https://www.frontend-junction.com/interview-experience?search={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
};

export function WebsiteSchema() {
  return (
    <Script
      id='website-schema'
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteSchemaData).replace(/</g, '\\u003c'),
      }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <Script
      id='breadcrumb-schema'
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export function FaqSchema({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: { '@type': 'Answer', text: faq.answer },
    })),
  };
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schema).replace(/</g, '\\u003c'),
      }}
    />
  );
}
