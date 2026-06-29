import { useQuestions, useSharedStates } from '@/form/contexts/index';
import classNames from 'classnames';
import { BtnContainer } from '../btn-container/BtnContainer';
import { Error } from '../error/Error';
import { QuestionBoxPara } from '../question-box-para/QuestionBoxPara';
import { QuestionInputText } from '../question-input-text/QuestionInputText';
import { QuestionNumHeading } from '../question-num-heading/QuestionNumHeading';
import Image from 'next/image';
import styles from './Question.module.css';
import { ChangeEventHandler } from 'react';
import { SET_EMAIL } from '@/form/reducers/actions/questionsActions';

export function EmailInput() {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();

  const errorMsg = error.email ?? '';
  const { email } = state;

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    errorMsg &&
      setErrorMsg &&
      setErrorMsg((prevValue) => {
        delete prevValue.email;
        return prevValue;
      });

    dispatch({ type: SET_EMAIL, payload: event.target.value });
  };

  return (
    <>
      <QuestionNumHeading questionNum={7}>
        🔗 Please provide a link to your{' '}
        <b className='text-orange-500'>Linkedin</b> profile.? *
      </QuestionNumHeading>

      {/* <QuestionBoxPara>
        We will keep all our communications with you through this email. Do
        check your span inbox if you can&apos;t find our application received
        email.
      </QuestionBoxPara> */}

      <QuestionInputText
        type='email'
        placeholder='https://www.linkedin.com/in/username'
        value={email}
        onChange={handleInputChange}
      />

      {errorMsg && <Error message={errorMsg} />}

      {errorMsg === '' && (
        <BtnContainer
          className={classNames(styles['btn-container'], styles['ok'])}
          showPressEnter={true}
          onClick={handleOkClick}
        >
          Ok{' '}
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
