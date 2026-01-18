'use client';
import React from 'react';
import CardComponent from './common/card';
import FooterComponent from './common/footer';
import { interviewData } from '@/constants/experiences';
import { motion } from 'framer-motion';
import HeroSection from './hero-section';
import StatsSection from './stats-section';
import FeaturesSection from './features-section';
import BlogCtaSection from './blog-cta-section';
import Link from 'next/link';

// NOTE: We are replacing WhyChooseComponent with FeaturesSection as it is more "Hub" aligned.
// We are keeping company slider and latest experiences.

interface BlogPost {
  slug: string;
  title: string;
  description?: string;
  date: string;
  tags?: string[];
  image?: string | { src: string; width: number; height: number };
}

interface Company {
  id: number;
  companyName: string;
  logoUrl: string;
}
interface IHomeProps {
  companies: Company[];
  experiences: any[];
  latestPosts?: BlogPost[];
}

const LandingPage: React.FC<IHomeProps> = (props: IHomeProps) => {
  const { experiences = [], latestPosts = [] } = props;

  return (
    <div className='flex flex-col min-h-screen w-full overflow-x-hidden'>
      {/* NEW HERO - now includes floating logos */}
      <HeroSection />

      {/* STATS */}
      <StatsSection />

      {/* FEATURES / VALUE PROP */}
      <FeaturesSection />

      {/* BLOG CTA */}
      {latestPosts.length > 0 ? (
        <BlogCtaSection latestPosts={latestPosts} />
      ) : null}

      {/* LATEST EXPERIENCES */}
      <section className='py-20 container mx-auto px-4 relative'>
        {/* Subtle background gradient */}
        <div className='absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent pointer-events-none' />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className='relative z-10'
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
                <span className='px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-semibold border border-primary/20'>
                  ✨ Latest
                </span>
              </motion.div>
              <h2 className='text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60 mb-2'>
                Fresh off the Press
              </h2>
              <p className='text-muted-foreground text-lg'>
                Latest interview experiences added by the community.
              </p>
            </div>
            <motion.a
              href='/interview-experience'
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className='hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-semibold transition-all duration-300 border border-primary/20 hover:border-primary group active:scale-95'
            >
              <span>View All</span>
              <svg
                className='w-4 h-4 group-hover:translate-x-1 transition-transform'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 7l5 5m0 0l-5 5m5-5H6'
                />
              </svg>
            </motion.a>
          </div>

          {/* Cards Grid with stagger */}
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
            className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
          >
            {(experiences.length > 0 ? experiences : interviewData)
              .slice(0, 6)
              .map((interview, index) => (
                <motion.div
                  key={interview.id}
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
                >
                  <CardComponent {...interview} />
                </motion.div>
              ))}
          </motion.div>

          {/* Mobile CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className='mt-10 text-center md:hidden'
          >
            <Link
              href='/interview-experience'
              className='inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-semibold transition-all duration-300 border border-primary/20 hover:border-primary group active:scale-95'
            >
              <span>View All Experiences</span>
              <svg
                className='w-4 h-4 group-hover:translate-x-1 transition-transform'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M13 7l5 5m0 0l-5 5m5-5H6'
                />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <FooterComponent />
    </div>
  );
};

export default LandingPage;
