'use client';
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';

interface IProps {
  isUploading: boolean;
  isAlertOpen: boolean;
  setIsAlertOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubmit: any;
}

const UpdateAlert = ({ isUploading, isAlertOpen, setIsAlertOpen, handleSubmit }: IProps) => {
  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <div className='flex justify-end '>
        <AlertDialogTrigger asChild>
          <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='focus-visible:ring-0 flex mb-2 bg-transparent bg-blue-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'>
            <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Save'}</span>
          </Button>
        </AlertDialogTrigger>
      </div>
      <form action='' className='p-0 m-0' method='post'>
        <AlertDialogContent className='bg-white text-black'>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Report Grade</AlertDialogTitle>
            <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;Are you sure to update the grades?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type='button' className='hidden'>
              abzxc
            </AlertDialogAction>
            <Button disabled={isUploading} onClick={handleSubmit} className='bg-dark-4 text-white'>
              <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
};

export default UpdateAlert;
