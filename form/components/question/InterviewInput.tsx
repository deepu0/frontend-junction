import {
  BtnContainer,
  Error,
  QuestionNumHeading,
  InterviewInputText,
  InterviewBoxPara,
} from '../index';
import classNames from 'classnames';
import styles from './Question.module.css';
import Image from 'next/image';
import { ChangeEventHandler } from 'react';
import { SET_DESCRIPTION } from '@/form/reducers';
import { useQuestions, useSharedStates } from '@/form/contexts';

export function InterviewInput() {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();

  const errorMsg = error.description ?? '';
  const { description } = state;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (
    event: any
  ) => {
    errorMsg &&
      setErrorMsg &&
      setErrorMsg((prevValue) => {
        delete prevValue.description;
        return prevValue;
      });
    dispatch({ type: SET_DESCRIPTION, payload: event });
  };
  const placeholder = `
  Format:
  Provide a brief overview of each interview stage, including:
  1.Outline the format of each interview (e.g., phone screen, onsite).
  2.Questions: Mention key questions or topics covered.
  3.Duration: Estimate the duration of each interview.
  4.Challenges: Note any challenges faced during the process.
  5.Highlights: Highlight any positive experiences.
  6.Overall Impressions: Summarize your overall impression of the
  interviews.
  `;

  return (
    <>
      <QuestionNumHeading questionNum={6}>
        🏢 Describe your interview experience?*
      </QuestionNumHeading>
      {/* <InterviewBoxPara>
        Format:
        Provide a brief overview of each interview stage, including:        1.Outline the format of each interview (e.g., phone screen, onsite).
        2.Questions: Mention key questions or topics covered.
        3.Duration: Estimate the duration of each interview.
        4.Challenges: Note any challenges faced during the process.
        5.Highlights: Highlight any positive experiences.
        6.Overall Impressions: Summarize your overall impression of the
        interviews.
        <br />
      </InterviewBoxPara> */}

      <InterviewInputText
        placeholder={placeholder}
        value={description}
        onChange={handleInputChange}
      />

      {errorMsg && <Error message={errorMsg} />}

      {errorMsg === '' && (
        <BtnContainer
          className={classNames(styles['btn-container'], styles['ok'])}
          showPressEnter={true}
          onClick={handleOkClick}
        >
          OK{' '}
          <Image
            src='/check-small.svg'
            alt='check small'
            width={34}
            height={34}
          />
        </BtnContainer>
      )}
    </>
  );
}
