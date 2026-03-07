'use client';
import React, { useMemo } from 'react';
import { useExperiences } from '@/hooks/useExperiences';
import { useAuth } from './session-provider';
import CardComponent from './common/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2,
  ShieldCheck,
  FileText,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

interface Experience {
  id: string;
  title: string;
  description: string;
  status: string;
  isExclusive?: boolean;
  tags: string[];
  [key: string]: any;
}

interface AdminDashboardProps {
  isAdminOverride?: boolean;
}

export default function AdminDashboard({
  isAdminOverride = false,
}: AdminDashboardProps) {
  const { user, isLoading: authLoading } = useAuth();
  const { experiences: initialExperiences, isLoading: dataLoading } =
    useExperiences();
  const [experiences, setExperiences] = React.useState<Experience[]>([]);

  React.useEffect(() => {
    if (initialExperiences.length > 0) setExperiences(initialExperiences);
  }, [initialExperiences]);

  const removeExperience = (id: string) =>
    setExperiences((prev) => prev.filter((e) => e.id !== id));

  const markApproved = (id: string) =>
    setExperiences((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: 'accepted' } : e))
    );

  const isAdmin = isAdminOverride || user?.role === 'admin';

  const stats = useMemo(() => {
    const total = experiences.length;
    const pending = experiences.filter(
      (e: Experience) => e.status === 'pending'
    ).length;
    const active = total - pending;
    const exclusive = experiences.filter(
      (e: Experience) => e.isExclusive
    ).length;
    return { total, pending, active, exclusive };
  }, [experiences]);

  if (authLoading || dataLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-900'>
        <Loader2 className='w-12 h-12 text-primary animate-spin' />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className='min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4'>
        <ShieldCheck className='w-20 h-20 text-red-500 mb-6' />
        <h1 className='text-3xl font-bold mb-2 text-center'>
          Unauthorized Access
        </h1>
        <p className='text-gray-400 text-center mb-8 max-w-md'>
          You do not have administrative privileges to access this area. If you
          believe this is an error, please contact system support.
        </p>
        <Link href='/'>
          <Button
            variant='outline'
            className='text-white border-white hover:bg-white hover:text-black'
          >
            Return to Homepage
          </Button>
        </Link>
      </div>
    );
  }

  const pendingPosts = experiences.filter(
    (e: Experience) => e.status === 'pending'
  );
  const livePosts = experiences.filter(
    (e: Experience) => e.status !== 'pending'
  );

  return (
    <div className='min-h-screen bg-gray-950 pt-28 pb-20 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-12'>
          <h1 className='text-4xl font-extrabold text-white tracking-tight mb-2 flex items-center gap-3'>
            Admin Management{' '}
            <span className='text-primary text-sm px-2 py-1 bg-primary/10 rounded-lg border border-primary/20'>
              Control Center
            </span>
          </h1>
          <p className='text-gray-400'>
            Review, moderate, and manage all interview experiences across the
            platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12'>
          {[
            {
              label: 'Total Posts',
              value: stats.total,
              icon: FileText,
              color: 'text-blue-500',
              bg: 'bg-blue-500/10',
            },
            {
              label: 'Pending Review',
              value: stats.pending,
              icon: Clock,
              color: 'text-yellow-500',
              bg: 'bg-yellow-500/10',
            },
            {
              label: 'Live on Feed',
              value: stats.active,
              icon: CheckCircle,
              color: 'text-green-500',
              bg: 'bg-green-500/10',
            },
            {
              label: 'Exclusive Content',
              value: stats.exclusive,
              icon: ShieldCheck,
              color: 'text-violet-500',
              bg: 'bg-violet-500/10',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className='bg-gray-900/50 border border-gray-800 p-6 rounded-2xl backdrop-blur-sm'
            >
              <div className='flex items-center justify-between mb-4'>
                <div className={`p-3 rounded-xl ${stat.bg}`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className='text-3xl font-bold text-white mb-1'>
                {stat.value}
              </div>
              <div className='text-sm text-gray-500 font-medium uppercase tracking-wider'>
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue='pending' className='w-full'>
          <TabsList className='bg-gray-900 border border-gray-800 p-1 rounded-xl mb-8'>
            <TabsTrigger
              value='pending'
              className='data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-6 py-2 rounded-lg'
            >
              Pending ({pendingPosts.length})
            </TabsTrigger>
            <TabsTrigger
              value='all'
              className='data-[state=active]:bg-gray-800 px-6 py-2 rounded-lg'
            >
              All Posts
            </TabsTrigger>
          </TabsList>

          <TabsContent value='pending'>
            {pendingPosts.length === 0 ? (
              <div className='text-center py-20 bg-gray-900/20 border border-dashed border-gray-800 rounded-3xl'>
                <CheckCircle className='w-12 h-12 text-green-500 mx-auto mb-4 opacity-20' />
                <p className='text-gray-500 text-lg'>
                  Inbox Zero! No pending posts to review.
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                <AnimatePresence>
                  {pendingPosts.map((post: Experience) => (
                    <motion.div
                      key={post.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                    >
                      <CardComponent
                        {...post}
                        isAdmin={true}
                        onDelete={() => removeExperience(post.id)}
                        onApprove={() => markApproved(post.id)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </TabsContent>

          <TabsContent value='all'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {experiences.map((post: Experience) => (
                <div key={post.id}>
                  <CardComponent
                    {...post}
                    isAdmin={true}
                    onDelete={() => removeExperience(post.id)}
                    onApprove={() => markApproved(post.id)}
                  />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
