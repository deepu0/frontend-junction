import { useQuestions, useSharedStates } from '@/form/contexts';
import {
  isNotValidEmail,
  isTaskSpecificEmail,
  isValidLinkedInUrl,
} from '@/form/utils';
import useCustomSubmit from './useSubmit';
import { useEffect } from 'react';

export function useHandleKeypress() {
  const { questionNum, setErrorMsg, handleQuestionNumUpdate } =
    useSharedStates();

  const { now } = questionNum;
  const { onSubmit, isLoading, isFailure, isSuccess } = useCustomSubmit(now);
  const { state } = useQuestions();
  const {
    firstName,
    lastName,
    industry,
    role,
    goals,
    email,
    description,
    identity,
  } = state;

  useEffect(() => {
    function handleKeypress(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault();

        if (now + 1 === 2 && firstName === '') {
          setErrorMsg((prevValue) => ({
            ...prevValue,
            firstName: 'Please fill this in',
          }));
          return;
        } else if (now + 1 === 3 && lastName === '') {
          setErrorMsg((prevValue) => ({
            ...prevValue,
            lastName: 'Please fill this in',
          }));
          return;
        } else if (now + 1 === 4 && industry === '') {
          setErrorMsg((prevValue) => ({
            ...prevValue,
            industry: 'Oops! Please make a selection',
          }));
          return;
        } else if (now + 1 === 5 && role === '') {
          setErrorMsg((prevValue) => ({
            ...prevValue,
            role: 'Oops! Please make a selection',
          }));
          return;
        } else if (now + 1 === 6 && goals.length === 0) {
          setErrorMsg((prevValue) => ({
            ...prevValue,
            goals: 'Oops! Please make a selection',
          }));
          return;
        } else if (now + 1 === 6 && goals.length === 1) {
          setErrorMsg((prevValue) => ({
            ...prevValue,
            goals: 'Please select more choices',
          }));
          return;
        } else if (now + 1 === 7 && description === '') {
          setErrorMsg((prevValue) => ({
            ...prevValue,
            email: 'Please fill this in',
          }));
          return;
        } else if (now + 1 === 8 && email === '') {
          setErrorMsg((prevValue) => ({
            ...prevValue,
            email: 'Please fill this in',
          }));
          return;
        } else if (now + 1 === 8 && email && !isValidLinkedInUrl(email)) {
          setErrorMsg((prevValue) => ({
            ...prevValue,
            email: "Hmm... that link doesn't look right",
          }));
          return;
        } else if (now + 1 === 9 && identity === '') {
          setErrorMsg((prevValue) => ({
            ...prevValue,
            role: 'Oops! Please make a selection',
          }));
          return;
        }
        // } else if (
        //   now + 1 === 8 &&
        //   email &&
        //   !isNotValidEmail(email) &&
        //   isTaskSpecificEmail(email)
        // ) {
        //   setErrorMsg((prevValue) => ({
        //     ...prevValue,
        //     email: 'Hmm... task specific emails are not allowed',
        //   }));
        //   return;
        // }

        handleQuestionNumUpdate();
        if (now === 8) {
          onSubmit();
        }
      }
    }

    document.addEventListener('keypress', handleKeypress);

    return function () {
      document.removeEventListener('keypress', handleKeypress);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    firstName,
    industry,
    lastName,
    now,
    role,
    goals,
    email,
    description,
    identity,
  ]);

  return {
    isLoading,
    isFailure,
    isSuccess,
  };
}
