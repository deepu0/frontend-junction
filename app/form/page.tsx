'use client';
import '@/styles/globals.css';
import styles from '@/styles/Home.module.css';
import { questrialFont } from '@/form/utils';
import { MainContent, ProgressBar } from '@/form/components';
import classNames from 'classnames';
import {
  SharedStatesProvider,
  useQuestions,
  QuestionsProvider,
} from '@/form/contexts';

export default function Home() {
  const { percent } = useQuestions();

  return (
    <>
      <header className={styles.header}>
        <ProgressBar width={percent} />
      </header>
      <main className={styles.box}>
        <div className={`${classNames(styles.main, questrialFont.className)}`}>
          <QuestionsProvider>
            <SharedStatesProvider>
              <MainContent />
            </SharedStatesProvider>
          </QuestionsProvider>
        </div>
      </main>
    </>
  );
}
