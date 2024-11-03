'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { useUpdateStudentEnrollmentScheduleMutation } from '@/lib/queries/enrollment/update/id/schedule';

interface IProps {
  user: any;
}
const ActionsCell = ({ user }: IProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [errorInSUbjectInput, setErrorInSUbjectInput] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [errorInTypeInput, setErrorInTypeInput] = useState(false);
  const [inputValueType, setInputValueType] = useState('');

  const handleInputChange = (e: any) => {
    const value = e.target.value;
    setInputValue(value);

    if (value.toLowerCase() === user.teacherScheduleId.subjectId.name.toLowerCase()) {
      setErrorInSUbjectInput(false);
    } else {
      setErrorInSUbjectInput(true);
    }
  };
  const handleInputChangeInType = (e: any) => {
    const value = e.target.value;
    setInputValueType(value);

    if (value.toLowerCase() === 'drop') {
      setErrorInTypeInput(false);
    } else {
      setErrorInTypeInput(true);
    }
  };

  const mutation = useUpdateStudentEnrollmentScheduleMutation();

  const actionFormEnable = (request: string) => {
    setIsUploading(true);
    if (request !== 'Suggested') {
      if (inputValue.toLowerCase() !== user.teacherScheduleId.subjectId.name.toLowerCase()) {
        setIsUploading(false);
        setErrorInSUbjectInput(true);
        return;
      }
      if (inputValueType.toLowerCase() !== 'drop') {
        setIsUploading(false);
        setErrorInSUbjectInput(true);
        return;
      }
    }
    const data = {
      category: 'College',
      profileId: user.profileId._id,
      teacherScheduleId: user.teacherScheduleId._id,
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
    <>
      {!user.request && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='sm:text-sm text-xs bg-red text-white'>
              <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Drop'}</span>
            </Button>
          </AlertDialogTrigger>
          <form action='' className='p-0 m-0' method='post'>
            <AlertDialogContent className='bg-white text-black'>
              <AlertDialogHeader>
                <AlertDialogTitle>Drop Subject</AlertDialogTitle>
                <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will drop the selected subject from your enrollment. Please be aware that this may impact your academic progress.</AlertDialogDescription>
              </AlertDialogHeader>
              <div className='bg-[#ffd6d6] py-2 rounded-sm'>
                <div className='text-red px-3 text-sm'>
                  <span className='font-bold '>WARNING:</span> <span className='text-sm font-light'> Once submitted, this action cannot be reversed without contacting the registrar.</span>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-y-1'>
                <div className='text-[14px] text-muted-foreground'>
                  Enter the subject name <span className='font-bold'>{user.teacherScheduleId.subjectId.name}</span> to conitinue
                </div>
                <div className=''>
                  <Input type='text' name='subject' className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none ring-0 focus:ring-1 focus:ring-red' value={inputValue} onChange={handleInputChange} placeholder='Enter subject name' />
                  {errorInSUbjectInput && <div className='text-red sm:text-sm px-2 text-xs'>The entered subject name does not match.</div>}
                </div>
              </div>
              <div className='grid grid-cols-1 gap-y-1'>
                <div className='text-[14px] text-muted-foreground'>
                  To verify, type <span className='font-bold'>Drop</span> below:
                </div>
                <div className=''>
                  <Input type='text' name='type' className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none ring-0 focus:ring-1 focus:ring-red' value={inputValueType} onChange={handleInputChangeInType} placeholder='Enter subject name' />
                  {errorInTypeInput && <div className='text-red sm:text-sm px-2 text-xs'>The entered type does not match.</div>}
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type='button' className='hidden'>
                  abzxc
                </AlertDialogAction>
                <Button disabled={isUploading} onClick={() => actionFormEnable('Drop')} className='bg-dark-4 text-white'>
                  <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </form>
        </AlertDialog>
      )}
      {user.request && user.request === 'drop' && <span className='uppercase text-red'>DROP</span>}
      {user.request && user.request === 'add' && <span className='uppercase text-green-500'>add</span>}
      {user.request && user.requestStatus.toLowerCase() === 'suggested' && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='sm:text-sm text-xs bg-green-500 text-white'>
              <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'ADD'}</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className='bg-white text-black'>
            <AlertDialogHeader>
              <AlertDialogTitle>Add Subject</AlertDialogTitle>
              <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will add the suggested subject from your enrollment. Please be aware that this may add directly to your academic progress.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction type='button' className='hidden'>
                abzxc
              </AlertDialogAction>
              <Button disabled={isUploading} onClick={() => actionFormEnable('Suggested')} className='bg-dark-4 text-white'>
                <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default ActionsCell;
