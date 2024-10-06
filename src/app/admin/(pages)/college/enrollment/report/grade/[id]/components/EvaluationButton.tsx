'use client';
import React from 'react';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
// import { DialogStep1Button } from './Dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { useEvaluateApprovedGradeReportMutation } from '@/lib/queries';

interface IProps {
  user: any;
}
const EvaluationButton = ({ user }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useEvaluateApprovedGradeReportMutation();
  const handleSubmit = () => {
    const dataa = {
      // category: 'College',
      reportGradeId: user._id,
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
    <div className={`w-full flex justify-start items-center ${user.evaluated ? ' mt-1 ' : ' mt-4 sm:mt-0'}`}>
      {user.evaluated ? (
        <span className='text-sm sm:text-[17px] font-bold capitalize'>
          Evaluated: <span className='font-normal text-green-500'>TRUE</span>
        </span>
      ) : (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <div className='flex justify-start sm:justify-center w-full'>
              <Button type='button' disabled={isPending} size={'sm'} className='w-auto focus-visible:ring-0 mb-2 bg-transparent flex justify-start bg-green-500 px-2 py-0 gap-x-1 text-neutral-50 font-medium'>
                <span className=' text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Evaluate Grades'}</span>
              </Button>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-white text-black'>
            <AlertDialogHeader>
              <AlertDialogTitle>Approved Report Grade</AlertDialogTitle>
              <AlertDialogDescription className=' py-5'>&nbsp;&nbsp;&nbsp;&nbsp;Are you sure you want to approve this report?</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type='button' className='hidden'>
                abzxc
              </AlertDialogAction>
              <Button disabled={isPending} onClick={() => handleSubmit()} className='bg-dark-4 text-white'>
                <span className=' text-white text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default EvaluationButton;
