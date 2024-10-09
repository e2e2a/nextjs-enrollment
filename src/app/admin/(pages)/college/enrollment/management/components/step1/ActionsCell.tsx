"use client"
import React from 'react';
import { Command, CommandGroup, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { DialogStep1Button } from './Dialog';
import { useApprovedEnrollmentStep1Mutation } from '@/lib/queries';
type IProps = {
  user: any;
};
const ActionsCell = ({ user }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const mutation = useApprovedEnrollmentStep1Mutation();
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
                    href={`${isPending ? '' : `admin/users/students/${user.userId._id}`}`}
                    className={'w-full h-full group/item rounded-md focus-visible:ring-0 flex text-black bg-transparent gap-x-1 justify-start items-center group-hover:hover:text-neutral-50'}
                  >
                    <Icons.eye className='h-4 w-4' />
                    View student profile
                  </Link>
                </Button>
                
                <Button size={'sm'} type='submit' onClick={actionFormSubmit} className={'w-full focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-green-500 px-2 py-0 gap-x-1 justify-start hover:text-neutral-50 font-medium'}>
                  <Icons.check className='h-4 w-4' />
                  Complete Current Step
                </Button>
                {/* <DialogStep1Button isPending={isPending} user={user} setIsOpen={setIsOpen} /> */}
                <Button disabled={isPending} type='button' size={'sm'} className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}>
                  <Icons.close className='h-4 w-4' />
                  Reject Enrollee
                </Button>
                {/* <DataTableDrawer user={user} /> */}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActionsCell;
