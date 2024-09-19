'use client';
import React from 'react';
import SignUpForm from './components/Form';
import Image from 'next/image';

const SignUpPage = () => {
  return (
    <div className='flex p-0 min-h-screen flex-col items-center justify-start  '>
      <div className='w-full flex justify-center h-[45vh] bg-gradient-to-b from-blue-600 to-blue-400'>
        <div className='flex flex-col items-center mt-5 mb-10'>
          <Image src={'/images/logo.jpg'} alt='nothing to say' width={100} height={100} className='rounded-full ' />
          <h1 className='md:text-lg text-[18px] lg:text-3xl text-center font-bold uppercase text-neutral-50 tracking-wide'>Dipolog City Institute of Technology</h1>
          <h1 className='md:text-2xl text-[18px] text-center font-bold uppercase text-green-400 tracking-wide'>Enrollment MANAGEMENT SYSTEM</h1>
        </div>
      </div>
      <div className='absolute top-56 pb-12'>
        <SignUpForm />
      </div>
    </div>
  );
};

export default SignUpPage;
