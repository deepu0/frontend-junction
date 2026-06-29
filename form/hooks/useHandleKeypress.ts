import { useQuestions, useSharedStates } from '@/form/contexts/index';
import {
  isNotValidEmail,
  isTaskSpecificEmail,
  isNotValidLinkedInUrl,
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
    interviewDate,
  } = state;

  const validationRules: ValidationRule[] = [
    {
      questionType: 'firstName',
      errorMessage:
        state.firstName === ''
          ? 'Please fill this in'
          : state.firstName.length < 3
            ? 'Company name must be at least 3 characters long'
            : state.firstName.length > 50
              ? 'Company name cannot exceed 20 characters'
              : '',
      checkCondition: () =>
        state.firstName === '' ||
        state.firstName.length < 3 ||
        state.firstName.length > 20,
    },
    {
      questionType: 'lastName',
      errorMessage:
        state.lastName === ''
          ? 'Please fill this in'
          : state.lastName.length < 3
            ? 'Location must be at least 3 characters long'
            : state.lastName.length > 30
              ? 'Location cannot exceed 50 characters'
              : '',
      checkCondition: () =>
        state.lastName === '' ||
        state.lastName.length < 3 ||
        state.lastName.length > 30,
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
      errorMessage:
        state.description === ''
          ? 'Please fill this in'
          : state.description.length < 500
            ? 'Oops! Your interview experience seems too short. Share more details! 📝🔍'
            : state.description.length > 8000
              ? 'Your interview experience is too long! Keep it concise and focused. 🚫📄'
              : '',
      checkCondition: () =>
        state.description === '' ||
        state.description.length < 500 ||
        state.description.length > 8000,
    },
    {
      questionType: 'email',
      errorMessage: 'Please fill this in',
      checkCondition: () => state.email === '',
    },
    {
      questionType: 'email',
      errorMessage: "Hmm... that link doesn't look right",
      checkCondition: () => isNotValidLinkedInUrl(state.email),
    },
    {
      questionType: 'identity',
      errorMessage: 'Oops! Please make a selection',
      checkCondition: () => state.identity === '',
    },
    {
      questionType: 'interviewDate',
      errorMessage: 'Oops! Please select a valid date',
      checkCondition: () => state.interviewDate === '',
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
    email,
    description,
    identity,
    interviewDate,
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
      return 'interviewDate';
    case 8:
      return 'identity';

    default:
      return '';
  }
}
