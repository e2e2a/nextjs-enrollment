'use client';
import React, { createContext, useContext, useState } from 'react';
import Image from 'next/image';
const LoadingContext = createContext({
  loading: false,
  setLoading: (value: boolean) => {},
});

export const useLoading = () => useContext(LoadingContext);

export const LoadingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {loading && <LoadingOverlay />}
      {children}
    </LoadingContext.Provider>
  );
};

const LoadingOverlay = () => (
  <div className='fixed inset-0 flex justify-center top-0 items-center bg-white z-50 select-none'>
    <div className='flex flex-col items-center'>
      <Image src='/icons/loader.svg' alt='loader' width={48} height={48} priority className='animate-spin' />
      <p className='mt-4 text-gray-700'>Logging out...</p>
    </div>
  </div>
);
