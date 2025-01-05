'use client';
import '@/styles/globals.css';
import { Suspense } from 'react';
import { useEffect } from 'react';
import styles from '@/styles/Home.module.css';
import { questrialFont } from '@/form/utils';
import { MainContent } from '@/form/components';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import Loading from '../loading';
import {
  SharedStatesProvider,
  useQuestions,
  QuestionsProvider,
} from '@/form/contexts';
import { useAuth } from '@/components/session-provider';
import { useRouter } from 'next/navigation';
import InterviewExperienceForm from '@/components/add-new-experience';

export default function Home() {
  const router = useRouter();
  // const { user } = useAuth();
  // useEffect(() => {
  //   if (!user) {
  //     router.push('/');
  //     return;
  //   }
  // }, [user]);
  return (
    <Suspense fallback={<Loading />}>
      <main className={styles.box}>
        {/* //To do */}
        {/* <ProgressBar width={percent} /> */}

        {/* <div className={`${classNames(styles.main, questrialFont.className)}`}>
          <QuestionsProvider>
            <SharedStatesProvider>
              <MainContent />
            </SharedStatesProvider>
          </QuestionsProvider>
        </div> */}
        <InterviewExperienceForm />
      </main>
    </Suspense>
  );
}
