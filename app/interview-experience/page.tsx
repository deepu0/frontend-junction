import InterviewExperiences from '@/components/experiences';
import useGetExperiences from '@/hooks/useGetExperiences';

export default async function Interview() {
  const data = await useGetExperiences();

  return (
    <main className='flex min-h-screen flex-col items-center justify-between p-4 mt-10'>
      <InterviewExperiences interviewData={data} />
    </main>
  );
}
