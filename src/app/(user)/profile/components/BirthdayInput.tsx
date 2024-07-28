import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import React from 'react';

interface IProps {
  name: string;
  isNotEditable: boolean;
  form: any;
  label: string;
  classNameInput?: string;
}

export function BirthdayInput({ form, name, label, isNotEditable, classNameInput }: IProps) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className={`${isNotEditable ? 'flex flex-row-reverse' : 'relative'}`}>
              <Popover>
                <PopoverTrigger asChild>
                  {isNotEditable ? (
                    <div className='w-full text-sm flex items-center font-medium text-black'>{field.value ? format(field.value, 'PPP') : form.control.defaultValues.birthday}</div>
                  ): (
                    <Button
                      variant={'outline'}
                      disabled={isNotEditable}
                      className={`text-left font-normal text-black rounded-xl flex px-5 pb-5 pt-9 w-full text-sm bg-white border border-gray-200 focus:outline-none focus:ring-0 focus:border-gray-400 pl-4 align-text-bottom`}
                    >
                      <span className='text-sm text-black font-bold'>
                        {field.value ? format(field.value, 'PPP') : form.control.defaultValues.birthday}
                      </span>
                      <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                    </Button>
                  ) }
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0 bg-white' align='start'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <label
                htmlFor={name}
                className={`text-nowrap ${
                  isNotEditable
                    ? 'px-3 text-normal font-normal text-md py-2'
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

export default BirthdayInput;
