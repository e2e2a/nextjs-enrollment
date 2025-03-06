'use client';
import React, { useState } from 'react';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/ui/button';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { useUpdateGradeReportMutation } from '@/lib/queries/reportGrade/update/id';

type IProps = {
  request: string;
  user: any;
  isPending: boolean;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
};

const AlertDialogPage = ({ request, user, isPending, setIsPending }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const mutation = useUpdateGradeReportMutation();

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsPending(true);

    const dataa = {
      category: 'College',
      reportGradeId: user._id,
      statusInDean: request === 'Approve' ? 'Approved' : 'Rejected',
    };

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res?.message);
            return;
          default:
            if (res.error) {
              makeToastError(res.error);
            }
            return;
        }
      },
      onSettled: () => {
        setIsOpen(false);
        setIsPending(false);
      },
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <div className='flex justify-end '>
          <Button type='button' disabled={isPending} size={'sm'} className={` focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start ${request === 'Approve' ? 'bg-green-500' : 'bg-red'}  px-2 py-0 gap-x-1 text-neutral-50 font-medium`}>
            {request === 'Approve' && <Icons.check className='h-4 w-4' />}
            {request === 'Reject' && <Icons.ban className='h-4 w-4' />}
            <span className=' text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : <span className=''>{request} Report Grade</span>}</span>
          </Button>
        </div>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white text-black'>
        <AlertDialogHeader>
          <AlertDialogTitle>{request} Report Grade</AlertDialogTitle>
          <AlertDialogDescription className=' py-5'>&nbsp;&nbsp;&nbsp;&nbsp;Are you sure you want to {request} this report?</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type='button' className='hidden'>
            abzxc
          </AlertDialogAction>
          <Button disabled={isPending} onClick={(e) => handleSubmit(e)} className='bg-dark-4 text-white'>
            <span className=' text-white text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AlertDialogPage;
