'use client';

import { motion } from 'framer-motion';

const stats = [
  { label: 'Interview Stories', value: '500+' },
  { label: 'Companies Covered', value: '50+' },
  { label: 'Active Developers', value: '10k+' },
  { label: 'Success Rate', value: '85%' },
];

export default function StatsSection() {
  return (
    <section className='py-12 border-y border-border/40 bg-muted/20'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-8'>
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className='text-center'
            >
              <div className='text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground mb-1'>
                {s.value}
              </div>
              <div className='text-sm font-medium text-muted-foreground uppercase tracking-widest'>
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
