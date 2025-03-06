import React from 'react';
import { Command, CommandGroup, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useRetrieveSubjectByIdMutation } from '@/lib/queries/subjects/retrieve';

type IProps = {
  user: any;
};

const ActionsCell = ({ user }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const mutation = useRetrieveSubjectByIdMutation();

  const onSubmit = async () => {
    setIsPending(true);
    mutation.mutate(user?._id, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            return makeToastSucess(res.message);
          default:
            return makeToastError(res.error);
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
                <Button disabled={isPending} onClick={() => onSubmit()} type='button' size={'sm'} className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-green-500 px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}>
                  <Icons.RefreshCcw className='h-4 w-4' />
                  Retrieve Room
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
