'use client';
import * as React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

interface IProps {
  selectItems: any;
  placeholder: string;
  selectedCourse: string;
  isCourseError: string;
  setSelectedCourse: React.Dispatch<React.SetStateAction<string>>;
}

export function SelectCourse({ selectItems, placeholder, selectedCourse, isCourseError, setSelectedCourse }: IProps) {
  return (
    <div className='relative bg-slate-50 rounded-lg'>
      <Select onValueChange={setSelectedCourse} value={selectedCourse}>
        <SelectTrigger id={'Course name'} className='w-full pt-10 pb-4 capitalize text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className='bg-white border-gray-300'>
          <SelectGroup>
            {selectItems &&
              selectItems.map((item: any, index: any) => {
                return item.name ? (
                  <SelectItem value={item.courseCode} key={index} className='capitalize'>
                    {item.name}
                  </SelectItem>
                ) : (
                  <SelectItem value={item.title} key={index} className='capitalize'>
                    {item.title}
                  </SelectItem>
                );
              })}
          </SelectGroup>
        </SelectContent>
      </Select>
      <label
        className={`pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
      >
        Select course
      </label>
      <p className='text-sm font-medium text-destructive text-red pl-2'>{isCourseError}</p>
    </div>
  );
}
