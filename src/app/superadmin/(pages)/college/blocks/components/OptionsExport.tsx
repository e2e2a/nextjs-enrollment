'use client';
import React from 'react';
import { Command, CommandGroup, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { Icons } from '@/components/shared/Icons';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { exportToExcel, exportToPDF } from './ExportUtils';

type IProps = {
  data: any;
};

const OptionsExport = ({ data }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);

  return (
    <div className=''>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className='' asChild>
          <div className='flex justify-end items-center w-full'>
            <Button role='combobox' size={'sm'} className={'w-auto active:bg-blue-400 focus-visible:ring-0 flex bg-none hover:bg-blue-500 px-2 py-0 text-black hover:text-neutral-50 font-medium'}>
              <Icons.download className='mr-1 h-4 w-4 shrink-0 opacity-50' />
              Download
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent align='end' className='w-[215px] bg-neutral-50 px-1 py-0'>
          <Command>
            <CommandList>
              <CommandGroup className=''>
                <Button
                  disabled={isPending}
                  onClick={(e) => exportToPDF(data, '')}
                  type='button'
                  size={'sm'}
                  className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-neutral-200 px-2 py-0 gap-x-1 font-medium'}
                >
                  Export as pdf
                </Button>
              </CommandGroup>
              <CommandGroup className=''>
                <Button
                  disabled={isPending}
                  onClick={(e) => exportToExcel(data, '')}
                  type='button'
                  size={'sm'}
                  className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-neutral-200 px-2 py-0 gap-x-1 font-medium'}
                >
                  Export as excel
                </Button>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default OptionsExport;
