import React from 'react';
import { FaRegCheckCircle } from 'react-icons/fa';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

interface FormMessageDisplayProps {
  message?: string;
  typeMessage?: string;
}

export const FormMessageDisplay = ({ message, typeMessage }: FormMessageDisplayProps) => {
  if (!message) return null;
  return (
    <>
      {typeMessage === 'error' ? (
        <div className='bg-red/15 p-3 rounded-md flex items-center gap-x-2 text-sm tracking-wide text-red/100 font-semibold'>
          <HiOutlineExclamationTriangle className='h-5 w-5 text-red' />
          {message}
        </div>
      ) : (
        <div className='bg-emerald-500/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-emerald-500'>
          <FaRegCheckCircle className='h-5 w-5' />
          {message}
        </div>
      )}
    </>
  );
};
