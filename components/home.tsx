'use client';
import React, { Suspense } from 'react';
import CardComponent from './common/card';
import FooterComponent from './common/footer';
import CompanySlider from './company-slider';
import { interviewData } from '@/constants/experiences';
import { motion } from 'framer-motion';
import Loading from '@/app/loading';
import HeroSection from './hero-section';
import StatsSection from './stats-section';
import FeaturesSection from './features-section';

// NOTE: We are replacing WhyChooseComponent with FeaturesSection as it is more "Hub" aligned.
// We are keeping company slider and latest experiences.

interface Company {
  id: number;
  companyName: string;
  logoUrl: string;
}
interface IHomeProps {
  companies: Company[];
}

const LandingPage: React.FC<IHomeProps> = (props: IHomeProps) => {
  return (
    <Suspense fallback={<Loading />}>
      <div className='flex flex-col min-h-screen w-full overflow-x-hidden'>
        {/* NEW HERO */}
        <HeroSection />

        {/* TRUST SIGNALS */}
        <div className='mb-20'>
          <CompanySlider companies={props.companies} />
        </div>

        {/* STATS */}
        <StatsSection />

        {/* FEATURES / VALUE PROP */}
        <FeaturesSection />

        {/* LATEST EXPERIENCES */}
        <section className='py-20 container mx-auto px-4'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='flex justify-between items-end mb-12'
          >
            <div>
              <h2 className='text-3xl font-bold mb-2'>Fresh off the Press</h2>
              <p className='text-muted-foreground'>
                Latest interview experiences added by the community.
              </p>
            </div>
            {/* View All - could link to /interview-experience */}
            <a
              href='/interview-experience'
              className='text-primary font-medium hover:underline hidden sm:block'
            >
              View All →
            </a>
          </motion.div>

          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
            {interviewData.slice(0, 6).map((interview) => (
              <CardComponent {...interview} key={interview.id} />
            ))}
          </div>

          <div className='mt-8 text-center sm:hidden'>
            <a
              href='/interview-experience'
              className='text-primary font-medium hover:underline'
            >
              View All Experiences →
            </a>
          </div>
        </section>

        {/* Footer */}
        <FooterComponent />
      </div>
    </Suspense>
  );
};

export default LandingPage;
