'use client';
import * as React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
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
  setRoomId?: React.Dispatch<React.SetStateAction<string>>;
}

export function ComboboxRoom({ form, name, label, selectItems, placeholder, setRoomId }: IProps) {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState('');
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
                  <Button variant='outline' role='combobox' aria-expanded={open} className='w-full justify-between font-normal'>
                    {field.value
                      ? (() => {
                          const selectedItem = selectItems.find((item: any) => item.roomName === field.value);
                          if (selectedItem) {
                            return <div className='capitalize'>{selectedItem.roomName}</div>;
                          }
                          return placeholder;
                        })()
                      : placeholder}
                    <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align='start' className=' p-0 bg-white w-full flex border-gray-300 '>
                  <Command className='w-full'>
                    <CommandInput placeholder='Search Room name...' />
                    <CommandList className='w-full'>
                      <CommandEmpty>No Rooms found.</CommandEmpty>
                      <CommandGroup className='w-full'>
                        {selectItems.length > 0 ? (
                          selectItems.map(
                            (item: any, index: any) =>
                              item.isRoomAvailable && (
                                <CommandItem
                                  key={index}
                                  value={item.roomName}
                                  className='w-auto capitalize'
                                  onSelect={(currentValue) => {
                                    setValue(currentValue === value ? '' : currentValue);
                                    if (setRoomId) {
                                      setRoomId(item._id);
                                    }
                                    field.onChange(currentValue);
                                    setOpen(false);
                                  }}
                                >
                                  <Check className={cn('mr-2 h-4 w-4', field.value === item.roomName ? 'opacity-100' : 'opacity-0')} />
                                  {item.roomName}
                                </CommandItem>
                              )
                          )
                        ) : (
                          <CommandEmpty>No Result Room.</CommandEmpty>
                        )}
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
