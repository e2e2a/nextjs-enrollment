"use client"
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
const TertiaryDialogEndSemester = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  
  const actionFormDisable = () => {
    console.log('disable');
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='sm:text-sm text-xs bg-orange-400 text-white tracking-tight'>
          <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'End Semester'}</span>
        </Button>
      </AlertDialogTrigger>
      <form action='' className='p-0 m-0' method='post'>
        <AlertDialogContent className='bg-white text-black'>
          <AlertDialogHeader>
            <AlertDialogTitle>Drop Subject</AlertDialogTitle>
            <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will drop the selected subject from your enrollment. Please be aware that this may impact your academic progress.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className='bg-[#ffd6d6] py-2 rounded-sm'>
            <div className='text-red px-3 text-sm'>
              <span className='font-bold '>WARNING:</span> <span className='text-sm font-light'> Once submitted, this action cannot be reversed without contacting the registrar.</span>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type='button' className='hidden'>
              abzxc
            </AlertDialogAction>
            <Button disabled={isUploading} onClick={actionFormDisable} className='bg-dark-4 text-white'>
              <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
};

export default TertiaryDialogEndSemester;
