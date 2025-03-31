'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useUpdateStudentEnrollmentScheduleMutation } from '@/lib/queries/enrollment/update/id/schedule';
import { Textarea } from '@/components/ui/textarea';
import { Icons } from '@/components/shared/Icons';

interface IProps {
  user: any;
}
const ViewReason = ({ user }: IProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='sm:text-sm text-[10px] bg-yellow-500 text-white'>
          <span className=' text-white text-[10px] font-medium flex items-center'><Icons.eye className='h-4 w-4' />{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : `View Reason`}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white text-black'>
        <AlertDialogHeader>
          <AlertDialogTitle>Reason</AlertDialogTitle>
          <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;{user?.reason}.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type='button' className='hidden'>
            abzxc
          </AlertDialogAction>
          
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ViewReason;
