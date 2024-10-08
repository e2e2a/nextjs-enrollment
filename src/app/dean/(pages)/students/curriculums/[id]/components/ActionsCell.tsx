'use client';
import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ChevronsUpDown } from 'lucide-react';
import AddFormSubject from './AddFormSubject';
type IProps = {
  curriculum: any;
  s: any;
  isEnableGrade: boolean;
  curriculumIdToEnableGrade: string;
  setCurriculumIdToEnableGrade: React.Dispatch<string>;
  setIsDisableGrade: React.Dispatch<boolean>;
};
const ActionsCell = ({ curriculum, s, isEnableGrade, curriculumIdToEnableGrade, setCurriculumIdToEnableGrade, setIsDisableGrade }: IProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  return (
    <div className=''>
      {isEnableGrade && curriculumIdToEnableGrade === curriculum._id ? (
        <div className='flex gap-x-2'>
          <Button disabled={isPending} size={'sm'} type='button' className={'w-full group focus-visible:ring-0 flex my-1 bg-blue-600 px-2 py-0 gap-x-1 justify-start items-center text-neutral-50 font-medium'}>
            {/* <Icons.squarePen className='h-4 w-4' /> */}
            <span className='flex'>Save</span>
          </Button>
          <Button disabled={isPending} size={'sm'} type='button' onClick={() => setIsDisableGrade(false)} className={'w-full group focus-visible:ring-0 flex my-1 bg-red px-2 py-0 gap-x-1 justify-start items-center text-neutral-50 font-medium'}>
            {/* <Icons.squarePen className='h-4 w-4' /> */}
            <span className='flex'>Cancel</span>
          </Button>
        </div>
      ) : (
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
                  <AddFormSubject curriculum={curriculum} s={s} />
                  <Button
                    disabled={isPending}
                    size={'sm'}
                    type='button'
                    onClick={() => {
                      setCurriculumIdToEnableGrade(curriculum?._id);
                      setIsDisableGrade(true);
                    }}
                    className={'w-full group focus-visible:ring-0 flex my-1 text-black bg-transparent hover:bg-blue-600 px-2 py-0 gap-x-1 justify-start items-center hover:text-neutral-50 font-medium'}
                  >
                    <Icons.squarePen className='h-4 w-4' />
                    <span className='flex'>Edit Grades</span>
                  </Button>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default ActionsCell;
