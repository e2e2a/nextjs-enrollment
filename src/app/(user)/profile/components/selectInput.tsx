'use client';
import * as React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IProps {
  name: string;
  isNotEditable: boolean;
  form: any;
  label: string;
  classNameInput?: string;
}

export function SelectInput({ form, name, label, isNotEditable, classNameInput }: IProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className={`${isNotEditable ? 'flex flex-row-reverse' : 'relative'}`}>
              {isNotEditable ? (
                <span className='w-full flex items-center'>{field.value.employmentStatus}</span>
              ) : (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className='w-full pt-10 pb-4 text-black rounded-xl focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                    <SelectValue placeholder='Select employment status' />
                  </SelectTrigger>
                  <SelectContent className='bg-white border-gray-300'>
                    <SelectGroup>
                      <SelectLabel>Options</SelectLabel>
                      <SelectItem value='option1'>Option 1</SelectItem>
                      <SelectItem value='option2'>Option 2</SelectItem>
                      <SelectItem value='option3'>Option 3</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              <label
                htmlFor={name}
                className={`text-nowrap text-right ${
                  isNotEditable
                    ? 'px-3 text-normal text-left font-normal text-md py-2'
                    : 'absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
                }`}
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
