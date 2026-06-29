'use client';
import React, { createContext, use, useState, useMemo } from 'react';

// Define the shape of the loading context
interface LoadingContextType {
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
}

// Create the loading context
const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoading: () => {},
});

// Custom hook to access the loading context
export const useLoading = (): LoadingContextType => use(LoadingContext);

// Provider component to wrap your application
export const LoadingProvider = ({ children }: any) => {
  const [loading, setLoading] = useState<boolean>(false);
  const value = useMemo(() => ({ loading, setLoading }), [loading]);

  return (
    <LoadingContext.Provider value={value}>
      {loading && (
        <div className='relative'>
          <div className='fixed top-0 left-0 w-full h-full bg-black opacity-90 z-50 flex justify-center items-center'>
            <div className='loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-20 w-20'></div>
          </div>
        </div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};
