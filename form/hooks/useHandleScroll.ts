import { useSharedStates } from '@/form/contexts/index';
import { useEffect, useRef } from 'react';

export function useHandleScroll() {
  const timerIdRef = useRef<NodeJS.Timeout>(null);
  const { setQuestionNum, handleOkClick, setErrorMsg } = useSharedStates();

  useEffect(() => {
    function handleScroll(event: WheelEvent) {
      clearTimeout(timerIdRef.current as any);

      timerIdRef.current = setTimeout(() => {
        if (event.deltaY > 0) {
          handleOkClick();
        } else if (event.deltaY <= -1) {
          setErrorMsg({});
          setQuestionNum((prevValue) =>
            prevValue.now - 1 < 0
              ? { ...prevValue }
              : { prev: prevValue.now, now: prevValue.now - 1 }
          );
        }
      }, 32);
    }

    document.addEventListener('wheel', handleScroll, { passive: true });

    return function () {
      document.removeEventListener('wheel', handleScroll);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
