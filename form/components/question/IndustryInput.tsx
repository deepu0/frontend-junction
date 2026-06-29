import { BtnContainer } from '../btn-container/BtnContainer';
import { Error } from '../error/Error';
import { QuestionBoxPara } from '../question-box-para/QuestionBoxPara';
import { QuestionInputIndustries } from '../question-input-industries/QuestionInputIndustries';
import { QuestionNumHeading } from '../question-num-heading/QuestionNumHeading';
import classNames from 'classnames';
import styles from './Question.module.css';
import Image from 'next/image';
import { useSharedStates, useQuestions } from '@/form/contexts/index';

export function IndustryInput() {
  const {
    showIndustriesList,
    setShowIndustriesList,
    setErrorMsg,
    errorMsg: error,
    handleOkClick,
  } = useSharedStates();
  const errorMsg = error.industry ?? '';
  const { state, dispatch } = useQuestions();

  const { firstName, lastName } = state;

  return (
    <>
      <QuestionNumHeading questionNum={3}>
        {/* 🔍 What was the status of the interview result? * */}
        What <b className='text-orange-500'>job title</b> were you chasing at{' '}
        {firstName}
      </QuestionNumHeading>

      {/* <QuestionBoxPara>
        We will personalize your learning experience accordingly
      </QuestionBoxPara> */}

      <QuestionInputIndustries
        showIndustriesList={showIndustriesList}
        setShowIndustriesList={setShowIndustriesList}
        setErrorMsg={setErrorMsg}
      />

      {errorMsg && <Error message={errorMsg} />}

      {errorMsg === '' && (
        <BtnContainer
          className={classNames(styles['btn-container'], styles['ok'])}
          showPressEnter={false}
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
