'use client';
import React, { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useCollegeEndSemesterMutation } from '@/lib/queries';
import { Icons } from '@/components/shared/Icons';
import { Checkbox } from '@/components/ui/checkbox';
import { getProgress } from '@/action/college/enrollment/helpers/progress';
const TertiaryDialogEndSemester = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteInstructor, setDeleteInstructor] = useState<boolean>(false);
  const mutation = useCollegeEndSemesterMutation();
  const handleCheckboxChange = (e: any) => {
    setDeleteInstructor(e);
  };
  const actionFormDisable = () => {
    const data = {
      category: 'College',
      deleteInstructor: deleteInstructor,
    };
    mutation.mutate(data, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess('Enrollment has been Ended.');
            setIsOpen(false);
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
      {isUploading ? (
        <span className='text-sm'>{getProgress()}%</span>
      ) : (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='sm:text-sm text-xs bg-orange-400 text-white tracking-tight'>
              <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'End Semester'}</span>
            </Button>
          </AlertDialogTrigger>
          <form action='' className='p-0 m-0' method='post'>
            <AlertDialogContent className='bg-white text-black'>
              <AlertDialogHeader>
                <AlertDialogTitle>End Semester</AlertDialogTitle>
                <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will ended the semester. Please be aware that Students who have not received a grade will automatically be assigned an 'INC' (Incomplete).</AlertDialogDescription>
              </AlertDialogHeader>
              <div className='bg-[#ffd6d6] py-2 rounded-sm'>
                <div className='text-red px-3 text-sm'>
                  <div className='font-bold flex gap-1 items-center'>
                    <Icons.warning className='h-4 w-4 font-bold mb-1' />
                    <span className='text-sm font-medium'>Review before submitted. </span>
                  </div>
                </div>
              </div>
              <div className='grid grid-cols-1 gap-y-2'>
                <div className=''>
                  <h1 className='font-semibold text-sm tracking-wide'>Configuration</h1>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='terms' disabled={true} checked={true} />
                  <label htmlFor='terms' className='text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    Create All Enrolled Record
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='terms' disabled={true} checked={true} />
                  <label htmlFor='terms' className='text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    Create All Instructor Schedules Record
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='terms' disabled={true} checked={true} />
                  <label htmlFor='terms' className='text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    Delete All Reported Grades
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='terms' disabled={true} checked={true} />
                  <label htmlFor='terms' className='text-sm font-medium text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    Delete All Enrollments
                  </label>
                </div>
                <div className='flex items-center space-x-2'>
                  <Checkbox id='terms' checked={deleteInstructor} onCheckedChange={(e) => handleCheckboxChange(e)} />
                  <label htmlFor='terms' className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>
                    Delete All Instructor Schedules
                  </label>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction type='button' className='hidden'>
                  abzxc
                </AlertDialogAction>
                <Button disabled={isUploading} onClick={actionFormDisable} className='bg-dark-4 text-white'>
                  <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </form>
        </AlertDialog>
      )}
    </>
  );
};

export default TertiaryDialogEndSemester;
