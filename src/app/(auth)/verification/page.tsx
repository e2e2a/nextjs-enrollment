import React, { Suspense, useCallback, useEffect, useState } from 'react';
import VerificationForm from './components/Form';

const Verification = () => {

  return (
    <div className='flex px-2 sm:p-0 min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <Suspense fallback={<div>Loading...</div>}>
        <VerificationForm />
      </Suspense>
    </div>
  );
};

export default Verification;
