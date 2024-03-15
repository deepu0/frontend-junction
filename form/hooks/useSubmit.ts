import { FormEvent, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/session-provider';
import { useQuestions } from '../contexts';
import { RESET_STATE } from '@/form/reducers';

const useCustomSubmit = (now: number) => {
  const { user } = useAuth();
  const { state, dispatch } = useQuestions();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsError] = useState('');
  async function onSubmit() {
    try {
      setIsLoading(true);
      const experienceData = {
        title: `Frontend Interview Experience at ${state.firstName}`,
        original_link: '',
        role: state.industry,
        summary: '',
        status: state.role || 'ghosted',
        detail_experience: '',
        location: state.lastName || '',
        description: state.description || '',
        company_name: state?.firstName || '',
        linkedin_url: state?.email || '',
        tags: state.goals || [],
        is_original: true,
        user_id: user.id || '',
        visibility: state.identity === 'Reveal my identity' ? true : false,
        verification_status:
          user.role === 'superadmin' ? 'approved' : 'pending',
      };
      alert(JSON.stringify(experienceData));
      const { data, error: insertError } = await supabase
        .from('experiences')
        .insert({ ...experienceData });

      if (insertError) {
        throw new Error('Failed to submit form');
      }

      setIsSuccess(true);
      dispatch({ type: RESET_STATE, payload: '' });
    } catch (error: any) {
      toast({
        title: 'Oops! Something went wrong',
        description: '',
      });
      setIsError(error.message);
    } finally {
      setIsLoading(false);
    }
  }
  return { onSubmit, isLoading, isFailure, isSuccess };
};

export default useCustomSubmit;
