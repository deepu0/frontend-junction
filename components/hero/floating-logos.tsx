'use client';

import Image from 'next/image';
import { memo } from 'react';

const logos = [
  { name: 'Google', path: '/companies/Google.png' },
  { name: 'Meta', path: '/companies/Meta.png' },
  { name: 'Microsoft', path: '/companies/Microsoft.png' },
  { name: 'Amazon', path: '/companies/amazon.png' },
  { name: 'Apple', path: '/companies/Apple.png' },
  { name: 'Flipkart', path: '/companies/Flipkart.png' },
  { name: 'Adobe', path: '/companies/Adobe.png' },
  { name: 'Uber', path: '/companies/Uber.png' },
  { name: 'Swiggy', path: '/companies/Swiggy.png' },
  { name: 'Zomato', path: '/companies/Zomato.png' },
  { name: 'Razorpay', path: '/companies/Razorpay.png' },
  { name: 'PhonePe', path: '/companies/PhonePe.png' },
] as const;

const roofColors = [
  'from-red-500 to-red-600',
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-yellow-500 to-yellow-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
  'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600',
  'from-orange-500 to-orange-600',
  'from-cyan-500 to-cyan-600',
  'from-rose-500 to-rose-600',
  'from-emerald-500 to-emerald-600',
];

// 🚃 Carriage Component
const Carriage = memo(
  ({ logo, index }: { logo: (typeof logos)[number]; index: number }) => (
    <div className='flex-shrink-0 flex items-end'>
      {/* Chain Link */}
      <div className='w-1.5 sm:w-2 md:w-3 h-0.5 bg-zinc-500 mb-5 sm:mb-6 md:mb-7' />

      <div className='relative'>
        {/* Carriage Body */}
        <div className='relative w-12 h-10 sm:w-14 sm:h-12 md:w-18 md:h-14 lg:w-20 lg:h-16 rounded-lg overflow-hidden shadow-lg border border-white/10'>
          {/* Roof */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 sm:h-2 md:h-2.5 bg-gradient-to-r ${roofColors[index % roofColors.length]}`}
          />

          {/* Body */}
          <div className='absolute inset-0 top-1.5 sm:top-2 md:top-2.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900' />

          {/* Logo Window - WHITE background for visibility */}
          <div className='absolute inset-1 sm:inset-1.5 top-3 sm:top-3.5 md:top-4  flex items-center justify-center'>
            <div className='relative w-8 h-6 sm:w-9 sm:h-7 md:w-12 md:h-9 lg:w-14 lg:h-10'>
              <Image
                src={logo.path}
                alt={logo.name}
                fill
                className='object-contain p-0.5'
                sizes='(max-width: 640px) 48px, (max-width: 768px) 56px, 64px'
                loading={index < 5 ? 'eager' : 'lazy'}
                priority={index < 5}
                quality={85}
              />
            </div>
          </div>
        </div>

        {/* Wheels */}
        <div className='flex justify-center gap-3 sm:gap-4 md:gap-5 -mt-1.5'>
          <div className='wheel w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-600 border-2 border-zinc-500 shadow-md' />
          <div className='wheel w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-3.5 md:h-3.5 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-600 border-2 border-zinc-500 shadow-md' />
        </div>
      </div>
    </div>
  )
);
Carriage.displayName = 'Carriage';

// 🚂 Engine Component
const Engine = memo(() => (
  <div className='flex-shrink-0 flex items-end'>
    {/* Chain */}
    <div className='w-1.5 sm:w-2 md:w-3 h-0.5 bg-zinc-500 mb-5 sm:mb-6 md:mb-7' />

    <div className='relative'>
      {/* Chimney & Smoke */}
      <div className='absolute -top-5 sm:-top-6 md:-top-7 right-5 sm:right-6 md:right-8 flex flex-col items-center'>
        <div className='w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 bg-gradient-to-b from-zinc-600 to-zinc-800 rounded-t-sm' />
        {/* Smoke */}
        <div className='absolute -top-3 sm:-top-4 left-1/2 -translate-x-1/2'>
          <div className='smoke-1 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/40 absolute' />
          <div className='smoke-2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-white/30 absolute -left-1.5' />
          <div className='smoke-3 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-white/20 absolute -left-3' />
        </div>
      </div>

      {/* Boiler */}
      <div className='absolute -left-2.5 sm:-left-3 md:-left-4 top-1 sm:top-1.5 w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-800 border-2 border-red-400 shadow-lg'>
        {/* Headlight */}
        <div className='absolute top-1/2 -left-0.5 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-yellow-300 shadow-[0_0_6px_rgba(253,224,71,0.8)]' />
      </div>

      {/* Cabin */}
      <div className='w-14 h-10 sm:w-16 sm:h-12 md:w-20 md:h-14 lg:w-24 lg:h-16 bg-gradient-to-b from-red-500 via-red-600 to-red-700 rounded-t-lg rounded-r-md shadow-xl border border-red-400 relative overflow-hidden'>
        {/* Window */}
        <div className='absolute top-1 sm:top-1.5 md:top-2 right-1 sm:right-1.5 md:right-2 w-5 h-4 sm:w-6 sm:h-5 md:w-8 md:h-6 bg-gradient-to-b from-sky-300 to-sky-400 rounded-sm border-2 border-red-800'>
          <div className='absolute top-1/2 left-0 right-0 h-px bg-red-900/40' />
          <div className='absolute left-1/2 top-0 bottom-0 w-px bg-red-900/40' />
        </div>
        {/* Yellow stripe */}
        <div className='absolute bottom-1 sm:bottom-1.5 md:bottom-2 left-1 right-1 sm:left-1.5 sm:right-1.5 h-1 sm:h-1.5 bg-yellow-400 rounded-full' />
        {/* FJ Badge */}
        <div className='absolute bottom-1 sm:bottom-1.5 left-1 sm:left-1.5 text-[5px] sm:text-[6px] md:text-[8px] font-bold text-yellow-400'>
          FJ
        </div>
      </div>

      {/* Roof */}
      <div className='absolute -top-1 sm:-top-1.5 right-0 w-12 sm:w-14 md:w-18 lg:w-22 h-1 sm:h-1.5 bg-gradient-to-b from-red-700 to-red-900 rounded-t' />

      {/* Wheels */}
      <div className='flex justify-center items-end gap-1 sm:gap-1.5 md:gap-2 -mt-2 sm:-mt-2.5'>
        <div className='wheel w-2.5 h-2.5 sm:w-3 sm:h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700 border-2 border-zinc-500 shadow-md' />
        <div className='wheel w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700 border-[3px] border-zinc-500 shadow-lg' />
        <div className='wheel w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-b from-zinc-400 to-zinc-700 border-[3px] border-zinc-500 shadow-lg' />
      </div>
    </div>

    <div className='w-3 sm:w-4 md:w-6 flex-shrink-0' />
  </div>
));
Engine.displayName = 'Engine';

// 🛤️ Track Component
const Track = memo(() => (
  <div className='absolute bottom-0 left-0 right-0 h-4 sm:h-5 md:h-6'>
    {/* Rails */}
    <div className='absolute bottom-2 sm:bottom-2.5 md:bottom-3 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-b from-zinc-500 to-zinc-600' />
    <div className='absolute bottom-3.5 sm:bottom-4 md:bottom-5 left-0 right-0 h-0.5 bg-zinc-500/50' />
    {/* Sleepers - Optimized with CSS Gradient */}
    <div className='sleepers absolute bottom-0 left-0 right-0 h-1.5 sm:h-2 md:h-2.5' />
  </div>
));
Track.displayName = 'Track';

// 🚂 Train Unit
const TrainUnit = memo(() => (
  <div className='train-unit flex items-end flex-shrink-0 pb-3 sm:pb-4 md:pb-5'>
    {logos.map((logo, index) => (
      <Carriage key={logo.name} logo={logo} index={index} />
    ))}
    <Engine />
  </div>
));
TrainUnit.displayName = 'TrainUnit';

// 🌟 Main Component
export default function FloatingLogos() {
  return (
    <div className='train-container relative h-24 sm:h-28 md:h-32 lg:h-36 w-full overflow-hidden'>
      {/* Track & Train */}
      <div className='absolute inset-0 flex items-end'>
        <Track />
        <div className='train-marquee flex w-fit'>
          <TrainUnit />
          <TrainUnit />
        </div>
      </div>
    </div>
  );
}
