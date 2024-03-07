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
import Link from 'next/link';

const LandingPage: React.FC = () => {
  const { theme } = useTheme();

  const dummyCompanies = [
    { logo: 'https://via.placeholder.com/50', name: 'Company 1' },
    { logo: 'https://via.placeholder.com/50', name: 'Company 2' },
    { logo: 'https://via.placeholder.com/50', name: 'Company 3' },
    { logo: 'https://via.placeholder.com/50', name: 'Company 4' },
    { logo: 'https://via.placeholder.com/50', name: 'Company 5' },
    // Add more dummy companies as needed
  ];

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
    <div className={`flex flex-col min-h-screen `}>
      <div className='flex flex-col gap-8 container mx-auto mt-14 px-4 flex-grow'>
        {/* <h1 className={`text-3xl md:text-7xl font-bold mb-6 relative text-left dark:text-zinc-100 text-zinc-700 max-w-4xl ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>🚀 Ace Your Next Frontend Interview</h1> */}
        <TypewriterEffect words={words} className='text-2xl' />
        <p
          className={`relative font-regular text-sm sm:text-xl text-zinc-500 tracking-wide mb-4 text-center max-w-2xl antialiased  ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'} mx-auto`}
        >
          Prepare with Confidence: End your interview prep frustration. Get
          frontend interview experiences from across the web, all in one place.
        </p>
        <div className='flex justify-center my-4 flex-row md:flex-row md:space-y-0 space-x-0  mt-10 gap-2'>
          <button className='w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm mt-0 hover:scale-105'>
            Join now
          </button>
          <button className='w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm mt-0 hover:scale-105'>
            <Link href='/interview-experience'>Explore Experiences</Link>
          </button>
        </div>
        {/* Card Component */}
        {/* <CompanySlider companies={dummyCompanies}/> */}

        <ComingSoon />
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8'>
          {interviewData.map((interview) => (
            <CardComponent {...interview} key={interview.id} />
          ))}
        </div>
        {/* End of Card Component */}

        <div
          className={`text-center mt-8 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
        >
          <p className='text-lg'>
            🔍 Unlock Your Potential. 📝 Prepare Strategically. 💼 Ace Your
            Interview.
          </p>
          <p className='text-lg mt-4'>Join Frontend Interview Adda Today!</p>
        </div>

        {/* Why Choose Frontend Interview Adda */}
        <WhyChooseComponent />
      </div>

      {/* Footer */}
      {/* <FooterComponent /> */}
    </div>
  );
};

export default LandingPage;
