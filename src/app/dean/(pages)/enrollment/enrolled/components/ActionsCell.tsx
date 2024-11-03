import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
// import { DialogStep1Button } from './Dialog';
type IProps = {
  user: any;
};
const ActionsCell = ({ user }: IProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
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
        <PopoverContent align='center' className='w-[225px] bg-neutral-50 px-1 py-0'>
          <Command>
            <CommandList>
              <CommandGroup className=''>
                <Link href={`/dean/enrollment/schedules/${user._id}`} className={'w-full rounded-md focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-2 gap-x-1 justify-start  hover:text-neutral-50 '}>
                  <div className='flex justify-center items-center text-sm font-medium gap-x-1'>
                    <Icons.eye className='h-4 w-4' />
                    View Student Subjects
                  </div>
                </Link>
                <Link href={`/dean/students/${user.userId._id}`} className={'w-full rounded-md focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-2 gap-x-1 justify-start  hover:text-neutral-50 '}>
                  <div className='flex justify-center items-center text-sm font-medium gap-x-1'>
                    <Icons.eye className='h-4 w-4' />
                    View Student Profile
                  </div>
                </Link>
                <Link href={`/dean/students/curriculums/${user.profileId._id}`} className={'w-full rounded-md focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-2 gap-x-1 justify-start  hover:text-neutral-50 '}>
                  <div className='flex justify-center items-center text-sm font-medium gap-x-1'>
                    <Icons.eye className='h-4 w-4' />
                    View Student Curriculum
                  </div>
                </Link>
                <Button disabled={isPending} type='button' size={'sm'} className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}>
                  <Icons.close className='h-4 w-4' />
                  Delete Course
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
