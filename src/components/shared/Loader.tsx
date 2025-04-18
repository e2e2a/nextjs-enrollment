
"use client"
import Image from 'next/image';

const Loader = () => {
  // <div className="fixed inset-0 flex justify-center top-16 items-center bg-white z-50 select-none">
  return (
    <div className='fixed inset-0 flex justify-center top-0 items-center bg-white z-50 select-none'>
      <div className='flex flex-col items-center'>
        <Image src='/icons/loader.svg' alt='loader' width={48} height={48} priority className='animate-spin' />
        <p className='mt-4 text-gray-700'>Loading...</p>
      </div>
    </div>
  );
};

export default Loader;
