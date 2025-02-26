'use client';
import * as React from 'react';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import Image from 'next/image';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface IProps {
  name: string;
  form: any;
  label: string;
  selectItems: any;
  placeholder: string;
  setStudentId?: React.Dispatch<React.SetStateAction<string>>;
}

export function Combobox({ form, name, label, selectItems, placeholder, setStudentId }: IProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const getFullName = (item: any) => {
    return `${item?.lastname ? item?.lastname + ',' : ''} ${item?.firstname ?? ''} ${item?.middlename ?? ''}${item?.extensionName ? ', ' + item?.extensionName : ''}`.replace(/\s+,/g, ',').replace(/(\S),/g, '$1,').replace(/,(\S)/g, ', $1').trim();
  };

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className='relative bg-slate-50 rounded-lg'>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger id={name} asChild className='w-full pt-10 pb-4 text-left text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                  <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between font-normal capitalize'>
                    {value
                      ? (() => {
                          const selectedItem = selectItems.find((a: any) => {
                            const item = a?.profileId;
                            const b = `${item?.lastname ? item?.lastname + ',' : ''} ${item?.firstname ?? ''} ${item?.middlename ?? ''}${item?.extensionName ? ', ' + item?.extensionName : ''}`
                              .replace(/\s+,/g, ',')
                              .replace(/,(\S)/g, ', $1')
                              .replace(/\s+/g, ' ')
                              .trim();
                            return (
                              `${item?.lastname ? item?.lastname + ',' : ''} ${item?.firstname ?? ''} ${item?.middlename ?? ''}${item?.extensionName ? ', ' + item?.extensionName : ''}`
                                .replace(/\s+,/g, ',')
                                .replace(/,(\S)/g, ', $1')
                                .replace(/\s+/g, ' ')
                                .trim() === field.value
                            );
                          });
                          if (selectedItem) {
                            const item = selectedItem?.profileId;
                            return `${item?.lastname ? item?.lastname + ',' : ''} ${item?.firstname ?? ''} ${item?.middlename ?? ''}${selectedItem?.extensionName ? ', ' + item?.extensionName : ''}`
                              .replace(/\s+,/g, ',')
                              .replace(/,(\S)/g, ', $1')
                              .replace(/\s+/g, ' ')
                              .trim();
                          }
                          return placeholder;
                        })()
                      : placeholder}
                    <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className=' p-0 bg-white w-full flex border-gray-300 '>
                  <Command className='w-full'>
                    <CommandInput placeholder='Search Instructor...' />
                    <CommandList className='w-full'>
                      <CommandEmpty>No Student found.</CommandEmpty>
                      <CommandGroup className='w-full'>
                        {selectItems.map((item: any, index: any) => {
                          const name = `${item?.profileId?.lastname ? item?.profileId?.lastname + ',' : ''} ${item?.profileId?.firstname ?? ''} ${item?.profileId?.middlename ?? ''}${item?.profileId?.extensionName ? ', ' + item?.profileId?.extensionName : ''}`
                            .replace(/\s+,/g, ',')
                            .replace(/(\S),/g, '$1,')
                            .replace(/,(\S)/g, ', $1')
                            .trim();

                          return (
                            <CommandItem
                              key={index}
                              value={name}
                              className='w-auto'
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? '' : currentValue);
                                if (setStudentId) {
                                  setStudentId(item?.profileId?._id);
                                }
                                field.onChange(currentValue);
                                setOpen(false);
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', field.value === getFullName(item) ? 'opacity-100' : 'opacity-0')} />
                              <div className='flex gap-2 items-center'>
                                <div className=''>
                                  <Image className='h-9 w-9' src={item?.profileId?.imageUrl ? item?.profileId?.imageUrl : '/icons/profile-placeholder.svg'} alt={item?.profileId?.firstname} width={10} height={10} />
                                </div>
                                <div className='flex flex-col capitalize'>
                                  {name}
                                  <div className=''>
                                    <span>Age: {item?.profileId?.age}</span>
                                  </div>
                                </div>
                              </div>
                            </CommandItem>
                          );
                        })}
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
