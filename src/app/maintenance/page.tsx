'use client';
import { Icons } from '@/components/shared/Icons';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

interface MaintenancePageProps {
  children?: React.ReactNode; // Make children optional to avoid errors when not provided
}

export default function MaintenancePage({ children }: MaintenancePageProps) {
  const isMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE !== '1';
  const router = useRouter();

  useEffect(() => {
    const originalWarn = console.warn;
    console.warn = (...args) => {
      if (typeof args[0] === 'string' && args[0].includes('was preloaded using link preload but not used')) {
        return;
      }
      originalWarn(...args);
    };
    if (!isMaintenanceMode) {
      router.push('/sign-in');
    }
  }, []);

  // Render maintenance page if in maintenance mode
  if (isMaintenanceMode) {
    return (
      <div className='flex items-center justify-center h-screen bg-gray-100'>
        <div className='text-center'>
          <div className='flex items-center justify-center'>
            <Image
              src={'https://firebasestorage.googleapis.com/v0/b/my-project-eaeb4.appspot.com/o/logo%2Flogo1.png?alt=media&token=8ebc5ba9-67b3-47fa-ae2c-7cb1e7d9c76f'}
              alt='nothing to say'
              width={100}
              height={100}
              priority
              className='rounded-full w-auto'
            />
          </div>
          <h1 className='text-xl xs:text-2xl sm:text-3xl md:text-5xl font-bold text-gray-800 mb-4'>We&apos;re Under Maintenance</h1>
          <p className='sm:text-lg text-sm text-gray-600 mb-6'>Sorry for the inconvenience. Our site is currently undergoing scheduled maintenance.</p>
          <p className='text-gray-500 text-[16px]'>We appreciate your patience. Please check back later!</p>
          <div className='mt-6 flex items-center justify-center'>
            <Icons.construction className='text-orange-500 w-56 h-56' />
          </div>
        </div>
      </div>
    );
  }

  // Render children when not in maintenance mode (but only after redirection logic is resolved)
  return <>{children}</>;
}
