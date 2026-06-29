import { QuestionBoxHeading } from '../question-box-heading/QuestionBoxHeading';
import classNames from 'classnames';
import styles from './QuestionNumHeading.module.css';
import Image from 'next/image';
import { ReactNode } from 'react';
import { useSharedStates } from '@/form/contexts/index';

type QuestionNumHeadingProps = {
  readonly children: ReactNode;
  readonly questionNum: number;
};

export function QuestionNumHeading({
  children,
  questionNum,
}: QuestionNumHeadingProps) {
  const { questionNum: number, setShowIndustriesList } = useSharedStates();
  return (
    <QuestionBoxHeading
      className={classNames(styles['question-box__heading'], styles['num'])}
    >
      <span>
        {number.now}
        <Image
          src='./right-arrow.svg'
          alt='right arrow'
          width={16}
          height={16}
        />
      </span>
      {children}
    </QuestionBoxHeading>
  );
}
