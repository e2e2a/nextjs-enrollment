'use client';
import * as React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IProps {
  name: string;
  form: any;
  label: string;
  selectItems: any;
  placeholder: string;
}

export function SelectInput({ form, name, label, selectItems, placeholder }: IProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className='relative bg-slate-50 rounded-lg'>
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger id={name} className='w-full pt-10 pb-4 text-left capitalize text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className='bg-white border-gray-300'>
                  <SelectGroup>
                    {selectItems.length > 0 ? (
                      selectItems.map((item: any, index: any) => {
                        return (
                          <SelectItem value={item.value || item.title} key={index} className='capitalize'>
                            {item.title}
                          </SelectItem>
                        );
                      })
                    ) : (
                      <div className=''>No Results.</div>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label
                htmlFor={name}
                className={`pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
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
