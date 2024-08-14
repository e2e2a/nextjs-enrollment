import { Icons } from '@/components/shared/Icons';
import Image from 'next/image';
import React from 'react';
import toast from 'react-hot-toast';
type IProps = {
  title: any;
  imageUrl: string;
};
const CourseToast = (title: string, imagePreview: string) => {
  return toast.custom(
    <div className='bg-white w-[308px]  sm:w-[338px] px-5 pb-5 rounded-lg border border-gray-200 shadow-sm drop-shadow-md flex flex-col'>
      <div className='flex justify-end items-center w-full aboslute right-0 top-7'>
        <button onClick={() => toast.remove()} className='text-black mt-3 w-auto'>
          <Icons.close className='w-4 h-4' />
        </button>
      </div>
      <div className='flex flex-row gap-4 text-black items-center'>
        <Image src={`${imagePreview}`} alt='asd' width={50} height={50} className='w-16 h-16 border mt-2 border-gray-200 bg-slate-100 rounded-lg shadow-sm drop-shadow-sm' />
        <div className=''>
          <h1 className='text-lg font-medium '>Successfully added!</h1>
          <span className='text-[16px] font-normal'>Course {title} has been added in the courses page to view by students.</span>
        </div>
      </div>
    </div>,
    { style: {}, position: 'top-right' }
  );
};

export default CourseToast;
