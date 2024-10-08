'use client';
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { useApprovedEnrollmentStep2Mutation, useUndoEnrollmentToStep1Mutation } from '@/lib/queries';
import { DialogStep1Button } from './Dialog';
type IProps = {
  user: any;
};
const ActionsCell2 = ({ user }: IProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const undoMutation = useUndoEnrollmentToStep1Mutation();
  const mutation = useApprovedEnrollmentStep2Mutation();
  
  const actionFormUndo = () => {
    const data = {
      EId: user._id,
      step: user.step,
      blockType: user.blockType,
    };

    undoMutation.mutate(data, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // setTypeMessage('success');
            // setMessage(res?.message);
            // return (window.location.href = '/');
            console.log(res);
            return;
          default:
            //create maketoast
            // setIsPending(false);
            // setMessage(res.error);
            // setTypeMessage('error');
            return;
        }
      },
      onSettled: () => {},
    });
  };
  const actionFormSubmit = () => {
    // setIsPending(true);
    const dataa = {
      EId: user._id,
    };
    mutation.mutate(dataa, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // setTypeMessage('success');
            // setMessage(res?.message);
            console.log(res);
            return;
          default:
            //create maketoast
            // setIsPending(false);
            // setMessage(res.error);
            // setTypeMessage('error');
            return;
        }
      },
      onSettled: () => {},
    });
  }
  return (
    <div className=''>
      <Popover>
        <PopoverTrigger className='' asChild>
          <div className='flex justify-center items-center w-full'>
            <Button type='button' role='combobox' size={'sm'} className={'w-auto focus-visible:ring-0 flex bg-blue-500 px-2 py-0 text-neutral-50 font-medium'}>
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
                <Link href={`/admin/college/curriculums/students/${user.profileId._id}`} className={'w-full rounded-md focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-2 gap-x-1 justify-start  hover:text-neutral-50 '}>
                  <div className='flex justify-center items-center text-sm font-medium gap-x-1'>
                    <Icons.fileStack className='h-4 w-4' />
                    Apply Credits
                  </div>
                </Link>
                {/* @todo */}

                {/* {user.studentStatus === 'new student' || user.studentStatus === 'transfer student' ? (
                  <Button type='button' disabled={isPending} size={'sm'} className={'w-full focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-green-500 px-2 py-0 gap-x-1 justify-start hover:text-neutral-50 font-medium'}>
                    <Icons.check className='h-4 w-4' />
                    Apply Credits
                  </Button>
                ) : null} */}
                {/* <DialogStep1Button isPending={isPending} user={user} /> */}
                <Button size={'sm'} type='submit' onClick={actionFormSubmit} className={'w-full focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-green-500 px-2 py-0 gap-x-1 justify-start hover:text-neutral-50 font-medium'}>
                  <Icons.check className='h-4 w-4' />
                  Complete Current Step
                </Button>
                <Button disabled={isPending} type='button' size={'sm'} onClick={actionFormUndo} className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-yellow-400 px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}>
                  <Icons.rotateCcw className='h-4 w-4' />
                  Undo last Step
                </Button>
                {/* <Button disabled={isPending} type='button' size={'sm'} className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}>
                  <Icons.close className='h-4 w-4' />
                  Reject Enrollee
                </Button> */}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActionsCell2;
