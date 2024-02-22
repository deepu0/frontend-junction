import React from 'react';
import { useTheme } from 'next-themes';

const ComingSoon: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div
      className={`bg-${theme === 'light' ? 'white' : 'gray-800'} p-6 rounded-md shadow-md text-${theme === 'light' ? 'gray-800' : 'white'} transition duration-300 transform hover:scale-105`}
    >
      <h3 className='text-lg font-semibold mb-2'>🚀 Features Coming Soon</h3>
      <ul className='list-disc pl-6'>
        <li>Filter companies</li>
        <li>Search companies</li>
        <li>Add interview experience</li>
        <li>Like/dislike interviews</li>
      </ul>
    </div>
  );
};

export default ComingSoon;
