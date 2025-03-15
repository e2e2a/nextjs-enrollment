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
  setTeacherId?: React.Dispatch<React.SetStateAction<string>>;
  setRole?: React.Dispatch<React.SetStateAction<string>>;
}

export function Combobox({ form, name, label, selectItems, placeholder, setTeacherId, setRole }: IProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
  const getFullName = (item: any) => {
    return item?.extensionName ? `${item?.firstname ?? ''} ${item?.middlename ?? ''} ${item?.lastname ?? ''} ${item?.extensionName ?? ''}` : `${item?.firstname ?? ''} ${item?.middlename ?? ''} ${item?.lastname ?? ''}`;
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
                          const selectedItem = selectItems.find((item: any) => getFullName(item) === field.value);
                          if (selectedItem) {
                            const fullName = selectedItem.extensionName
                              ? `${selectedItem?.firstname ?? ''} ${selectedItem?.middlename ?? ''} ${selectedItem?.lastname ?? ''} ${selectedItem?.extensionName ?? ''}`
                              : `${selectedItem?.firstname ?? ''} ${selectedItem?.middlename ?? ''} ${selectedItem?.lastname ?? ''}`;
                            return `${fullName}`;
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
                      <CommandEmpty>No Instructors found.</CommandEmpty>
                      <CommandGroup className='w-full'>
                        {selectItems.map((item: any, index: any) => {
                          const fullName = item?.extensionName ? `${item?.firstname ?? ''} ${item?.middlename ?? ''} ${item?.lastname ?? ''} ${item?.extensionName ?? ''}` : `${item?.firstname ?? ''} ${item?.middlename ?? ''} ${item?.lastname}`;
                          return (
                            <CommandItem
                              key={index}
                              value={fullName}
                              className='w-auto'
                              onSelect={(currentValue) => {
                                setValue(currentValue === value ? '' : currentValue);
                                if (setTeacherId) {
                                  setTeacherId(item?._id);
                                }
                                if (setRole) {
                                  setRole(item?.userId?.role);
                                }
                                field.onChange(currentValue);
                                setOpen(false);
                              }}
                            >
                              <Check className={cn('mr-2 h-4 w-4', field.value === getFullName(item) ? 'opacity-100' : 'opacity-0')} />
                              <div className='flex gap-2 items-center'>
                                <div className=''>
                                  <Image className='h-9 w-9' src={item?.imageUrl ? item?.imageUrl : '/icons/profile-placeholder.svg'} alt={item?.firstname} width={10} height={10} />
                                </div>
                                <div className='flex flex-col capitalize'>
                                  {item?.extensionName ? `${item?.firstname ?? ''} ${item?.middlename ?? ''} ${item?.lastname ?? ''} ${item?.extensionName ?? ''}` : `${item?.firstname ?? ''} ${item?.middlename ?? ''} ${item?.lastname ?? ''}`}
                                  <div className=''>
                                    <span>Age: {item?.age}</span>
                                  </div>
                                  <div className=''>
                                    <span>Role: {item?.userId?.role}</span>
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
