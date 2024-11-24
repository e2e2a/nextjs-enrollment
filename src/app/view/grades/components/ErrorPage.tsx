import Link from 'next/link';
import React from 'react';

const ErrorPage = () => {
  return (
    <div className='container mx-auto text-center p-4'>
      <h1 className='text-4xl font-bold mb-4'>404 - Page Not Found</h1>
      <p className='text-lg mb-4'>Sorry, the page you are looking for does not exist.</p>
      <Link href='/' className='text-blue-500 hover:underline'>
        Go back to the homepage
      </Link>
    </div>
  );
};

export default ErrorPage;
