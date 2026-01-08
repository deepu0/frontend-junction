'use client';
import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CompanySliderProps {
  companies: { logoUrl: string; companyName?: string }[];
}

const CompanySlider: React.FC<CompanySliderProps> = ({ companies }) => {
  // Reduced to 16 logos for better performance
  const featuredLogos = [
    {
      name: 'Google',
      path: '/companies/Google.png',
      url: 'https://www.google.com',
    },
    {
      name: 'Meta',
      path: '/companies/Meta.png',
      url: 'https://about.meta.com',
    },
    {
      name: 'Microsoft',
      path: '/companies/Microsoft.png',
      url: 'https://www.microsoft.com',
    },
    {
      name: 'Amazon',
      path: '/companies/amazon.png',
      url: 'https://www.amazon.com',
    },
    {
      name: 'Apple',
      path: '/companies/Apple.png',
      url: 'https://www.apple.com',
    },
    { name: 'Uber', path: '/companies/Uber.png', url: 'https://www.uber.com' },
    {
      name: 'Flipkart',
      path: '/companies/Flipkart.png',
      url: 'https://www.flipkart.com',
    },
    {
      name: 'Swiggy',
      path: '/companies/Swiggy.png',
      url: 'https://www.swiggy.com',
    },
    {
      name: 'Adobe',
      path: '/companies/Adobe.png',
      url: 'https://www.adobe.com',
    },
    {
      name: 'Salesforce',
      path: '/companies/Salesforce.png',
      url: 'https://www.salesforce.com',
    },
    {
      name: 'Atlassian',
      path: '/companies/Atlassian.png',
      url: 'https://www.atlassian.com',
    },
    { name: 'IBM', path: '/companies/IBM.png', url: 'https://www.ibm.com' },
    {
      name: 'Razorpay',
      path: '/companies/Razorpay.png',
      url: 'https://razorpay.com',
    },
    {
      name: 'PhonePe',
      path: '/companies/PhonePe.png',
      url: 'https://www.phonepe.com',
    },
    {
      name: 'Meesho',
      path: '/companies/Meesho.png',
      url: 'https://www.meesho.com',
    },
    {
      name: 'Myntra',
      path: '/companies/Myntra.png',
      url: 'https://www.myntra.com',
    },
  ];

  // Compact positions for above-the-fold
  const positions = [
    // Row 1
    { top: '15%', left: '8%' },
    { top: '12%', left: '25%' },
    { top: '18%', left: '42%' },
    { top: '10%', left: '58%' },
    { top: '15%', left: '75%' },
    { top: '20%', left: '92%' },
    // Row 2
    { top: '45%', left: '5%' },
    { top: '48%', left: '20%' },
    { top: '42%', left: '38%' },
    { top: '50%', left: '55%' },
    { top: '45%', left: '72%' },
    { top: '48%', left: '88%' },
    // Row 3
    { top: '75%', left: '12%' },
    { top: '72%', left: '30%' },
    { top: '78%', left: '50%' },
    { top: '75%', left: '68%' },
  ];

  return (
    <section className='relative py-16 overflow-hidden bg-gradient-to-b from-background via-muted/10 to-background'>
      {/* Subtle background gradient */}
      <div className='absolute inset-0 overflow-hidden pointer-events-none opacity-50'>
        <motion.div
          className='absolute top-1/3 -left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl'
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className='container mx-auto px-4 relative z-10'>
        {/* Compact Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className='text-center mb-8 relative z-20'
        >
          <span className='px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20 backdrop-blur-sm inline-block mb-3'>
            🚀 Trusted by Top Companies
          </span>
          <h2 className='text-2xl md:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground via-primary to-violet-600'>
            Featured Companies
          </h2>
        </motion.div>

        {/* Compact Floating Logos - fits above fold */}
        <div className='relative w-full h-[280px] md:h-[320px] max-w-6xl mx-auto'>
          {featuredLogos.map((company, index) => {
            const position = positions[index] || positions[0];
            return (
              <FloatingLogo
                key={index}
                company={company}
                index={index}
                position={position}
              />
            );
          })}
        </div>

        {/* Compact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className='text-center mt-8 relative z-20'
        >
          <p className='text-muted-foreground text-sm'>
            <span className='font-bold text-primary'>100+</span> more companies
          </p>
        </motion.div>
      </div>
    </section>
  );
};

// Optimized Floating Logo Component
const FloatingLogo: React.FC<{
  company: { name: string; path: string; url: string };
  index: number;
  position: { top: string; left: string };
}> = ({ company, index, position }) => {
  // Simpler, more performant animation
  const duration = 12 + (index % 5) * 2; // 12-20s
  const xOffset = (index % 2 === 0 ? 1 : -1) * 15;
  const yOffset = (index % 3 === 0 ? 1 : -1) * 15;

  return (
    <motion.a
      href={company.url}
      target='_blank'
      rel='noopener noreferrer'
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.03,
        duration: 0.4,
      }}
      style={{
        position: 'absolute',
        top: position.top,
        left: position.left,
      }}
      className='group -translate-x-1/2 -translate-y-1/2'
    >
      <motion.div
        animate={{
          x: [0, xOffset, 0],
          y: [0, yOffset, 0],
        }}
        transition={{
          duration: duration,
          repeat: Infinity,
          ease: 'linear',
        }}
        whileHover={{
          scale: 1.15,
        }}
        className='relative p-2 md:p-3 rounded-xl bg-card/40 backdrop-blur-sm border border-border/30 transition-all duration-200 cursor-pointer hover:bg-card/60 hover:border-primary/40 hover:shadow-lg'
      >
        {/* Small logo - performance optimized */}
        <div className='relative w-8 h-8 md:w-10 md:h-10'>
          <Image
            src={company.path}
            alt={company.name}
            fill
            className='object-contain filter saturate-75 group-hover:saturate-100 transition-all duration-200'
            unoptimized
            loading='lazy'
          />
        </div>

        {/* Compact tooltip */}
        <div className='absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none'>
          <div className='px-2 py-1 bg-foreground text-background text-[10px] font-semibold rounded whitespace-nowrap'>
            {company.name}
          </div>
        </div>
      </motion.div>
    </motion.a>
  );
};

export default CompanySlider;
