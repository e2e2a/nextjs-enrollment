'use client';
import React from 'react';
import { Command, CommandGroup, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { DialogStep2Button } from './Dialog';
import { useUpdateEnrollmentStepMutation } from '@/lib/queries/enrollment/update/id/step';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useForm } from 'react-hook-form';
import { EnrollmentBlockTypeValidator } from '@/lib/validators/enrollment/update/college/step2';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type IProps = {
  user: any;
};

const ActionsCell2 = ({ user }: IProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const mutation = useUpdateEnrollmentStepMutation();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof EnrollmentBlockTypeValidator>>({
    resolver: zodResolver(EnrollmentBlockTypeValidator),
    defaultValues: {
      studentType: '',
      blockType: '',
    },
  });
  const actionFormSubmit = async (e: any, request: string) => {
    e.preventDefault();
    setIsPending(true);
    if (request === 'Approved') {
      const isValid = await form.trigger();
      if (!isValid) return setIsPending(false);
    }
    const parseData = form.getValues();

    const dataa = {
      category: 'College',
      step: 2,
      EId: user._id,
      request,
      ...(parseData ? parseData : {}),
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
                <Link href={`/dean/students/${user.userId._id}`} className={'w-full rounded-md focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-2 gap-x-1 justify-start  hover:text-neutral-50 '}>
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
                
                {/* @Approved step 2 Dialog */}
                <DialogStep2Button isPending={isPending} form={form} user={user} setIsOpen={setIsOpen} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} actionFormSubmit={actionFormSubmit} />

                <Button
                  disabled={isPending}
                  type='button'
                  size={'sm'}
                  onClick={(e) => actionFormSubmit(e, 'Undo')}
                  className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-yellow-400 px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                >
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
