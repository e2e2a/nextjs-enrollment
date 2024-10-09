'use client';
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { useApprovedEnrollmentStep5Mutation, useUndoEnrollmentToStep4Mutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';

type IProps = {
  user: any;
};
const ActionsCell3 = ({ user }: IProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  /**
   * @todo
   * 1. update the payment in the student profile
   */
  const mutation = useApprovedEnrollmentStep5Mutation();
  const undoMutation = useUndoEnrollmentToStep4Mutation();
  const actionFormUndo = () => {
    setIsPending(true);
    const data = {
      EId: user._id,
      step: user.step,
      blockType: user.blockType,
    };
    undoMutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res.message);
            return;
          default:
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };
  const actionFormSubmit = () => {
    setIsPending(true);
    const dataa = {
      EId: user._id,
    };
    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res.message);
            return;
          default:
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };
  return (
    <div className=''>
      <Popover>
        <PopoverTrigger className='' asChild>
          <div className='flex justify-center items-center w-full'>
            <Button role='combobox' size={'sm'} className={'w-auto focus-visible:ring-0 flex bg-blue-500 px-2 py-0 text-neutral-50 font-medium'}>
              Options
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent align='center' className='w-[215px] bg-neutral-50 px-1 py-0'>
          <Command>
            <CommandList>
              <CommandGroup className=''>
                <Link href={`/admin/users/students/${user.userId._id}`} className={'w-full rounded-md focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-2 gap-x-1 justify-start  hover:text-neutral-50 '}>
                  <div className='flex justify-center items-center text-sm font-medium gap-x-1'>
                    <Icons.eye className='h-4 w-4' />
                    View student profile
                  </div>
                </Link>
                <Link href={`/dean/students/curriculums/${user.profileId._id}`} className={'w-full rounded-md focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-2 gap-x-1 justify-start  hover:text-neutral-50 '}>
                  <div className='flex justify-center items-center text-sm font-medium gap-x-1'>
                    <Icons.fileStack className='h-4 w-4' />
                    Apply Credits
                  </div>
                </Link>
                <Link href={`/admin/college/enrollment/schedules/${user._id}`} className={'w-full rounded-md focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-2 gap-x-1 justify-start  hover:text-neutral-50 '}>
                  <div className='flex justify-center items-center text-sm font-medium gap-x-1'>
                    <Icons.fileStack className='h-4 w-4' />
                    Add Subjects
                  </div>
                </Link>
                <Button
                  type='button'
                  disabled={isPending}
                  onClick={actionFormSubmit}
                  size={'sm'}
                  className={'w-full focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-green-500 px-2 py-0 gap-x-1 justify-start hover:text-neutral-50 font-medium'}
                >
                  <Icons.check className='h-4 w-4' />
                  Complete Current Step
                </Button>
                <Button
                  disabled={isPending}
                  type='button'
                  size={'sm'}
                  onClick={actionFormUndo}
                  className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-yellow-400 px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                >
                  <Icons.rotateCcw className='h-4 w-4' />
                  Undo last Step
                </Button>
                {/* <Button disabled={isPending} type='button' size={'sm'} className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}>
                  <Icons.close className='h-4 w-4' />
                  Reject Enrollee
                </Button> */}
                {/* <DataTableDrawer user={user} /> */}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActionsCell3;
