export const questionsInitialState = {
  firstName: '',
  lastName: '',
  industry: '',
  role: '',
  goals: [],
  description: '',
  email: '',
  identity: '',
  interviewDate: '',
};

export type QuestionsStateType = {
  firstName: string;
  lastName: string;
  industry: string;
  role: string;
  goals: string[];
  description: string;
  email: string;
  identity: string;
  interviewDate: string;
  QuestionsStateType?: string;
};
