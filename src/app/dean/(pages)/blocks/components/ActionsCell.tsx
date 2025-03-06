'use client';
import React from 'react';
import { Command, CommandGroup, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useArchiveBlockMutation } from '@/lib/queries/blocks/archive';

type IProps = {
  user: any;
};

const ActionsCell = ({ user }: IProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const mutation = useArchiveBlockMutation();

  const actionFormSubmit = () => {
    setIsPending(true);

    mutation.mutate(user?._id, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // setIsOpen(false);
            makeToastSucess(res?.message);
            return;
          default:
            makeToastError(res?.error);
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
        <PopoverContent align='center' className='w-[230px] bg-neutral-50 px-1 py-0'>
          <Command>
            <CommandList>
              <CommandGroup className=''>
                <Button disabled={isPending} size={'sm'} className={'w-full group focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-0 gap-x-1 justify-start items-center hover:text-neutral-50 font-medium'}>
                  <Link href={`${isPending ? '' : `/dean/blocks/${user?._id}`}`} className={'w-full h-full group/item rounded-md focus-visible:ring-0 flex text-black bg-transparent gap-x-1 justify-start items-center group-hover:hover:text-neutral-50'}>
                    <Icons.eye className='h-4 w-4' />
                    View Blocks Schedule
                  </Link>
                </Button>
                <Button
                  disabled={isPending}
                  type='button'
                  onClick={() => actionFormSubmit()}
                  size={'sm'}
                  className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                >
                  <Icons.trash className='h-4 w-4' />
                  Archive Block
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActionsCell;
