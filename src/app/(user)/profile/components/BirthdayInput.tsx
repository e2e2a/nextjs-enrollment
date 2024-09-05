import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format, isValid, parse, parseISO } from 'date-fns';
import React from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface IProps {
  name: string;
  isNotEditable: boolean;
  form: any;
  label: string;
  classNameInput?: string;
}

export function BirthdayInput({ name, isNotEditable, form, label, classNameInput }: IProps) {
  const [stringDate, setStringDate] = React.useState<string>('');
  const [date, setDate] = React.useState<Date>();
  // Handle date formatting for display
  const formatDate = (dateValue: any) => {
    if (dateValue) {
      const dateObject = typeof dateValue === 'string' ? parseISO(dateValue) : dateValue;
      return isValid(dateObject) ? format(dateObject, 'MM/dd/yyyy') : '';
    }
    return '';
  };
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className={`${isNotEditable ? 'flex flex-row-reverse' : 'relative'}`}>
              <Popover>
                <div className={`${isNotEditable ? 'flex w-full items-center' : 'relative w-full'}`}>
                  <input
                    type='text'
                    id={name}
                    value={stringDate ? stringDate : formatDate(field.value)}
                    // value={stringDate ? stringDate : undefined}
                    className={`
                    ${
                      isNotEditable
                        ? `border-0 cursor-default select-none w-full ${classNameInput} bg-transparent px-3`
                        : 'block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-slate-50 border border-gray-200 appearance-none focus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom'
                    }`}
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      setStringDate(inputValue);
                      const parsedDate = parse(inputValue, 'MM/dd/yyyy', new Date());
                      if (parsedDate.toString() === 'Invalid Date') {
                        setDate(undefined);
                        field.onChange(undefined); // Reset the field value
                      } else {
                        console.log('nice');
                        setDate(parsedDate);
                        field.onChange(parsedDate);
                        const formattedDate = format(parsedDate, 'MM/dd/yyyy');
                      }
                    }}
                    disabled={isNotEditable}
                  />
                  {/* {errorMessage && <div className='absolute bottom-[-1.75rem] left-0 text-red-400 text-sm text-red'>{errorMessage}</div>} */}
                  {!isNotEditable && (
                    <PopoverTrigger asChild>
                      <Button variant='outline' className={cn('font-normal border-0 rounded-xl h-full absolute right-0 translate-y-[-50%] top-[50%] rounded-l-none', !date && 'text-muted-foreground')}>
                        <CalendarIcon className='w-5 h-5 scale-100 hover:scale-150 hover:rotate-[360deg] transition-transform duration-200 hover:fill-gray-50 hover:stroke-sky-300' />
                      </Button>
                    </PopoverTrigger>
                  )}
                </div>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={date}
                    onSelect={(selectedDate) => {
                      if (!selectedDate) return;
                      setDate(selectedDate);
                      setStringDate(format(selectedDate, 'MM/dd/yyyy'));
                      // setErrorMessage('');
                      field.onChange(selectedDate); // Update the field value
                    }}
                    defaultMonth={date}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <label
                htmlFor={name}
                className={`text-nowrap ${
                  isNotEditable
                    ? 'px-1 text-normal font-medium text-md py-2'
                    : 'absolute cursor-text text-md select-none text-muted-foreground duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
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
