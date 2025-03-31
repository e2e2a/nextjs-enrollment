'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Image from 'next/image';
import { useEnrollmentWithdrawMutation } from '@/lib/queries/enrollment/update/id/withdraw';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface IProps {
  user: any;
}

const CancelWithdrawDialog = ({ user }: IProps) => {
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
    <div className='flex flex-col items-center justify-center w-full'>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogTrigger asChild>
          <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='sm:text-sm text-xs bg-blue-500 hover:bg-blue-600 text-white'>
            <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Cancel Withdraw Enrollment'}</span>
          </Button>
        </AlertDialogTrigger>
        <form action='' className='p-0 m-0' method='post'>
          <AlertDialogContent className='bg-white text-black'>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Withdraw Enrollment</AlertDialogTitle>
              <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will cancel the withdrawal of your enrollment. Please note that canceling a withdrawal request may cause confusion with your academic records.</AlertDialogDescription>
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
        </form>
      </AlertDialog>
      <div className='overflow-x-auto mt-3 rounded-t-lg w-full'>
        <Table className='table-auto border-collapse rounded-t-lg border '>
          <TableHeader>
            <TableRow className=' border-black rounded-t-lg bg-gray-200 font-bold text-[16px]'>
              <TableHead className='px-4 py-2 text-left'>Approved By Dean</TableHead>
              <TableHead className='px-4 py-2 text-left'>Approved By Registrar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className='px-4 py-2 text-center'>{user?.withdrawApprovedByDean ? <span className='text-green-400 uppercase font-semibold'>APPROVED</span> : <span className='text-blue-400 uppercase font-semibold'>PENDING</span>}</TableCell>
              <TableCell className='px-4 py-2 text-center'>{user?.withdrawApprovedByAdmin ? <span className='text-green-400 uppercase font-semibold'>APPROVED</span> : <span className='text-blue-400 uppercase font-semibold'>PENDING</span>}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default CancelWithdrawDialog;
