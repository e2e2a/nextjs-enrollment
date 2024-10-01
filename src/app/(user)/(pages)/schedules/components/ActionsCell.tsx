'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { useUpdateEnrollmentSetupMutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Image from 'next/image';

interface IProps {
  user: any;
}
const ActionsCell = ({ user }: IProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean | undefined>(undefined);
  const mutation = useUpdateEnrollmentSetupMutation();
  const actionFormEnable = (addOrDropSubjects: boolean) => {
    setIsOpen(false);
    setIsUploading(true);
    // const data = {
    //   addOrDropSubjects: addOrDropSubjects,
    // };
    // mutation.mutate(data, {
    //   onSuccess: (res: any) => {
    //     switch (res.status) {
    //       case 200:
    //       case 201:
    //       case 203:
    //         makeToastSucess(res.message);
    //         return;
    //       default:
    //         makeToastError(res.error);
    //         return;
    //     }
    //   },
    //   onSettled: () => {
    //     setIsOpen(undefined);
    //     setIsUploading(false);
    //   },
    // });
  };
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='sm:text-sm text-xs bg-red text-white'>
          <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Drop'}</span>
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
  );
};

export default ActionsCell;
