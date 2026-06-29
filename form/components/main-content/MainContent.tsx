'use client';
import '@/styles/globals.css';
import { useRef } from 'react';
import { useSharedStates } from '@/form/contexts/shared-states-context';
import { useHandleKeypress } from '@/form/hooks/useHandleKeypress';
import { useHandleScroll } from '@/form/hooks/useHandleScroll';
import { useEffect } from 'react';
import { Question } from '../question/Question';
import Success from '@/components/common/confetti';

const questions = [
  { index: 0, type: 'intro' },
  { index: 1, type: 'firstName' },
  { index: 2, type: 'lastName' },
  { index: 3, type: 'industry' },
  { index: 4, type: 'role' },
  //{ index: 5, type: 'goal' },
  { index: 5, type: 'description' },
  { index: 6, type: 'email' },
  { index: 7, type: 'interviewDate' },
  { index: 8, type: 'identity' },
];

export function MainContent() {
  const { questionNum, setShowIndustriesList } = useSharedStates();
  const { prev, now } = questionNum;

  const { isLoading, isFailure, isSuccess } = useHandleKeypress();
  //useHandleScroll();
  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;
  }, []);

  useEffect(() => {
    function handleClick() {
      setShowIndustriesList(false);
    }
    if (typeof window !== 'undefined') {
      // browser code
      document.addEventListener('click', handleClick);
    }

    return function () {
      document.removeEventListener('click', handleClick);
    };

    // react-doctor-disable-next-line react-doctor/exhaustive-deps
  }, []);

  if (isLoading) {
    return <p>Submitting your data...</p>;
  }
  if (isSuccess) {
    return <Success />;
  }

  return (
    <section suppressHydrationWarning>
      <div>
        {questions.map(
          ({ index, type }) =>
            [prev, now].includes(index) && (
              <Question
                key={type}
                type={type as any}
                outView={now - 1 === index}
                outViewSlide={now - 1 === index ? 'up' : 'down'}
                inView={now === index}
                inViewSlide={prev === index ? 'down' : 'up'}
              />
            )
        )}
      </div>
    </section>
  );
}
