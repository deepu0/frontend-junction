import React from 'react';
import { useTheme } from 'next-themes';

interface CardProps {
  title: string;
  imageSrc: string;
  description: string;
  tags: string[];
  status?: string;
  link?: string;
}

const CardComponent: React.FC<CardProps> = ({
  title,
  imageSrc,
  description,
  tags,
  status,
  link,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`max-w-md rounded-lg overflow-hidden shadow-md border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} ${theme === 'light' ? 'bg-white-500' : 'bg-gray-800'} text-${theme === 'light' ? 'gray-700' : 'white'} transition duration-500 ease-in-out transform hover:scale-105`}
    >
      <img
        className='w-full h-25 object-cover'
        src={imageSrc}
        alt='Company Logo'
      />
      {status && (
        <span
          className={`absolute top-0 right-0  ${status === 'rejected' ? 'bg-red-500' : 'bg-green-500'} text-white px-2 py-1 rounded-bl-lg font-semibold text-xs`}
        >
          {status}
        </span>
      )}
      <div className='px-6 py-4'>
        <div
          className={`font-bold text-xl mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}
        >
          {title}
        </div>
        <p
          className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-400'} text-base`}
        >
          {description}
        </p>
      </div>
      <div className='px-6 py-2'>
        {tags.map((tag, index) => (
          <span
            key={index}
            className={`inline-block bg-blue-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2 ${theme === 'light' ? 'text-white' : ''}`}
          >
            {tag}
          </span>
        ))}
      </div>
      <div className='px-6 py-4'>
        <a
          href={link || '#'}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full block text-center ${theme === 'light' ? 'hover:bg-blue-600' : 'hover:bg-blue-800'}`}
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default CardComponent;
