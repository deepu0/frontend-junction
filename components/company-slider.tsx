import React from 'react';
import { useTheme } from 'next-themes';

interface CompanySliderProps {
  companies: { logo: string; name: string }[];
}

const CompanySlider: React.FC<CompanySliderProps> = ({ companies }) => {
  const { theme } = useTheme();

  return (
    <div className={`relative overflow-hidden `}>
      <div className='flex animation-container'>
        {[...companies, ...companies.slice(0, 4)].map((company, index) => (
          <div key={index} className='px-4'>
            <div className='animate-slidein'>
              <img
                src={company.logo}
                alt={company.name}
                className='mx-auto'
                style={{ maxWidth: '100%', maxHeight: '100px' }}
              />
              <p
                className={`text-center mt-2 ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
              >
                {company.name}
              </p>
            </div>
          </div>
        ))}
      </div>
      <style jsx>{`
        @keyframes slidein {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(0);
          }
        }

        .animate-slidein {
          animation: slidein 10s linear infinite;
        }

        .animation-container {
          display: flex;
        }
      `}</style>
    </div>
  );
};

export default CompanySlider;
