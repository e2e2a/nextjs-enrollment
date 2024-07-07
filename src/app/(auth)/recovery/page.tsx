import React from 'react';
import RecoveryForm from './components/Form';

const RecoveryPage = () => {
  return (
    <div className='flex px-2 sm:p-0 min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <RecoveryForm />
    </div>
  );
};

export default RecoveryPage;
