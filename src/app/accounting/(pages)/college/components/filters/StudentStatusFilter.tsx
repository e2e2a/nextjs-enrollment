'use client';
import React from 'react';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

type IProps = {
  onChange: (role: string | null) => void;
};

const StudentStatusFilter = ({ onChange }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = React.useState('');
  const [isPending, setIsPending] = useState<boolean>(false);

  return (
    <div className=''>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className='' asChild>
          <div className='flex justify-center items-center w-full'>
            <Button role='combobox' type='button' size={'sm'} className={'w-auto focus-visible:ring-0 flex px-2 py-0 text-black font-normal'}>
              Student Status
              <ArrowUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent align='center' className='w-[215px] bg-neutral-50 px-1 py-0'>
          <Command>
            <CommandList>
              <CommandGroup className=''>
                <CommandItem
                  value={''}
                  className='w-auto'
                  onSelect={(currentValue) => {
                    setIsOpen(!isOpen);
                    onChange(currentValue);
                    setValue(currentValue);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === '' ? 'opacity-100' : 'opacity-0')} />
                  All Student Status
                </CommandItem>
                <CommandItem
                  value={'New Student'}
                  className='w-auto'
                  onSelect={(currentValue) => {
                    setIsOpen(!isOpen);
                    onChange(currentValue);
                    setValue(currentValue);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === 'New Student' ? 'opacity-100' : 'opacity-0')} />
                  New Student
                </CommandItem>
                <CommandItem
                  value={'Old Student'}
                  className='w-auto'
                  onSelect={(currentValue) => {
                    setIsOpen(!isOpen);
                    onChange(currentValue);
                    setValue(currentValue);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === 'Old Student' ? 'opacity-100' : 'opacity-0')} />
                  Old Student
                </CommandItem>
                <CommandItem
                  value={'Transferee'}
                  className='w-auto'
                  onSelect={(currentValue) => {
                    setIsOpen(!isOpen);
                    onChange(currentValue);
                    setValue(currentValue);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === 'Transferee' ? 'opacity-100' : 'opacity-0')} />
                  Transferee
                </CommandItem>
                <CommandItem
                  value={'Returning'}
                  className='w-auto'
                  onSelect={(currentValue) => {
                    setIsOpen(!isOpen);
                    onChange(currentValue);
                    setValue(currentValue);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === 'Returning' ? 'opacity-100' : 'opacity-0')} />
                  Returning
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default StudentStatusFilter;
