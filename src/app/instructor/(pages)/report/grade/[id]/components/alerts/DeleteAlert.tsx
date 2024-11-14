'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { useUpdateGradeReportMutation } from '@/lib/queries/reportGrade/update/id';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { Icons } from '@/components/shared/Icons';

interface IProps {
  isUploading: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  reportGrades: any;
}

const DeleteAlert = ({ isUploading, setIsOpen, reportGrades }: IProps) => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const mutation = useUpdateGradeReportMutation();
  const handleSubmit = (e: any) => {
    e.preventDefault();

    const dataa = {
      category: 'College',
      request: 'Trash',
      reportGradeId: reportGrades._id,
    };

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsOpen(false);
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
        setIsAlertOpen(false);
      },
    });
  };
  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <div className='flex justify-end '>
        <AlertDialogTrigger asChild>
          <Button type='button' disabled={isUploading} variant='ghost' size={'sm'} className='w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'>
            <div className=' text-[15px] font-medium flex items-center gap-1'>
              {isUploading ? (
                <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' />
              ) : (
                <>
                  <Icons.trash className='h-4 w-4' /> Delete
                </>
              )}
            </div>
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

export default DeleteAlert;
