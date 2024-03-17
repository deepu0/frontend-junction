import { useSharedStates } from '@/form/contexts';
import { BtnContainer, QuestionBoxHeading, QuestionBoxPara } from '../index';

export function Intro() {
  const { handleOkClick } = useSharedStates();

  return (
    <>
      <QuestionBoxHeading>
        Share Your Interview Journey with{' '}
        <b className='text-orange-500'>Frontend Junction!</b> 💡
      </QuestionBoxHeading>
      <QuestionBoxPara>
        <br />
        <br />
        We're excited to hear all about it!
        <br /> Take your time and provide as much detail as you'd like. 💬
      </QuestionBoxPara>
      <BtnContainer showPressEnter={true} onClick={handleOkClick}>
        Start
      </BtnContainer>
    </>
  );
}
