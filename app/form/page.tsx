'use client';
import '@/styles/globals.css';
import styles from '@/styles/Home.module.css';
import { questrialFont } from '@/form/utils';
//import { MainContent } from '@/form/components';
import classNames from 'classnames';
import dynamic from 'next/dynamic';
import {
  SharedStatesProvider,
  useQuestions,
  QuestionsProvider,
} from '@/form/contexts';
const DynamicComponentWithNoSSR = dynamic(
  (): any => import('@/form/components'),
  { ssr: false }
);

export default function Home() {
  const { percent } = useQuestions();

  return (
    <>
      <main className={styles.box}>
        {/* //To do */}
        {/* <ProgressBar width={percent} /> */}

        <div className={`${classNames(styles.main, questrialFont.className)}`}>
          <QuestionsProvider>
            <SharedStatesProvider>
              <DynamicComponentWithNoSSR />
            </SharedStatesProvider>
          </QuestionsProvider>
        </div>
      </main>
    </>
  );
}
