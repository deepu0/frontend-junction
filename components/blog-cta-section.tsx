'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { FaArrowRight, FaBookOpen, FaCalendar } from 'react-icons/fa';
import ViewCounter from './view-counter';

interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  date: string;
  image?: string | { src: string; width: number; height: number };
  tags?: string[];
}

interface BlogCtaSectionProps {
  latestPosts: BlogPost[];
}

export default function BlogCtaSection({ latestPosts }: BlogCtaSectionProps) {
  if (!latestPosts || latestPosts.length === 0) {
    return null;
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <section className='py-20 relative overflow-hidden'>
      {/* Subtle background gradient */}
      <div className='absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-secondary/5 pointer-events-none' />

      <div className='container mx-auto px-4 relative z-10'>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4'>
            <div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className='inline-block mb-3'
              >
                <span className='px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20 flex items-center gap-2'>
                  <FaBookOpen className='w-3 h-3' />
                  Insights & Tutorials
                </span>
              </motion.div>
              <h2 className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground to-foreground/60 mb-2'>
                From the Blog
              </h2>
              <p className='text-muted-foreground text-lg max-w-lg'>
                Deep dives into frontend development, performance tips, and
                industry best practices.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link
                href='/blog'
                className='hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-semibold transition-all duration-300 border border-primary/20 hover:border-primary group'
              >
                <span>All Posts</span>
                <FaArrowRight className='w-3 h-3 group-hover:translate-x-1 transition-transform' />
              </Link>
            </motion.div>
          </div>

          {/* Blog Cards */}
          <motion.div
            initial='hidden'
            whileInView='visible'
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              hidden: {},
              visible: {
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            {latestPosts.slice(0, 3).map((post) => (
              <motion.article
                key={post.slug}
                variants={{
                  hidden: { opacity: 0, y: 30, scale: 0.95 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: 'spring',
                      stiffness: 100,
                      damping: 15,
                    },
                  },
                }}
                className='group relative'
              >
                <Link href={`/${post.slug}`}>
                  <div className='h-full overflow-hidden rounded-2xl bg-card/50 backdrop-blur-sm border border-border/50 hover:border-secondary/50 transition-all duration-300 hover:shadow-xl hover:shadow-secondary/5'>
                    {/* Thumbnail */}
                    {post.image ? (
                      <div className='aspect-video overflow-hidden border-b border-border/50 relative'>
                        <Image
                          src={
                            typeof post.image === 'string'
                              ? post.image
                              : post.image.src
                          }
                          alt={post.title}
                          fill
                          className='object-cover transition-transform duration-500 group-hover:scale-110'
                          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                        />
                      </div>
                    ) : (
                      <div className='aspect-video bg-primary/5 flex items-center justify-center border-b border-border/50'>
                        <FaBookOpen className='w-8 h-8 text-primary/20' />
                      </div>
                    )}

                    <div className='p-6 relative'>
                      {/* Tags */}
                      {post.tags && post.tags.length > 0 && (
                        <div className='flex flex-wrap gap-2 mb-4'>
                          {post.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className='px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20'
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className='text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors line-clamp-2'>
                        {post.title}
                      </h3>

                      {/* Description */}
                      {post.description && (
                        <p className='text-muted-foreground text-sm mb-4 line-clamp-2'>
                          {post.description}
                        </p>
                      )}

                      {/* Date and Views - Moved to the left to avoid overlap with the hover arrow */}
                      <div className='flex items-center gap-4 mt-4 border-t border-border/50 pt-4'>
                        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
                          <FaCalendar className='w-3 h-3' />
                          <time dateTime={post.date}>
                            {formatDate(post.date)}
                          </time>
                        </div>
                        <div className='opacity-80 group-hover:opacity-100 transition-opacity'>
                          <ViewCounter
                            slug={post.slug.split('/').slice(1).join('/')}
                            noIncrement={true}
                          />
                        </div>
                      </div>

                      {/* Read More Arrow - Positioned to the right */}
                      <div className='absolute bottom-4 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0'>
                        <FaArrowRight className='w-4 h-4 text-primary' />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>

          {/* Mobile CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className='mt-10 text-center md:hidden'
          >
            <Link
              href='/blog'
              className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-semibold transition-all duration-300 border border-primary/20 hover:border-primary group'
            >
              <span>View All Posts</span>
              <FaArrowRight className='w-3 h-3 group-hover:translate-x-1 transition-transform' />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
