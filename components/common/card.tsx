import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  title: string;
  imageSrc?: string;
  description: string;
  tags: string[];
  status?: string;
  link?: string;
  company?: string;
  companyDomain?: string;
  source?: string;
  date?: string;
}

const LOCAL_LOGOS: Record<string, string> = {
  tesla: '/companies/tesla.png',
  walmart: '/companies/walmart.png',
};

const CardComponent: React.FC<CardProps> = ({
  title,
  imageSrc,
  description,
  tags,
  status,
  link,
  company,
  companyDomain,
  source,
  date,
}) => {
  const { theme } = useTheme();

  // Helper for logo URL
  const getLogoUrl = () => {
    // 1. Check Local Mapping first (Highest Priority for curated logos)
    if (company) {
      const lowerCompany = company.toLowerCase().trim();
      if (LOCAL_LOGOS[lowerCompany]) return LOCAL_LOGOS[lowerCompany];
    }

    // 2. Use Image Source if provided (Legacy)
    if (imageSrc) return imageSrc;

    // 3. Use Clearbit if domain exists
    if (companyDomain) return `https://logo.clearbit.com/${companyDomain}`;

    // 4. Fallback based on company name
    if (company && !company.includes(' '))
      return `https://logo.clearbit.com/${company.toLowerCase()}.com`;

    return null;
  };

  const logoUrl = getLogoUrl();

  return (
    <div
      className={`group relative flex flex-col justify-between h-full rounded-2xl overflow-hidden transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl border border-border bg-card`}
    >
      {/* Glow */}
      <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none' />

      <div className='p-6 pb-2 flex items-start justify-between gap-4'>
        {/* Company Logo */}
        <div className='flex-shrink-0'>
          {logoUrl ? (
            <a
              href={companyDomain ? `https://${companyDomain}` : '#'}
              target='_blank'
              rel='noopener noreferrer'
              className={
                companyDomain
                  ? 'cursor-pointer hover:opacity-80 transition-opacity'
                  : ''
              }
            >
              <div className='w-12 h-12 rounded-xl overflow-hidden bg-white p-1 border border-border shadow-sm'>
                <img
                  src={logoUrl}
                  alt={company || 'Company'}
                  className='w-full h-full object-contain'
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${company || 'C'}&background=random`;
                  }}
                />
              </div>
            </a>
          ) : (
            <div className='w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center text-lg font-bold text-secondary border border-border'>
              {(company || title).charAt(0)}
            </div>
          )}
        </div>

        {/* Status / Source Badge */}
        <div className='flex flex-col items-end gap-1'>
          {status && (
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-medium border uppercase tracking-wider ${
                status === 'approved'
                  ? 'bg-green-500/10 text-green-600 border-green-500/20'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {status}
            </span>
          )}
          {source && (
            <span className='text-[10px] font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full border border-border'>
              via {source}
            </span>
          )}
        </div>
      </div>

      <div className='relative p-6 pt-2 flex-grow flex flex-col'>
        <h3 className='text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2'>
          {title}
        </h3>

        {company && (
          <a
            href={companyDomain ? `https://${companyDomain}` : '#'}
            target='_blank'
            rel='noopener noreferrer'
            className={`text-sm font-semibold text-muted-foreground mb-3 inline-block ${companyDomain ? 'hover:text-foreground hover:underline' : ''}`}
          >
            {company}
          </a>
        )}

        {description && (
          <p className='text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-3'>
            {description}
          </p>
        )}

        <div className='flex flex-wrap gap-2 mt-auto'>
          {tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className='px-2.5 py-1 rounded-md text-xs font-medium bg-secondary/10 text-secondary border border-secondary/20'
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className='px-2 py-1 text-xs text-muted-foreground'>
              +{tags.length - 3}
            </span>
          )}
        </div>
      </div>

      {link && (
        <div className='p-6 pt-0 mt-2'>
          <Link
            href={link}
            legacyBehavior={false}
            target={link.startsWith('/') ? undefined : '_blank'}
            rel={link.startsWith('/') ? undefined : 'noopener noreferrer'}
            className='block w-full py-2.5 px-4 rounded-xl text-center text-sm font-semibold transition-all bg-primary/10 hover:bg-primary text-primary hover:text-white border border-primary/20 hover:border-primary'
          >
            {link.startsWith('/') ? 'Read Experience' : 'Read Full Story'}
          </Link>
        </div>
      )}
    </div>
  );
};

export default CardComponent;
