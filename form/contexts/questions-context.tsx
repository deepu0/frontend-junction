import { TOTAL_QUESTIONS } from '@/form/constants';
import { questionsInitialState } from '@/form/reducers/states/questionsInitialState';
import { questionsReducerFunc } from '@/form/reducers/reducer-func/questionsReducerFunc';
import { QuestionsContextType } from '@/form/types/contexts';
import { createContext, ReactNode, use, useMemo, useReducer } from 'react';

const QuestionsContext = createContext<QuestionsContextType>({
  state: questionsInitialState,
  dispatch: () => {},
  percent: 0,
});

type QuestionsProviderType = {
  readonly children: ReactNode;
};

export function QuestionsProvider({ children }: QuestionsProviderType) {
  const [state, dispatch] = useReducer(
    questionsReducerFunc,
    questionsInitialState
  );

  const percent = useMemo(
    function () {
      let answeredQues = 0;
      const {
        firstName,
        lastName,
        industry,
        role,
        description,
        goals,
        email,
        identity,
      } = state;

      if (firstName) answeredQues += 1;
      if (lastName) answeredQues += 1;
      if (industry) answeredQues += 1;
      if (role) answeredQues += 1;
      if (description) answeredQues += 1;

      if (goals.length !== 0) answeredQues += 1;
      if (email) answeredQues += 1;
      if (identity) answeredQues += 1;

      return (answeredQues * 100) / TOTAL_QUESTIONS;
    },
    [state]
  );

  const value = { state, dispatch, percent };

  return (
    <QuestionsContext.Provider value={value}>
      {children}
    </QuestionsContext.Provider>
  );
}

export function useQuestions(): QuestionsContextType {
  const context = use(QuestionsContext);

  if (context) {
    return context;
  }

  throw new Error('useQuestions must be use inside QuestionsProvider');
}
