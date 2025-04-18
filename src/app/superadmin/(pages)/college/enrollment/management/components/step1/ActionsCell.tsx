'use client';
import React from 'react';
import { Command, CommandGroup, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { useUpdateEnrollmentStepMutation } from '@/lib/queries/enrollment/update/id/step';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { RejectDialog } from '../RejectDialog';
import { RejectedRemarkValidator } from '@/lib/validators/enrollment/update/college/rejectEnrollee';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

type IProps = {
  user: any;
};

const ActionsCell = ({ user }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const mutation = useUpdateEnrollmentStepMutation();

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

    if (request === 'Rejected') {
      const isValid = await formReject.trigger();
      if (!isValid) return setIsPending(false);
    }

    const parseRejectData = formReject.getValues();

    const dataa = {
      EId: user?._id,
      step: 1,
      request,
      category: 'College',
      ...(parseRejectData ? parseRejectData : {}),
    };

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsDialogOpen(false);
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
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className='' asChild>
          <div className='flex justify-center items-center w-full'>
            <Button role='combobox' type='button' size={'sm'} className={'w-auto focus-visible:ring-0 flex bg-blue-500 px-2 py-0 text-neutral-50 font-medium'}>
              Options
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent align='center' className='w-[215px] bg-neutral-50 px-1 py-0'>
          <Command>
            <CommandList>
              <CommandGroup className=''>
                <Button type='button' disabled={isPending} size={'sm'} className={'w-full group focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-0 gap-x-1 justify-start items-center hover:text-neutral-50 font-medium'}>
                  <Link
                    href={`${isPending ? '' : `/superadmin/users/students/${user?.userId?._id}`}`}
                    className={'w-full h-full group/item rounded-md focus-visible:ring-0 flex text-black bg-transparent gap-x-1 justify-start items-center group-hover:hover:text-neutral-50'}
                  >
                    <Icons.eye className='h-4 w-4' />
                    View student profile
                  </Link>
                </Button>

                <Button
                  size={'sm'}
                  disabled={isPending}
                  type='submit'
                  onClick={(e) => actionFormSubmit(e, 'Approved')}
                  className={'w-full focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-green-500 px-2 py-0 gap-x-1 justify-start hover:text-neutral-50 font-medium'}
                >
                  <Icons.check className='h-4 w-4' />
                  Complete Current Step
                </Button>
                <RejectDialog isPending={isPending} form={formReject} user={user} setIsOpen={setIsOpen} isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} actionFormSubmit={actionFormSubmit} />
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActionsCell;
