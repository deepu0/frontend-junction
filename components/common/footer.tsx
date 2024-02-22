'use client';
import React from 'react';
import { useTheme } from 'next-themes';

const FooterComponent: React.FC = () => {
  const { theme } = useTheme();

  return (
    <footer
      className={`bg-gray-800 text-${theme === 'light' ? 'white' : 'gray-300'} py-4`}
    >
      <div className='container mx-auto text-center'>
        <p>&copy; 2024 Frontend Interview Adda. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default FooterComponent;
