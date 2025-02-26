'use client';
import React from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { useUpdateGradeReportMutation } from '@/lib/queries/reportGrade/update/id';

interface IProps {
  user: any;
}

const EvaluationButton = ({ user }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  const mutation = useUpdateGradeReportMutation();
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsPending(true);

    const dataa = {
      category: 'College',
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
            if (res.error) return makeToastError(res.error);
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
      {!user.evaluated && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <div className='flex justify-start sm:justify-center w-full'>
              <Button type='button' disabled={isPending} size={'sm'} className='w-auto focus-visible:ring-0 mb-2 bg-transparent flex justify-start bg-green-500 px-2 py-0 gap-x-1 text-neutral-50 font-medium'>
                <span className=' text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Approved Grades'}</span>
              </Button>
            </div>
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-white text-black'>
            <AlertDialogHeader>
              <AlertDialogTitle>Approved Report Grade</AlertDialogTitle>
              <AlertDialogDescription className=' py-5'>&nbsp;&nbsp;&nbsp;&nbsp;Are you sure you want to Approved this report?</AlertDialogDescription>
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
      )}
    </div>
  );
};

export default EvaluationButton;
