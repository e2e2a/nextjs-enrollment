'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Icons } from '@/components/shared/Icons';

type IProps = {
  isOpen: boolean;
  isPending: boolean;
  actionFormSubmit: any;
  teacherScheduleId: string;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const SuggestDialog = ({ isPending, isOpen, actionFormSubmit, teacherScheduleId, setIsOpen }: IProps) => {

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button type='button' disabled={isPending} variant='outline' size={'sm'} className='focus-visible:ring-0 flex bg-transparent rounded-tl-none rounded-bl-none bg-orange-500 px-2 py-0 gap-x-0 sm:gap-x-1 justify-center  text-neutral-50 font-medium'>
          <Icons.star className='h-4 w-4 fill-white mr-1' />
          <span className='sm:flex text-xs sm:text-sm'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Suggest'}</span>
        </Button>
      </AlertDialogTrigger>
      <form action='' className='p-0 m-0' method='post'>
        <AlertDialogContent className='bg-white text-black'>
          <AlertDialogHeader>
            <AlertDialogTitle>Suggest Subject</AlertDialogTitle>
            <AlertDialogDescription className=''>
              &nbsp;&nbsp;&nbsp;&nbsp;Suggesting a subject for student&apos;s enrollment. Please note that this action will propose the subject for the student. Additionally, this suggestion will not be visible to students if the add/drop period has been
              closed.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type='button' className='hidden'>
              abzxc
            </AlertDialogAction>
            <Button
              disabled={isPending}
              onClick={() => {
                actionFormSubmit('Suggested', teacherScheduleId);
              }}
              className='bg-dark-4 text-white'
            >
              <span className=' text-white text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
};

export default SuggestDialog;
