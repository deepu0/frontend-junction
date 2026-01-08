'use client';
import { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './session-provider';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

const initialData = {
  company: '',
  role: '',
  outcome: '', // Selected/Rejected/Ghosted
  title: '',
  description: '',
  difficulty: '', // Moderate/Simple/Hard
  blogLink: '',
};

const AddExperiencePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    outcome: '', // Selected/Rejected/Ghosted
    title: '',
    description: '',
    difficulty: '', // Moderate/Simple/Hard
    blogLink: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  //     e.preventDefault();
  //     // Save the interview experience data to your database
  //     console.log(formData);
  //     // Redirect to the home page or any other page after submitting
  //     //router.push('/');
  //   };

  //   if (!user) {
  //     // Redirect to the login page if the user is not authenticated
  //     //router.push('/');
  //     return null;
  //   }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (!user) {
        toast({
          title: 'Not Authenticated',
          description: 'Please sign in to share your experience.',
          variant: 'destructive',
        });
        return;
      }

      const response = await fetch('/api/experiences', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          companyName: formData.company,
          role: formData.role,
          outcome: formData.outcome,
          experience: formData.description,
          difficulty: formData.difficulty,
          original_link: formData.blogLink,
          tags: [], // Can add tag input later
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit');
      }

      toast({
        title: '✨ Thanks for sharing!',
        description:
          'Your contribution will inspire others on their job search journey.',
      });
      setFormData(initialData);
    } catch (error: any) {
      console.error(error);
      toast({
        title: 'Oops! Something went wrong',
        description: error.message || 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <div className='container mx-auto mt-20 mb-10'>
        <h1 className='text-3xl font-semibold mb-6'>
          Add Interview Experience 🎉
        </h1>
        <form onSubmit={onSubmit} className='max-w-lg mx-auto'>
          <div className='space-y-4'>
            <div>
              <label htmlFor='company' className='block font-semibold mb-1'>
                Company 🏢
              </label>
              <input
                type='text'
                id='company'
                name='company'
                value={formData.company}
                onChange={handleChange}
                required
                className='block w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500'
              />
            </div>
            <div>
              <label htmlFor='role' className='block font-semibold mb-1'>
                Role 👨‍💻
              </label>
              <input
                type='text'
                id='role'
                name='role'
                value={formData.role}
                onChange={handleChange}
                required
                className='block w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500'
              />
            </div>
            <div>
              <label htmlFor='outcome' className='block font-semibold mb-1'>
                Outcome 🎯
              </label>
              <select
                id='outcome'
                name='outcome'
                value={formData.outcome}
                onChange={handleChange}
                required
                className='block w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500'
              >
                <option value=''>Select</option>
                <option value='selected'>Selected</option>
                <option value='rejected'>Rejected</option>
                <option value='ghosted'>Ghosted</option>
              </select>
            </div>
            <div>
              <label htmlFor='title' className='block font-semibold mb-1'>
                Title 📝
              </label>
              <input
                type='text'
                id='title'
                name='title'
                value={formData.title}
                onChange={handleChange}
                required
                className='block w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500'
              />
            </div>
            <div>
              <label htmlFor='description' className='block font-semibold mb-1'>
                Description 📄
              </label>
              <textarea
                id='description'
                name='description'
                value={formData.description}
                onChange={handleChange}
                required
                className='block w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500'
              />
            </div>
            <div>
              <label htmlFor='blogLink' className='block font-semibold mb-1'>
                Blog Link 🔗
              </label>
              <input
                type='url'
                id='blogLink'
                name='blogLink'
                value={formData.blogLink}
                onChange={handleChange}
                required
                className='block w-full border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:border-blue-500'
              />
            </div>
          </div>
          <button
            type='submit'
            disabled={isLoading}
            className='mt-6 bg-blue-500 text-white py-2 px-4 rounded-md'
          >
            Submit 🚀
          </button>
        </form>
      </div>
    </>
  );
};

export default AddExperiencePage;
