'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Image from 'next/image';
import { useUpdateEnrollmentSetupMutation } from '@/lib/queries/enrollmentSetup/update';

interface IProps {
  enrollmentSetup: any;
}

const EnableADW = ({ enrollmentSetup }: IProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean | undefined>(false);
  const mutation = useUpdateEnrollmentSetupMutation();

  const actionFormEnable = (addOrDropSubjects: boolean) => {
    setIsOpen(false);
    setIsUploading(true);

    const data = { addOrDropSubjects: addOrDropSubjects };

    mutation.mutate(data, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res.message);
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
    <>
      {enrollmentSetup.addOrDropSubjects ? (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild className=' '>
            <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='animate-fadeOut duration-75 sm:text-sm text-xs bg-blue-500 text-white'>
              <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Deactivate Add/Drop Subjects'}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-white text-black'>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will disable the student add and drop subject request.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type='button' className='hidden'>
                abzxc
              </AlertDialogAction>
              <Button disabled={isUploading} onClick={() => actionFormEnable(false)} className='bg-dark-4 text-white'>
                <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='animate-fadeOut duration-75 sm:text-sm text-xs bg-green-500 text-white'>
              <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Activate Add/Drop Subjects'}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-white text-black'>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will enable the student add and drop subject request .</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type='button' className='hidden'>
                abzxc
              </AlertDialogAction>
              <Button disabled={isUploading} onClick={() => actionFormEnable(true)} className='bg-dark-4 text-white'>
                <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default EnableADW;
