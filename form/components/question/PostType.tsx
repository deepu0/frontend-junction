import { BtnContainer } from '../btn-container/BtnContainer';
import { DropdownSelect } from '../dropdown-select/DropdownSelect';
import { DropdownSelectOption } from '../dropdown-select-option/DropdownSelectOption';
import { Error } from '../error/Error';
import { QuestionBoxPara } from '../question-box-para/QuestionBoxPara';
import { QuestionNumHeading } from '../question-num-heading/QuestionNumHeading';
import classNames from 'classnames';
import styles from './Question.module.css';
import Image from 'next/image';
import { useQuestions, useSharedStates } from '@/form/contexts/index';
import { IDENTITY } from '@/form/constants';
import { SET_ROLE, SET_IDENTITY } from '@/form/reducers/actions/questionsActions';

export function IdentityInput() {
  const { errorMsg: error, setErrorMsg, handleOkClick } = useSharedStates();
  const { state, dispatch } = useQuestions();

  const errorMsg = error.role ?? '';
  const { identity } = state;

  function handleDropdownOptionClick(_role: string) {
    setErrorMsg &&
      setErrorMsg((prevValue) => {
        delete prevValue.role;
        return prevValue;
      });

    if (_role === identity) {
      dispatch({ type: SET_IDENTITY, payload: '' });
    } else {
      dispatch({ type: SET_IDENTITY, payload: _role });
      setTimeout(() => handleOkClick(), 600);
    }
  }

  return (
    <>
      <QuestionNumHeading questionNum={8}>
        🎭 Would you like to <b className='text-orange-500'>reveal</b> your
        identity or remain anonymous in the posts?*
      </QuestionNumHeading>

      {/* <QuestionBoxPara>
          We want to understand how you spend your time right now.
        </QuestionBoxPara> */}

      <DropdownSelect className={styles['role-dropdown']}>
        <div>
          {Object.keys(IDENTITY).map((roleKey) => {
            const _role = IDENTITY[roleKey];

            return (
              <DropdownSelectOption
                key={roleKey}
                className={styles['role-option']}
                onClick={() => handleDropdownOptionClick(_role)}
                isSelected={_role === identity}
              >
                <span
                  className={classNames({
                    [styles['selected']]: _role === identity,
                  })}
                >
                  {roleKey}
                </span>
                {_role}
              </DropdownSelectOption>
            );
          })}
        </div>
      </DropdownSelect>

      {errorMsg && <Error message={errorMsg} />}

      {identity && errorMsg === '' && (
        <BtnContainer
          className={classNames(styles['btn-container'], styles['ok'])}
          showPressEnter={false}
          onClick={handleOkClick}
        >
          Submit{' '}
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
