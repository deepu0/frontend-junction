'use client';
import React from 'react';
import CardComponent from './common/card';
import WhyChooseComponent from './why-choose';
import { TypewriterEffect } from './ui/typewriter-effect';
import FooterComponent from './common/footer';
import CompanySlider from './company-slider';
import { useTheme } from 'next-themes';
import { interviewData } from '@/constants/experiences';
import ComingSoon from './coming-soon';
import { FaSearch, FaFilter, FaBook, FaCode } from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';
import handleLogin from '@/lib/handleLogin';
import { usePathname } from 'next/navigation';
import { useAuth } from './session-provider';
import { useRouter } from 'next/navigation';

interface Company {
  id: number;
  companyName: string;
  logoUrl: string;
}
interface IHomeProps {
  companies: Company[];
}

const LandingPage: React.FC<IHomeProps> = (props: IHomeProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { user = '' } = useAuth();

  const pathname = usePathname();
  const redirectTo = `/auth/callback?next=${pathname}/add-experience`;

  const onClickLogin = async () => {
    if (user) {
      router.push('./add-experience');
      return;
    }
    await handleLogin({
      provider: 'google',
      redirectTo,
    });
  };

  const words = [
    {
      text: 'Ace',
    },
    {
      text: 'Your ',
    },
    {
      text: 'Next ',
    },
    {
      text: 'Frontend',
    },
    {
      text: 'Interview',
      className: 'text-blue-500 dark:text-orange-500',
    },
  ];

  return (
    <div className={`flex flex-col min-h-screen w-screen`}>
      <div className='flex flex-col gap-8 container mx-auto mt-14 px-4 flex-grow w-screen overflow-hidden'>
        <TypewriterEffect words={words} className='text-2xl' />
        <p
          className={`relative font-regular text-sm sm:text-xl text-zinc-500 tracking-wide mb-4 text-center max-w-2xl antialiased  ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mx-auto`}
        >
          Prepare with Confidence: End your interview prep frustration. Get
          frontend interview experiences from across the web, all in one place.
        </p>
        <div className='flex justify-center my-4 flex-row md:flex-row md:space-y-0 space-x-0  mt-10 gap-2'>
          {
            <button
              onClick={onClickLogin}
              className='w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm mt-0 hover:scale-105'
            >
              Add Interview
            </button>
          }
          <button className='w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm mt-0 hover:scale-105'>
            <Link href='/interview-experience'>Explore Experiences</Link>
          </button>
        </div>
        {/* Card Component */}
        <CompanySlider companies={props.companies} />
        <section className='bg-gray-900 py-20'>
          <div className='container mx-auto text-center px-4'>
            <motion.h1
              className='text-3xl md:text-4xl font-bold mb-4 text-white'
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Get Insider Front-end Interview Insights
            </motion.h1>
            <motion.p
              className='text-base md:text-lg mb-8 text-gray-400'
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Prepare better for your front-end developer job interviews with
              real candidate experiences from top companies.
            </motion.p>
            {/* <div className='flex flex-col md:flex-row justify-center items-center gap-4'>
              <Link href='/interview-experience'>
                <motion.a
                  className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md mb-4 md:mb-0 md:mr-4 transition-colors duration-300'
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Experiences
                </motion.a>
              </Link>
            </div> */}
          </div>
        </section>
        <section className='bg-gray-800 py-20'>
          <div className='container mx-auto px-4'>
            <motion.h2
              className='text-2xl md:text-3xl font-bold text-center mb-12 text-white'
              initial={{ opacity: 0, y: -50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              How It Works
            </motion.h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
              <motion.div
                className='text-center'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <FaSearch className='text-3xl md:text-4xl mx-auto mb-4 text-blue-500' />
                <h3 className='text-lg md:text-xl font-bold mb-2 text-white'>
                  Browse
                </h3>
                <p className='text-gray-400'>Front-end Interview Stories</p>
              </motion.div>
              <motion.div
                className='text-center'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <FaFilter className='text-3xl md:text-4xl mx-auto mb-4 text-blue-500' />
                <h3 className='text-lg md:text-xl font-bold mb-2 text-white'>
                  Filter
                </h3>
                <p className='text-gray-400'>by Company, Role, and More</p>
              </motion.div>
              <motion.div
                className='text-center'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <FaBook className='text-3xl md:text-4xl mx-auto mb-4 text-blue-500' />
                <h3 className='text-lg md:text-xl font-bold mb-2 text-white'>
                  Read
                </h3>
                <p className='text-gray-400'>Detailed Front-end Experiences</p>
              </motion.div>
              <motion.div
                className='text-center'
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <FaCode className='text-3xl md:text-4xl mx-auto mb-4 text-blue-500' />
                <h3 className='text-lg md:text-xl font-bold mb-2 text-white'>
                  Prepare
                </h3>
                <p className='text-gray-400'>
                  for Your Next Front-end Interview
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* <ComingSoon /> */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 '>
          {interviewData.map((interview) => (
            <CardComponent {...interview} key={interview.id} />
          ))}
        </div>
        {/* End of Card Component */}

        {/* <div
          className={`text-center mt-8 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
        >
          <p className='text-lg'>
            🔍 Unlock Your Potential. 📝 Prepare Strategically. 💼 Ace Your
            Interview.
          </p>
          <p className='text-lg mt-4'>Join Frontend Interview Adda Today!</p>
        </div> */}

        {/* Why Choose Frontend Interview Adda */}
        <WhyChooseComponent />
      </div>

      {/* Footer */}
      {/* <FooterComponent /> */}
    </div>
  );
};

export default LandingPage;
