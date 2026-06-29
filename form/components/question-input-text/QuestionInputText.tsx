import { questrialFont } from '@/form/utils';
import { ChangeEventHandler, useEffect, useRef } from 'react';
import styles from './QuestionInputText.module.css';
import classNames from 'classnames';

type QuestionInputTextProps = {
  readonly placeholder?: string;
  readonly className?: string;
  readonly value?: string;
  readonly onChange?: ChangeEventHandler<HTMLInputElement>;
  readonly type?: string;
  ref?: React.Ref<HTMLInputElement>;
};

const QuestionInputText = ({
  placeholder,
  className,
  value,
  onChange,
  type,
  ref,
}: QuestionInputTextProps) => {
  const inputTextRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      inputTextRef.current?.focus();
    }, 500);
    return () => clearTimeout(id);
  }, []);

  return (
    <input
      ref={ref ?? inputTextRef}
      aria-label={placeholder || 'Text input'}
      className={classNames(
        styles['question-input__text'],
        questrialFont.className,
        className
      )}
      type={type ?? 'text'}
      placeholder={placeholder ?? ''}
      value={value}
      onChange={onChange}
    />
  );
};

QuestionInputText.displayName = 'QuestionInputText';

export { QuestionInputText };
