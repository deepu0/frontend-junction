import {
  QuestionsActionsType,
  REMOVE_GOAL,
  SET_FIRST_NAME,
  SET_LAST_NAME,
  SET_INDUSTRY,
  SET_ROLE,
  SET_GOALS,
  SET_EMAIL,
  SET_DESCRIPTION,
  SET_IDENTITY,
  RESET_STATE,
  SET_INTERVIEW_DATE,
} from '../actions/questionsActions';
import { QuestionsStateType } from '../states/questionsInitialState';
import { questionsInitialState } from '../states/questionsInitialState';

export function questionsReducerFunc(
  state: QuestionsStateType,
  action: QuestionsActionsType
) {
  switch (action.type) {
    case SET_FIRST_NAME:
      return { ...state, firstName: action.payload };
    case SET_DESCRIPTION:
      return { ...state, description: action.payload };

    case SET_LAST_NAME:
      return { ...state, lastName: action.payload };

    case SET_INDUSTRY:
      return { ...state, industry: action.payload };

    case SET_ROLE:
      return { ...state, role: action.payload };

    case SET_GOALS:
      return { ...state, goals: [...state.goals, action.payload] };

    case REMOVE_GOAL:
      return {
        ...state,
        goals: state.goals.filter((goal) => goal !== action.payload),
      };

    case SET_EMAIL:
      return { ...state, email: action.payload };
    case SET_IDENTITY:
      return { ...state, identity: action.payload };
    case RESET_STATE:
      return questionsInitialState;
    case SET_INTERVIEW_DATE:
      return { ...state, interviewDate: action.payload };

    default:
      return state;
  }
}
