'use client';

import React from 'react';
import { useTheme } from 'next-themes';

const WhyChooseComponent: React.FC = () => {
  const { theme } = useTheme();
  const bg = theme === 'light' ? 'text-gray-700' : 'text-gray-400';
  return (
    <div
      className={`max-w-3xl mx-auto mt-8 rounded-lg p-8 ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} text-${theme === 'light' ? 'gray-700' : 'white'} shadow-md transition duration-500 ease-in-out transform hover:scale-105`}
    >
      <h2
        className={`text-2xl font-bold mb-4 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
      >
        Why Choose Frontend Junction?
      </h2>
      <p
        className={`${bg} text-lg mb-4`}
      >{`🎯 Curated Interview Experiences: Gain insights from real interview experiences shared by candidates who've been through the process.`}</p>
      <p
        className={`${bg} text-lg mb-4`}
      >{`📈 Comprehensive Coverage: Explore interview experiences from a wide range of top tech companies, ensuring you're prepared for any scenario.`}</p>
      <p className={`${bg} text-lg mb-4`}>
        🔎 Search and Filter: Easily find interview experiences tailored to
        specific companies, roles, or technical topics to focus your preparation
        effectively.
      </p>
      <p className={`${bg} text-lg mb-4`}>
        💬 Community Support: Join a vibrant community of frontend developers
        sharing tips, strategies, and support to help each other succeed in
        interviews.
      </p>
      <a
        href='#'
        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full block text-center ${theme === 'light' ? 'hover:bg-blue-600' : 'hover:bg-blue-800'}`}
      >
        Get Started
      </a>
    </div>
  );
};

export default WhyChooseComponent;
