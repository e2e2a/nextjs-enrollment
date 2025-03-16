'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Image from 'next/image';
import { useEnrollmentWithdrawMutation } from '@/lib/queries/enrollment/update/id/withdraw';
import { Icons } from '@/components/shared/Icons';

interface IProps {
  user: any;
}

const ApproveDialog = ({ user }: IProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const mutation = useEnrollmentWithdrawMutation();

  const actionFormEnable = (request: boolean) => {
    setIsUploading(true);

    const data = {
      category: 'College',
      id: user?._id,
      request,
    };

    mutation.mutate(data, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsOpen(false);
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
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='px-2 w-full flex justify-start sm:text-sm text-xs outline-none border-none hover:bg-red text-black hover:text-white text-nowrap'>
          <span className=' text-[15px] font-medium flex items-center justify-start '>
            <Icons.check className='h-4 w-4 mr-2' />
            <span className='text-nowrap'>Approve Withdraw</span>
          </span>
        </Button>
      </AlertDialogTrigger>
      <form action='' className='p-0 m-0' method='post'>
        <AlertDialogContent className='bg-white text-black'>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Enrollment Withdraw</AlertDialogTitle>
            <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will approved enrollment withdraw. Please be aware that this may impact student academic progress.</AlertDialogDescription>
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
            <Button disabled={isUploading} onClick={() => actionFormEnable(true)} className='bg-dark-4 text-white'>
              <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
};

export default ApproveDialog;
