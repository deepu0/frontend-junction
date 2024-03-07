import React from 'react';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import Link from 'next/link';

interface CardProps {
  title: string;
  imageSrc?: string;
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
      className={`max-h-min max-w-md rounded-lg overflow-hidden shadow-md border ${theme === 'light' ? 'border-gray-200 bg-white' : 'border-gray-700 bg-gray-800'} text-${theme === 'light' ? 'gray-700' : 'white'} transition duration-500 ease-in-out transform hover:scale-105 flex flex-col justify-between`}
    >
      {imageSrc && (
        <Image
          className='w-full h-25 object-cover'
          src={imageSrc}
          width='100'
          height='25'
          alt='Company Logo'
        />
      )}

      {status && (
        <span
          className={`absolute top-0 right-0  ${status.toLowerCase() === 'rejected' ? 'bg-red-500' : 'bg-green-500'} text-white px-2 py-1 rounded-bl-lg font-semibold text-xs`}
        >
          {status}
        </span>
      )}
      <div className='px-6 py-4'>
        <div
          className={`font-bold text-xl mb-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'} mt-1`}
        >
          {title}
        </div>
        {description && (
          <p
            className={`${theme === 'light' ? 'text-gray-700' : 'text-gray-400'} text-base`}
          >
            {description}
          </p>
        )}
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
      {link && (
        <div className={`px-6 py-4   items-end`}>
          <Link href={link} passHref={true} legacyBehavior={true}>
            <a
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full block text-center ${theme === 'light' ? 'hover:bg-blue-600' : 'hover:bg-blue-800'}`}
            >
              Read More
            </a>
          </Link>
        </div>
      )}
    </div>
  );
};

export default CardComponent;
