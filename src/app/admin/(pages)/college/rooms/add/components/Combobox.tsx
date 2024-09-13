'use client';
import * as React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IProps {
  name: string;
  form: any;
  label: string;
  selectItems: any;
  placeholder: string;
  value: any;
  setValue: React.Dispatch<React.SetStateAction<string>>,
}

export function Combobox({ form, name, label, selectItems, placeholder, value, setValue }: IProps) {
  const [open, setOpen] = React.useState(false);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className='relative bg-slate-50 rounded-lg'>
              <Popover open={open} onOpenChange={setOpen}>
                {/* <PopoverTrigger asChild className='w-full pt-14 pb-8 text-left text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'> */}
                <PopoverTrigger asChild className='w-full pt-10 pb-4 text-left text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                  <Button variant='outline' role='combobox' aria-expanded={open} className='w-full capitalize justify-between font-normal'>
                    {/* {value ? frameworks.find((framework) => framework.value === value)?.label : 'Select framework...'} */}
                    {value
                      ? (() => {
                          const selectedItem = selectItems.find((item: any) => item.value === value);
                          if (selectedItem) {
                            return `${selectedItem.value} `;
                          }
                          return placeholder;
                        })()
                      : placeholder}
                    <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className=' p-0  bg-white w-full flex border-gray-300 '>
                  <Command className='w-full'>
                    <CommandInput placeholder='Search Teacher...' />
                    <CommandList className='w-full max-h-[200px]'>
                      <CommandEmpty>No Room Type Result...</CommandEmpty>
                      <CommandGroup className='w-full'>
                        {selectItems.map((item: any, index: any) => (
                          <CommandItem
                            key={index}
                            value={item.value}
                            className='w-auto'
                            onSelect={(currentValue) => {
                              setValue(currentValue === value ? '' : currentValue);
                              field.onChange(currentValue);
                              setOpen(false);
                            }}
                          >
                            <Check className={cn('mr-2 h-4 w-4', value === item.value ? 'opacity-100' : 'opacity-0')} />
                            {item.title}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <label
                htmlFor={name}
                className={`pointer-events-none bg-transparent absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
              >
                {label}
              </label>
            </div>
          </FormControl>
          <FormMessage className='text-red pl-2' />
        </FormItem>
      )}
    />
  );
}
