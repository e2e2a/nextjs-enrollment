import React from 'react';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

interface FormErrorProps {
  message?: string;
}

export const FormError = ({ message }: FormErrorProps) => {
  if (!message) return null;
  return (
    <div className='bg-red/15 p-3 rounded-md flex items-center gap-x-2 text-sm tracking-wide text-red/100 font-semibold'>
        <HiOutlineExclamationTriangle className='h-5 w-5 text-red' />
      {message}
    </div>
  );
};
