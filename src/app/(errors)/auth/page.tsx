import AuthErrorCard from '@/components/shared/auth/AuthErrorCard';
import React from 'react';

const AuthErrorPage = () => {
  return (
    <div className='flex px-2 sm:p-0 min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-sky-400 to-blue-800'>
      <AuthErrorCard />
    </div>
  );
};

export default AuthErrorPage;
