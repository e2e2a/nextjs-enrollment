import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Icons } from '@/components/shared/Icons';
import { useUpdateEnrollmentSetupMutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
const TertiaryAlertDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const mutation = useUpdateEnrollmentSetupMutation();

  const handleSubmit = () => {
    const data = {
      enrollmentTertiary: { open: false },
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
        <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='sm:text-sm text-xs gap-2 bg-red text-white'>
          <Icons.graduationCap className='h-6 w-6' />
          <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Close/End Enrollment'}</span>
        </Button>
      </AlertDialogTrigger>
      <form action='' className='p-0 m-0' method='post'>
        <AlertDialogContent className='bg-white text-black'>
          <AlertDialogHeader>
            <AlertDialogTitle>Closed Enrollment</AlertDialogTitle>
            <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will close the enrollment form for students. Please be aware that once closed, students will no longer be able to submit their enrollment forms for college.</AlertDialogDescription>
          </AlertDialogHeader>
          {/* <div className='bg-[#ffd6d6] py-2 rounded-sm'>
            <div className='text-red px-3 text-sm'>
              <span className='font-bold '>WARNING:</span> <span className='text-sm font-light'> Once submitted, this action cannot be reversed without contacting the registrar.</span>
            </div>
          </div> */}

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

export default TertiaryAlertDialog;
