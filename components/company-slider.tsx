'use client';
import React from 'react';
import { useTheme } from 'next-themes';
import { motion } from 'framer-motion';

interface CompanySliderProps {
  companies: { logoUrl: string }[];
}

const CompanySlider: React.FC<CompanySliderProps> = ({ companies }) => {
  return (
    <section className='bg-gray-900 py-20 w-screen'>
      <div className='mx-auto px-4'>
        <motion.h2
          className='text-2xl md:text-3xl font-bold text-center mb-12 text-white'
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          Featured Companies
        </motion.h2>
        <div className='overflow-hidden w-screen'>
          <div className='flex animate-slide'>
            {companies.map((logo, index) => (
              <motion.img
                key={index}
                src={logo.logoUrl}
                alt={`Company Logo ${index + 1}`}
                className='h-12 md:h-16 mx-4'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanySlider;
