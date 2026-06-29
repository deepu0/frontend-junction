import { BtnContainer } from '../btn-container/BtnContainer';
import { Error } from '../error/Error';
import { QuestionInputText } from '../question-input-text/QuestionInputText';
import { QuestionNumHeading } from '../question-num-heading/QuestionNumHeading';
import classNames from 'classnames';
import styles from './Question.module.css';
import Image from 'next/image';
import { ChangeEventHandler } from 'react';
import { SET_INTERVIEW_DATE } from '@/form/reducers/actions/questionsActions';
import { useQuestions, useSharedStates } from '@/form/contexts/index';
import DateSelector from '../date-selector/DateSelect';

export function DateInput() {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();

  const errorMsg = error.interviewDate ?? '';
  const { interviewDate } = state;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    errorMsg &&
      setErrorMsg &&
      setErrorMsg((prevValue) => {
        delete prevValue.interviewDate;
        return prevValue;
      });
    dispatch({ type: SET_INTERVIEW_DATE, payload: event.target.value });
  };

  return (
    <>
      <QuestionNumHeading questionNum={1}>
        🏢 Interview Date?*
      </QuestionNumHeading>

      <DateSelector
        placeholder='Type your answer here...'
        value={interviewDate}
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
