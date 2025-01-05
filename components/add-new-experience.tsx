import React, { useState, ChangeEvent, FormEvent } from 'react';
import { CheckCircle, AlertCircle, Info, Linkedin } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { toast } from './ui/use-toast';
import { supabase } from '@/lib/supabase';
import { useAuth } from './session-provider';

interface FormData {
  linkedin: string;
  title: string;
  link: string;
  company: string;
  offerStatus: string;
  location: string;
  role: string;
  difficultyLevel: string;
}

interface Errors {
  [key: string]: string;
}

interface CharacterLimits {
  [key: string]: number;
}
const initialData = {
  linkedin: '',
  title: '',
  link: '',
  company: '',
  offerStatus: '',
  location: '',
  role: '',
  difficultyLevel: '',
};

const InterviewExperienceForm: React.FC = () => {
  const { user } = useAuth();
  const CHAR_LIMITS: CharacterLimits = {
    title: 100,
    link: 200,
    company: 50,
    location: 50,
    role: 50,
    linkedin: 100,
  };

  const [formData, setFormData] = useState<FormData>(initialData);

  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formSubmitAttempted, setFormSubmitAttempted] =
    useState<boolean>(false);

  const isValidLinkedinUrl = (url: string): boolean => {
    return (
      url.trim() === '' ||
      url.match(/^https:\/\/(www\.)?linkedin\.com\/in\/[\w-]+\/?$/) !== null
    );
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};

    // if (!formData.name.trim()) {
    //   newErrors.name = 'Name is required';
    // } else if (formData.name.length > CHAR_LIMITS.name) {
    //   newErrors.name = `Name cannot exceed ${CHAR_LIMITS.name} characters`;
    // }

    if (formData.linkedin && !isValidLinkedinUrl(formData.linkedin)) {
      newErrors.linkedin = 'Please enter a valid LinkedIn profile URL';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 10) {
      newErrors.title = 'Title should be at least 10 characters long';
    }

    if (!formData.link.trim()) {
      newErrors.link = 'Experience/blog link is required';
    } else if (!isValidUrl(formData.link)) {
      newErrors.link = 'Please enter a valid URL';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.offerStatus) {
      newErrors.offerStatus = 'Offer status is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitAttempted(true);

    if (validateForm()) {
      console.log('Form submitted:', formData);
      setIsLoading(true); // Set loading to true when the request starts

      try {
        const experienceData = {
          title: formData.title,
          company: formData.company,
          location: formData.location,
          tags: ['frontend', `${formData.company}`],
          description: '',
          offer_status: formData.offerStatus,
          added_by: user.id,
          job_role: formData.role,
          total_yoe: 3,
          blog_link: formData.link,
        };

        const { data, error: insertError } = await supabase
          .from('new_interview')
          .insert({ ...experienceData });
        if (insertError) {
          throw 'Something went wrong';
        }
        toast({
          title: '✨ Thanks for sharing!',
          description:
            'Your contribution will inspire others on their job search journey.',
        });
        setFormData(initialData);
      } catch (error) {
        // Handle error if necessary
        console.error(error);
        toast({
          title: 'Oops! Something went wrong',
          description: '',
        });
      } finally {
        setIsLoading(false); // Set loading to false when the request completes
      }
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    validateForm();
    if (value.length <= (CHAR_LIMITS[name] || Infinity)) {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSelectChange = (value: string, field: string): void => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className='min-h-screen bg-gray-900 p-4 sm:p-6 flex items-center justify-center mt-10 pt-10'>
      <Card className='w-full max-w-md bg-gray-800 text-white'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            Share Your Interview Experience
          </CardTitle>
          {formSubmitAttempted && Object.keys(errors).length > 0 && (
            <Alert className='mt-4 bg-red-900/50 border-red-600'>
              <AlertCircle className='h-4 w-4 text-red-400' />
              <AlertDescription className='text-red-400'>
                Please fix the following errors:
                <ul className='list-disc ml-4 mt-2'>
                  {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className='space-y-6'>
            {submitted && (
              <Alert className='bg-green-800 text-white border-green-600'>
                <CheckCircle className='h-4 w-4' />
                <AlertDescription>
                  Experience submitted successfully!
                </AlertDescription>
              </Alert>
            )}

            {/* Name Field */}
            {/* <div className='space-y-2'>
              <Label htmlFor='name'>Name</Label>
              <Input
                id='name'
                name='name'
                value={formData.name}
                onChange={handleChange}
                className={`bg-gray-700 border-gray-600 ${errors.name && formSubmitAttempted ? 'border-red-500' : ''}`}
                placeholder='Your name'
              />
              {errors.name && formSubmitAttempted && (
                <p className='text-red-400 text-sm'>{errors.name}</p>
              )}
            </div> */}

            {/* LinkedIn Profile Field */}

            {/* Title Field */}
            <div className='space-y-2'>
              <Label htmlFor='title'>Title</Label>
              <Input
                id='title'
                name='title'
                value={formData.title}
                onChange={handleChange}
                className={`bg-gray-700 border-gray-600 ${errors.title && formSubmitAttempted ? 'border-red-500' : ''}`}
                placeholder='Ex- UI 2 interview experience at Acko'
              />
              {errors.title && formSubmitAttempted && (
                <p className='text-red-400 text-sm'>{errors.title}</p>
              )}
            </div>
            <div className='space-y-2'>
              <div className='flex items-center gap-2'>
                <Label htmlFor='linkedin'>LinkedIn Profile</Label>
                <Linkedin className='h-4 w-4 text-blue-400' />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className='h-4 w-4 text-gray-400' />
                    </TooltipTrigger>
                    <TooltipContent className='bg-gray-700 text-white'>
                      Optional: Add your LinkedIn profile URL
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Input
                id='linkedin'
                name='linkedin'
                value={formData.linkedin}
                onChange={handleChange}
                className={`bg-gray-700 border-gray-600 ${errors.linkedin && formSubmitAttempted ? 'border-red-500' : ''}`}
                placeholder='https://linkedin.com/in/your-profile'
              />
              {errors.linkedin && formSubmitAttempted && (
                <p className='text-red-400 text-sm'>{errors.linkedin}</p>
              )}
            </div>

            {/* Link Field */}
            <div className='space-y-2'>
              <Label htmlFor='link'>Experience/Blog Link</Label>
              <Input
                id='link'
                name='link'
                value={formData.link}
                onChange={handleChange}
                className={`bg-gray-700 border-gray-600 ${errors.link && formSubmitAttempted ? 'border-red-500' : ''}`}
                placeholder='https://your-blog-post.com'
              />
              {errors.link && formSubmitAttempted && (
                <p className='text-red-400 text-sm'>{errors.link}</p>
              )}
            </div>

            {/* Company Field */}
            <div className='space-y-2'>
              <Label htmlFor='company'>Company</Label>
              <Input
                id='company'
                name='company'
                value={formData.company}
                onChange={handleChange}
                className={`bg-gray-700 border-gray-600 ${errors.company && formSubmitAttempted ? 'border-red-500' : ''}`}
                placeholder='Company name'
              />
              {errors.company && formSubmitAttempted && (
                <p className='text-red-400 text-sm'>{errors.company}</p>
              )}
            </div>

            {/* Offer Status Field */}
            <div className='space-y-2'>
              <Label htmlFor='offerStatus'>Offer Status</Label>
              <Select
                value={formData.offerStatus}
                onValueChange={(value) =>
                  handleSelectChange(value, 'offerStatus')
                }
              >
                <SelectTrigger
                  className={`bg-gray-700 border-gray-600 ${errors.offerStatus && formSubmitAttempted ? 'border-red-500' : ''}`}
                >
                  <SelectValue placeholder='Select offer status' />
                </SelectTrigger>
                <SelectContent className='bg-gray-700 border-gray-600'>
                  <SelectItem value='accepted'>Accepted</SelectItem>
                  <SelectItem value='rejected'>Rejected</SelectItem>
                  <SelectItem value='pending'>Pending</SelectItem>
                </SelectContent>
              </Select>
              {errors.offerStatus && formSubmitAttempted && (
                <p className='text-red-400 text-sm'>{errors.offerStatus}</p>
              )}
            </div>

            {/* Location Field */}
            <div className='space-y-2'>
              <Label htmlFor='location'>Location</Label>
              <Input
                id='location'
                name='location'
                value={formData.location}
                onChange={handleChange}
                className={`bg-gray-700 border-gray-600 ${errors.location && formSubmitAttempted ? 'border-red-500' : ''}`}
                placeholder='Interview location'
              />
              {errors.location && formSubmitAttempted && (
                <p className='text-red-400 text-sm'>{errors.location}</p>
              )}
            </div>

            {/* Role Field */}
            <div className='space-y-2'>
              <Label htmlFor='role'>Role</Label>
              <Input
                id='role'
                name='role'
                value={formData.role}
                onChange={handleChange}
                className={`bg-gray-700 border-gray-600 ${errors.role && formSubmitAttempted ? 'border-red-500' : ''}`}
                placeholder='Job role/position'
              />
              {errors.role && formSubmitAttempted && (
                <p className='text-red-400 text-sm'>{errors.role}</p>
              )}
            </div>

            {/* Difficulty Level Field */}
            <div className='space-y-2'>
              <Label htmlFor='difficultyLevel'>
                Difficulty Level (Optional)
              </Label>
              <Select
                value={formData.difficultyLevel}
                onValueChange={(value) =>
                  handleSelectChange(value, 'difficultyLevel')
                }
              >
                <SelectTrigger className='bg-gray-700 border-gray-600'>
                  <SelectValue placeholder='Select difficulty level' />
                </SelectTrigger>
                <SelectContent className='bg-gray-700 border-gray-600'>
                  <SelectItem value='easy'>Easy</SelectItem>
                  <SelectItem value='medium'>Medium</SelectItem>
                  <SelectItem value='hard'>Hard</SelectItem>
                  <SelectItem value='very-hard'>Very Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              type='submit'
              disabled={isLoading}
              className='w-full bg-blue-600 hover:bg-blue-700'
            >
              Submit Experience
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InterviewExperienceForm;
