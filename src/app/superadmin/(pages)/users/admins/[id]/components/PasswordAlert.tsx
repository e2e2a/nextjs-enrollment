'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface IProps {
  isOpen: boolean;
  isPending: boolean;
  disabled: boolean;
  form: any;
  onSubmit: any;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PasswordAlert = ({ isOpen, isPending, disabled, form, onSubmit, setIsOpen }: IProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger disabled={disabled} asChild>
        <Button type='button' disabled={disabled} variant='outline' size={'sm'} className='bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide'>
          <span className=' text-white text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Save'}</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white text-black'>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Password</AlertDialogTitle>
          <AlertDialogDescription className=''>
            &nbsp;&nbsp;&nbsp;&nbsp;This action will change the user&apos;s password. Please note that updating the password will require the user to use the new password for future logins. Ensure you have verified the change with the user before proceeding.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction type='button' className='hidden'>
            abzxc
          </AlertDialogAction>
          <Button type='submit' onClick={(e) => onSubmit(e)} disabled={isPending} className='bg-dark-4 text-white'>
            <span className=' text-white text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PasswordAlert;
