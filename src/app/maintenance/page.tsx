'use client';
import { Icons } from '@/components/shared/Icons';
import Image from 'next/image';
import React from 'react';

// src/pages/maintenance.tsx
export default function MaintenancePage() {
  return (
    <div className='flex items-center justify-center h-screen bg-gray-100'>
      <div className='text-center'>
        <div className='flex items-center justify-center'>
          {/* <img src='/images/logo1.png' alt='Logo' className='h-32 w-32 rounded-full' /> */}
          <Image src={'https://nextjs-enrollment.vercel.app/images/logo1.png'} alt='nothing to say' width={100} height={100} priority className='rounded-full ' />
        </div>
        <h1 className=' text-xl xs:text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800 mb-4'>We&apos;re Under Maintenance</h1>
        <p className='sm:text-lg text-sm text-gray-600 mb-6'>Sorry for the inconvenience. Our site is currently undergoing scheduled maintenance.</p>
        <p className='text-gray-500 text-[16px]'>We appreciate your patience. Please check back later!</p>
        <div className='mt-6 flex items-center justify-center'>
          <Icons.construction className='text-orange-500 w-56 h-56' />
        </div>
      </div>
    </div>
  );
}
