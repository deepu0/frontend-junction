import { useQuestions, useSharedStates } from '@/form/contexts';
import {
  isNotValidEmail,
  isTaskSpecificEmail,
  isValidLinkedInUrl,
} from '@/form/utils';
import useCustomSubmit from './useSubmit';
import { useEffect } from 'react';
interface ValidationRule {
  questionType: string;
  errorMessage: string;
  checkCondition: () => boolean;
}
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

  const validationRules: ValidationRule[] = [
    {
      questionType: 'firstName',
      errorMessage: 'Please fill this in',
      checkCondition: () => state.firstName === '',
    },
    {
      questionType: 'lastName',
      errorMessage: 'Please fill this in',
      checkCondition: () => state.lastName === '',
    },
    {
      questionType: 'industry',
      errorMessage: 'Oops! Please make a selection',
      checkCondition: () => state.industry === '',
    },
    {
      questionType: 'role',
      errorMessage: 'Oops! Please make a selection',
      checkCondition: () => state.role === '',
    },
    {
      questionType: 'goal',
      errorMessage: 'Oops! Please make a selection',
      checkCondition: () => state.goals.length === 0,
    },
    {
      questionType: 'goal',
      errorMessage: 'Please select more choices',
      checkCondition: () => state.goals.length === 1,
    },
    {
      questionType: 'description',
      errorMessage: 'Please fill this in',
      checkCondition: () => state.description === '',
    },
    {
      questionType: 'email',
      errorMessage: 'Please fill this in',
      checkCondition: () => state.email === '',
    },
    {
      questionType: 'email',
      errorMessage: "Hmm... that link doesn't look right",
      checkCondition: () => !isValidLinkedInUrl(state.email),
    },
    {
      questionType: 'identity',
      errorMessage: 'Oops! Please make a selection',
      checkCondition: () => state.identity === '',
    },
  ];

  useEffect(() => {
    function handleKeypress(event: KeyboardEvent) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const currentQuestionType = getCurrentQuestionType(now);
        const rule = validationRules.find(
          (rule) => rule.questionType === currentQuestionType
        );

        if (rule && rule.checkCondition()) {
          setErrorMsg((prevValue) => ({
            ...prevValue,
            [currentQuestionType]: rule.errorMessage,
          }));
          return;
        }
        // if (now + 1 === 2 && firstName === '') {
        //   setErrorMsg((prevValue) => ({
        //     ...prevValue,
        //     firstName: 'Please fill this in',
        //   }));
        //   return;
        // } else if (now + 1 === 3 && lastName === '') {
        //   setErrorMsg((prevValue) => ({
        //     ...prevValue,
        //     lastName: 'Please fill this in',
        //   }));
        //   return;
        // } else if (now + 1 === 4 && industry === '') {
        //   setErrorMsg((prevValue) => ({
        //     ...prevValue,
        //     industry: 'Oops! Please make a selection',
        //   }));
        //   return;
        // } else if (now + 1 === 5 && role === '') {
        //   setErrorMsg((prevValue) => ({
        //     ...prevValue,
        //     role: 'Oops! Please make a selection',
        //   }));
        //   return;
        // } else if (now + 1 === 6 && goals.length === 0) {
        //   setErrorMsg((prevValue) => ({
        //     ...prevValue,
        //     goals: 'Oops! Please make a selection',
        //   }));
        //   return;
        // } else if (now + 1 === 6 && goals.length === 1) {
        //   setErrorMsg((prevValue) => ({
        //     ...prevValue,
        //     goals: 'Please select more choices',
        //   }));
        //   return;
        // } else if (now + 1 === 7 && description === '') {
        //   setErrorMsg((prevValue) => ({
        //     ...prevValue,
        //     email: 'Please fill this in',
        //   }));
        //   return;
        // } else if (now + 1 === 8 && email === '') {
        //   setErrorMsg((prevValue) => ({
        //     ...prevValue,
        //     email: 'Please fill this in',
        //   }));
        //   return;
        // } else if (now + 1 === 8 && email && !isValidLinkedInUrl(email)) {
        //   setErrorMsg((prevValue) => ({
        //     ...prevValue,
        //     email: "Hmm... that link doesn't look right",
        //   }));
        //   return;
        // } else if (now + 1 === 9 && identity === '') {
        //   setErrorMsg((prevValue) => ({
        //     ...prevValue,
        //     role: 'Oops! Please make a selection',
        //   }));
        //   return;
        // }

        handleQuestionNumUpdate();
        if (now === 7) {
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

function getCurrentQuestionType(now: number): string {
  switch (now) {
    case 1:
      return 'firstName';
    case 2:
      return 'lastName';
    case 3:
      return 'industry';
    case 4:
      return 'role';
    // case 5:
    //   return 'goal';
    case 5:
      return 'description';
    case 6:
      return 'email';
    case 7:
      return 'identity';
    default:
      return '';
  }
}
