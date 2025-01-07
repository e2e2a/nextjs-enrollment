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

const CreateAlert = ({ isUploading, isAlertOpen, setIsAlertOpen, handleSubmit }: IProps) => {
  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <div className='flex justify-end w-full'>
        <AlertDialogTrigger asChild>
          <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='focus-visible:ring-0 flex mb-2 bg-transparent bg-blue-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'>
            <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Submit'}</span>
          </Button>
        </AlertDialogTrigger>
      </div>
      <form action='' className='p-0 m-0' method='post'>
        <AlertDialogContent className='bg-white text-black'>
          <AlertDialogHeader>
            <AlertDialogTitle>Add Report Grade</AlertDialogTitle>
            <AlertDialogDescription className=''>
              &nbsp;&nbsp;&nbsp;&nbsp;This action will create a report by the given grades to your students. Please be aware that once this report is been approved by the dean this will not be editable and evaluated by the registrar.
            </AlertDialogDescription>
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

export default CreateAlert;
