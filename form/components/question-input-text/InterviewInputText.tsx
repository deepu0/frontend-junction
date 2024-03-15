import { questrialFont } from '@/form/utils';
import {
  ChangeEventHandler,
  ForwardedRef,
  forwardRef,
  useEffect,
  useRef,
} from 'react';
import TextEditor from '@/components/common/text-editor';
import styles from './QuestionInputText.module.css';
import classNames from 'classnames';

type QuestionInputTextProps = {
  readonly placeholder?: string;
  readonly className?: string;
  readonly value?: string;
  readonly onChange?: any; // Change to HTMLTextAreaElement
};

const InterviewInputText = forwardRef(
  (
    { placeholder, className, value, onChange }: QuestionInputTextProps,
    passedRef: ForwardedRef<HTMLTextAreaElement> // Change to HTMLTextAreaElement
  ) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null); // Change to HTMLTextAreaElement

    useEffect(() => {
      setTimeout(() => {
        textAreaRef.current?.focus();
      }, 500);
    }, []);

    return (
      //   <textarea // Change from input to textarea
      //     ref={passedRef ?? textAreaRef}
      //     className={classNames(
      //       styles['question-input__text'],
      //       questrialFont.className,
      //       className
      //     )}
      //     placeholder={placeholder ?? ''}
      //     value={value}
      //     onChange={onChange}
      //     rows={1}
      //     style={{
      //       height: textAreaRef.current
      //         ? textAreaRef.current.scrollHeight + 'px'
      //         : 'auto',
      //       maxHeight: '350px',
      //       overflowY: 'auto',
      //     }}
      //   />
      <div>
        {' '}
        <TextEditor
          placeHolder={placeholder}
          onChange={onChange}
          value={value}
        />
      </div>
    );
  }
);

InterviewInputText.displayName = 'InterviewInputText';

export { InterviewInputText };
