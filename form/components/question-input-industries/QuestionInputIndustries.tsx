import { DropdownSelect } from '../dropdown-select/DropdownSelect';
import { DropdownSelectOption } from '../dropdown-select-option/DropdownSelectOption';
import { QuestionInputText } from '../question-input-text/QuestionInputText';
import styles from './QuestionInputIndustries.module.css';
import classNames from 'classnames';
import Image from 'next/image';
import { useIndustries } from '@/form/hooks/useIndustries';
import {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { SET_INDUSTRY } from '@/form/reducers/actions/questionsActions';
import { useQuestions, useSharedStates } from '@/form/contexts/index';
import { IndustriesProps } from '@/form/types/question';
import { ObjectType } from '@/form/types/misc';

type QuestionInputIndustriesProps = IndustriesProps & {
  readonly setErrorMsg: Dispatch<SetStateAction<ObjectType>> | undefined;
};

// react-doctor-disable-next-line react-doctor/no-giant-component
export function QuestionInputIndustries({
  showIndustriesList,
  setShowIndustriesList,
  setErrorMsg,
}: QuestionInputIndustriesProps) {
  const { industries } = useIndustries();
  const { state, dispatch } = useQuestions();
  const { handleOkClick } = useSharedStates();

  const { industry } = state;
  const inputTextRef = useRef<HTMLInputElement>(null);
  const [localIndustry, setLocalIndustry] = useState(industry);
  const [optionClicked, setOptionClicked] = useState(false);

  const filterIndustries = useMemo(() => {
    if (optionClicked) return [];
    return industries.filter((_industry) =>
      _industry.toLowerCase().includes(localIndustry.toLowerCase())
    );
  }, [industries, localIndustry, optionClicked]);

  useEffect(() => {
    const id = setTimeout(() => {
      inputTextRef.current?.focus();
    }, 500);
    return () => clearTimeout(id);
  }, []);

  // react-doctor-disable-next-line react-doctor/no-pass-data-to-parent, react-doctor/no-prop-callback-in-effect
  useEffect(() => {
    if (
      localIndustry &&
      filterIndustries.length === 0 &&
      !industries.includes(localIndustry)
    ) {
      // setErrorMsg &&
      //   setErrorMsg((prevValue) => ({
      //     ...prevValue,
      //     industry: 'No suggestions found',
      //   }));
    } else {
      setErrorMsg &&
        setErrorMsg((prevValue) => {
          delete prevValue.industry;
          return prevValue;
        });
    }
  }, [filterIndustries.length, industries, localIndustry, setErrorMsg]);

  function handleDropdownClick(event: MouseEvent) {
    event.stopPropagation();
    setShowIndustriesList(true);
  }

  function handleInputChange(event: ChangeEvent) {
    const typedValue = (event.target as HTMLInputElement).value;
    dispatch({ type: SET_INDUSTRY, payload: typedValue });

    if (typedValue) {
      setShowIndustriesList(true);
    } else {
      setShowIndustriesList(false);
    }

    setLocalIndustry(typedValue);
  }

  function handleUpArrowClick(event: MouseEvent) {
    if (showIndustriesList) {
      event.stopPropagation();
      setShowIndustriesList(false);
    }
  }

  function handleCrossBtnClick(event: MouseEvent) {
    event.stopPropagation();
    setLocalIndustry('');
    setShowIndustriesList(false);
    dispatch({ type: SET_INDUSTRY, payload: '' });
    inputTextRef.current?.focus();
  }

  return (
    // react-doctor-disable-next-line react-doctor/prefer-tag-over-role
    <div
      className={styles['dropdown-select__industries']}
      role="group"
      onClick={handleDropdownClick}
      onKeyDown={(e) => { if (e.key === 'Enter') handleDropdownClick(e as unknown as MouseEvent); }}
    >
      <QuestionInputText
        className={styles['dropdown-select__input']}
        placeholder='Type or select an option'
        value={localIndustry}
        onChange={handleInputChange}
        ref={inputTextRef}
      />

      <button
        type="button"
        className={classNames(styles['dropdown-select__btn'], {
          [styles['close']]: !showIndustriesList && !localIndustry,
        })}
        onClick={localIndustry ? handleCrossBtnClick : handleUpArrowClick}
      >
        <Image
          src={localIndustry ? '/close.svg' : '/navigate-next.svg'}
          alt='dropdown arrow'
          width={26}
          height={26}
        />
      </button>

      <DropdownSelect
        className={classNames(styles['dropdown-select__options'], {
          [styles['show']]: showIndustriesList && filterIndustries.length,
        })}
      >
        {filterIndustries.map((_industry) => (
          <DropdownSelectOption
            key={_industry}
            onClick={() => setLocalIndustry(_industry)}
            isSelected={localIndustry === _industry && optionClicked}
          >
            {_industry}
          </DropdownSelectOption>
        ))}
      </DropdownSelect>
    </div>
  );
}
