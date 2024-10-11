'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useCollegeEndSemesterMutation } from '@/lib/queries';
const TertiaryDialogEndSemester = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const mutation = useCollegeEndSemesterMutation();

  const actionFormDisable = () => {
    const data = {
      category: 'College'
    };
    mutation.mutate(data, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess('Enrollment in college has been closed');
            return;
          default:
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsUploading(false);
      },
    });
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
            <AlertDialogTitle>End Semester</AlertDialogTitle>
            <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will drop the selected subject from your enrollment. Please be aware that this may impact your academic progress.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className='bg-[#ffd6d6] py-2 rounded-sm'>
            <div className='text-red px-3 text-sm'>
              <span className='font-bold '>WARNING:</span> <span className='text-sm font-light'> Please review before submitted.</span>
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
