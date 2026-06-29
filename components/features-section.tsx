'use client';

import { m } from 'framer-motion';
import {
  FaBookOpen,
  FaBriefcase,
  FaUserCheck,
  FaLightbulb,
} from 'react-icons/fa';

const features = [
  {
    icon: FaBookOpen,
    title: 'Verified Experiences',
    desc: 'Real interview stories from candidates who cleared rounds at top tech giants.',
    color: 'text-blue-500',
  },
  {
    icon: FaBriefcase,
    title: 'Curated Jobs',
    desc: 'Handpicked frontend roles from high-growth startups and established MNCs.',
    color: 'text-green-500',
  },
  {
    icon: FaUserCheck,
    title: 'Community Insights',
    desc: 'Salary negotiations, resume tips, and career advice from senior engineers.',
    color: 'text-purple-500',
  },
  {
    icon: FaLightbulb,
    title: 'System Design',
    desc: 'Frontend-focused system design resources and pattern implementations.',
    color: 'text-orange-500',
  },
];

export default function FeaturesSection() {
  return (
    <section className='py-24 bg-background/50 relative'>
      <div className='container mx-auto px-4'>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='text-center mb-16'
        >
          <h2 className='text-3xl md:text-5xl font-bold mb-4'>
            Why Frontend Junction?
          </h2>
          <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
            We collect, verify, and organize everything you need to crack your
            next specific frontend role.
          </p>
        </m.div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8'>
          {features.map((f, i) => (
            <m.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className='p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 transition-all hover:shadow-lg hover:-translate-y-1'
            >
              <f.icon className={`text-4xl mb-4 ${f.color}`} />
              <h3 className='text-xl font-bold mb-2'>{f.title}</h3>
              <p className='text-muted-foreground'>{f.desc}</p>
            </m.div>
          ))}
        </div>
      </div>
    </section>
  );
}
