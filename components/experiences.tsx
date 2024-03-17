'use client';
import CardComponent from './common/card';
import { useAuth } from './session-provider';
import { Suspense } from 'react';
import Filter from './common/filter';
import Loading from '@/app/loading';

interface IExperienceProps {
  interviewData: any;
}

const InterviewExperiences = ({ interviewData }: IExperienceProps) => {
  //const { user = '' } = useAuth();
  //console.log('i am the user', user);

  return (
    <Suspense fallback={<Loading />}>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-10'>
        {interviewData &&
          interviewData.map((interview: any) => {
            return <CardComponent {...interview} key={interview.id} />;
          })}
      </div>
    </Suspense>
  );
};

export default InterviewExperiences;
