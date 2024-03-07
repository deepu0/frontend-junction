'use client';
import CardComponent from './common/card';
import { useAuth } from './session-provider';

import Filter from './common/filter';
interface IExperienceProps {
  interviewData: any;
}

const InterviewExperiences = ({ interviewData }: IExperienceProps) => {
  //const { user = '' } = useAuth();
  //console.log('i am the user', user);

  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10'>
        {interviewData &&
          interviewData.map((interview: any) => {
            return <CardComponent {...interview} key={interview.id} />;
          })}
      </div>
    </>
  );
};

export default InterviewExperiences;
