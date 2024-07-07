import React, { Suspense } from 'react';
import ResetPasswordForm from './components/Form';

const page = () => {
  return (
    <div className='flex px-2 sm:p-0 min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <Suspense>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
};

export default page;
