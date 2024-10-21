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

const YearFilter = ({ onChange }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = React.useState('');
  const [isPending, setIsPending] = useState<boolean>(false);

  return (
    <div className=''>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className='' asChild>
          <div className='flex justify-center items-center w-full'>
            <Button role='combobox' type='button' size={'sm'} className={'w-auto focus-visible:ring-0 flex px-2 py-0 text-black font-normal'}>
              Student Year
              <ArrowUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent align='center' className='w-[215px] bg-neutral-50 px-1 py-0'>
          <Command>
            <CommandList>
              <CommandGroup className=''>
                <CommandItem
                  key={1}
                  value={''}
                  className='w-auto'
                  onSelect={(currentValue) => {
                    setIsOpen(!isOpen);
                    onChange(currentValue);
                    setValue(currentValue);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === '' ? 'opacity-100' : 'opacity-0')} />
                  All Year
                </CommandItem>
                <CommandItem
                  key={0}
                  value={'1st year'}
                  className='w-auto'
                  onSelect={(currentValue) => {
                    setIsOpen(!isOpen);
                    onChange(currentValue);
                    setValue(currentValue);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === '1st year' ? 'opacity-100' : 'opacity-0')} />
                  1st Year
                </CommandItem>
                <CommandItem
                  key={1}
                  value={'2nd year'}
                  className='w-auto'
                  onSelect={(currentValue) => {
                    setIsOpen(!isOpen);
                    onChange(currentValue);
                    setValue(currentValue);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === '2nd year' ? 'opacity-100' : 'opacity-0')} />
                  2nd Year
                </CommandItem>
                <CommandItem
                  key={1}
                  value={'3rd year'}
                  className='w-auto'
                  onSelect={(currentValue) => {
                    setIsOpen(!isOpen);
                    onChange(currentValue);
                    setValue(currentValue);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === '3rd year' ? 'opacity-100' : 'opacity-0')} />
                  3rd Year
                </CommandItem>
                <CommandItem
                  key={1}
                  value={'4th year'}
                  className='w-auto'
                  onSelect={(currentValue) => {
                    setIsOpen(!isOpen);
                    onChange(currentValue);
                    setValue(currentValue);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === '4th year' ? 'opacity-100' : 'opacity-0')} />
                  4th Year
                </CommandItem>
                <CommandItem
                  key={1}
                  value={'5th year'}
                  className='w-auto'
                  onSelect={(currentValue) => {
                    setIsOpen(!isOpen);
                    onChange(currentValue);
                    setValue(currentValue);
                  }}
                >
                  <Check className={cn('mr-2 h-4 w-4', value === '5th year' ? 'opacity-100' : 'opacity-0')} />
                  5th Year
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default YearFilter;
