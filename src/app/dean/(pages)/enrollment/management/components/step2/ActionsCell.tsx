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
import { RejectDialog } from '../RejectDialog';
import { RejectedRemarkValidator } from '@/lib/validators/enrollment/update/college/rejectEnrollee';

type IProps = {
  user: any;
};

const ActionsCell2 = ({ user }: IProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState<boolean>(false);

  const mutation = useUpdateEnrollmentStepMutation();

  const form = useForm<z.infer<typeof EnrollmentBlockTypeValidator>>({
    resolver: zodResolver(EnrollmentBlockTypeValidator),
    defaultValues: {
      studentType: '',
      blockType: '',
    },
  });

  const formReject = useForm<z.infer<typeof RejectedRemarkValidator>>({
    resolver: zodResolver(RejectedRemarkValidator),
    defaultValues: {
      rejectedRemark:
        'Thank you for your interest in joining our program. Unfortunately, we were unable to proceed with your application due to missing required information. Please feel free to reach out for more details, and we encourage you to apply again once all information is complete.',
    },
  });

  const actionFormSubmit = async (e: any, request: string) => {
    e.preventDefault();
    setIsPending(true);
    if (request === 'Approved') {
      const isValid = await form.trigger();
      if (!isValid) return setIsPending(false);
    }
    if (request === 'Rejected') {
      const isValid = await formReject.trigger();
      if (!isValid) return setIsPending(false);
    }

    const parseRejectData = formReject.getValues();
    const parseData = form.getValues();

    const dataa = {
      category: 'College',
      step: 2,
      EId: user?._id,
      request,
      ...(parseData ? parseData : {}),
      ...(parseRejectData ? parseRejectData : {}),
    };

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsDialogOpen(false);
            setIsRejectDialogOpen(false);
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
                <Link href={`/admin/users/students/${user?.userId?._id}`} className={'w-full rounded-md focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-2 gap-x-1 justify-start  hover:text-neutral-50 '}>
                  <div className='flex justify-center items-center text-sm font-medium gap-x-1'>
                    <Icons.eye className='h-4 w-4' />
                    View student profile
                  </div>
                </Link>
                <Link href={`/admin/college/curriculums/students/solo/${user?.profileId?._id}`} className={'w-full rounded-md focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-2 gap-x-1 justify-start  hover:text-neutral-50 '}>
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
                <RejectDialog isPending={isPending} form={formReject} user={user} setIsOpen={setIsOpen} isDialogOpen={isRejectDialogOpen} setIsDialogOpen={setIsRejectDialogOpen} actionFormSubmit={actionFormSubmit} />
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActionsCell2;
