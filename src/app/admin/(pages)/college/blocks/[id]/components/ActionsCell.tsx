"use client"
import React from 'react';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useRemoveCourseBlockScheduleMutation } from '@/lib/queries';

type IProps = {
  user: any;
};
const ActionsCell = ({ user }: IProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const mutation = useRemoveCourseBlockScheduleMutation();
  const actionFormSubmit = () => {
    console.log('user submitted:', user.teacherScheduleId)
   const data = {
    teacherScheduleId: user.teacherScheduleId._id,
    blockTypeId: user.teacherScheduleId.blockTypeId._id
   }

    mutation.mutate(data, {
      onSuccess: (res: any) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // return (window.location.href = '/');
            return;
          default:
            return;
        }
      },
      onSettled: () => {},
    });
  };
  return (
    <div className='flex items-center justify-center'>
      <Button disabled={isPending} type='button' onClick={() => actionFormSubmit()} size={'sm'} className={'w-auto focus-visible:ring-0 mb-2 bg-transparent flex justify-start bg-red px-2 py-0 gap-x-1 text-neutral-50 font-medium'}>
        <Icons.trash className='h-4 w-4' />
        Remove
      </Button>
    </div>
  );
};

export default ActionsCell;
