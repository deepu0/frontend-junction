import { forwardRef, useEffect, useRef, ChangeEventHandler } from 'react';

interface DateSelectorProps {
  className?: string;
  value?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  placeholder?: string;
}

const DateSelector = forwardRef<HTMLInputElement, DateSelectorProps>(
  function DateSelector({ className, value, onChange, placeholder }, ref) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 500);
    }, []);
    const fiveYearsAgo = new Date();
    fiveYearsAgo.setFullYear(fiveYearsAgo.getFullYear() - 5);

    return (
      <input
        ref={ref ?? inputRef}
        type='date'
        className={`appearance-none bg-transparent border-none border-b border-gray-300 text-white-700 py-2 px-4 leading-tight focus:outline-none focus:border-b-2 focus:border-blue-500 placeholder-gray-400 ${className}`}
        value={value}
        onChange={onChange}
        max={new Date().toISOString().split('T')[0]}
        min={fiveYearsAgo.toISOString().split('T')[0]}
        placeholder={placeholder ?? 'Select date'}
      />
    );
  }
);

DateSelector.displayName = 'DateSelector';

export default DateSelector;
