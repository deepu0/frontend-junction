import { motion } from 'framer-motion';
import useGetStats from '@/hooks/useGetStats';
import { Skeleton } from './ui/skeleton';

export default function StatsSection() {
  const { stats, isLoading } = useGetStats();

  const statsDisplay = [
    {
      label: 'Interview Stories',
      value: `${stats.stories}${stats.stories > 100 ? '+' : ''}`,
    },
    {
      label: 'Companies Covered',
      value: `${stats.companies}${stats.companies > 20 ? '+' : ''}`,
    },
    {
      label: 'Community Members',
      value: `${stats.members}${stats.members > 50 ? '+' : ''}`,
    },
  ];

  return (
    <section className='py-12 border-y border-border/40 bg-muted/20'>
      <div className='container mx-auto px-4'>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
          {statsDisplay.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className='text-center flex flex-col items-center'
            >
              <div className='text-3xl md:text-4xl font-black bg-clip-text text-transparent bg-gradient-to-br from-foreground to-muted-foreground mb-1 min-h-[40px] flex items-center justify-center'>
                {isLoading ? <Skeleton className='h-8 w-20' /> : s.value}
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
