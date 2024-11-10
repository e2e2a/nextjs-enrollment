'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useUpdateEnrollmentSetupMutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';

interface IProps {
  setup: any;
}

const FirstGrade = ({ setup }: IProps) => {
  console.log('firstGrade', setup.firstGrade);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const mutation = useUpdateEnrollmentSetupMutation();

  const handleSubmit = () => {
    const data = {
      name: 'GODOY',
      'enrollmentTertiary.firstGrade.open': !setup.firstGrade?.open,
    };

    mutation.mutate(data, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess('Prelim Grading is Open.');
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
        <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className={`sm:text-sm text-xs gap-1 ${setup.firstGrade?.open ? 'bg-red' : 'bg-green-500'}  text-white`}>
          <span className='h-6 w-6 flex items-center'>📝</span>
          <span className=' text-white text-sm font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Open Prelim Grading'}</span>
        </Button>
      </AlertDialogTrigger>
      <form action='' className='p-0 m-0' method='post'>
        <AlertDialogContent className='bg-white text-black'>
          <AlertDialogHeader>
            <AlertDialogTitle>{setup?.firstGrade?.open ? 'Closing' : 'Opening'} the Grading of Prelim</AlertDialogTitle>
            <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;{setup?.firstGrade?.open ? 'This action will closed the grading system for the Prelim.' : 'This action will open the grading system for the Prelim.'}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type='button' className='hidden'>
              abzxc
            </AlertDialogAction>
            <Button disabled={isUploading} onClick={() => handleSubmit()} className='bg-dark-4 text-white'>
              <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
};

export default FirstGrade;
