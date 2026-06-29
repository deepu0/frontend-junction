import { questrialFont } from '@/form/utils';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import styles from './QuestionInputText.module.css';
import classNames from 'classnames';
const TextEditor = dynamic(
  () => {
    return import('@/components/common/text-editor');
  },
  { ssr: false }
);
type QuestionInputTextProps = {
  readonly placeholder?: string;
  readonly className?: string;
  readonly value?: string;
  readonly onChange?: any;
  ref?: React.Ref<HTMLTextAreaElement>;
};

const InterviewInputText = ({
  placeholder,
  className,
  value,
  onChange,
  ref,
}: QuestionInputTextProps) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      textAreaRef.current?.focus();
    }, 500);
    return () => clearTimeout(id);
  }, []);

  return (
    <div>
      {' '}
      <TextEditor
        placeHolder={placeholder}
        onChange={onChange}
        value={value}
      />
    </div>
  );
};

InterviewInputText.displayName = 'InterviewInputText';

export { InterviewInputText };
