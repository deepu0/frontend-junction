import { QuestionProps } from '@/form/types/question';
import classNames from 'classnames';
import { EmailInput } from './EmailInput';
import { FirstNameInput } from './FirstNameInput';
import { GoalInput } from './GoalInput';
import { IndustryInput } from './IndustryInput';
import { Intro } from './Intro';
import { LastNameInput } from './LastNameInput';
import { RoleInput } from './RoleInput';
import { InterviewInput } from './InterviewInput';
import { IdentityInput } from './PostType';
import { DateInput } from './DateInput';
import styles from './Question.module.css';

export function Question({
  inView,
  inViewSlide,
  outView,
  outViewSlide,
  isRendered,
  type,
}: QuestionProps) {
  return (
    <div
      className={classNames(styles['question-box'], {
        [styles['slide-out']]: outView,
        [styles['slide-in']]: inView,
        [styles['out-view__up']]: outViewSlide === 'up',
        [styles['out-view__down']]: outViewSlide === 'down',
        [styles['in-view__up']]: inViewSlide === 'up',
        [styles['in-view__down']]: inViewSlide === 'down',
        [styles['rendered']]: isRendered,
      })}
    >
      {type === 'intro' && <Intro />}
      {type === 'firstName' && <FirstNameInput />}
      {type === 'lastName' && <LastNameInput />}
      {type === 'industry' && <IndustryInput />}
      {type === 'role' && <RoleInput />}
      {type === 'goal' && <GoalInput />}
      {type === 'email' && <EmailInput />}
      {type === 'description' && <InterviewInput />}
      {type === 'identity' && <IdentityInput />}
      {type === 'interviewDate' && <DateInput />}
    </div>
  );
}
