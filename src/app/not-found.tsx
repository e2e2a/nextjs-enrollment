// src/app/not-found.tsx

import React from 'react';
import Link from 'next/link';
import { auth } from '@/auth';
import SignInPage from './(auth)/(pages)/sign-in/page';

const NotFound = async () => {
  const session = await auth();
  return (
    <>
      {session ? (
        <div className='container mx-auto text-center p-4'>
          <h1 className='text-4xl font-bold mb-4'>404 - Page Not Found</h1>
          <p className='text-lg mb-4'>Sorry, the page you are looking for does not exist.</p>
          <Link href='/' className='text-blue-500 hover:underline'>
            Go back to the homepage
          </Link>
        </div>
      ) : (
        <SignInPage />
      )}
    </>
  );
};

export default NotFound;
