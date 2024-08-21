'use client';
import * as React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';

interface IProps {
  name: string;
  form: UseFormReturn<any>; // Explicitly typing the form prop
  label: string;
  selectItems: { name: string }[];
  placeholder: string;
  asd: boolean,
  setIsScholarType?: React.Dispatch<React.SetStateAction<string | null>>;
  scholarType?: string | null;
}

export function SelectInput({
  form,
  name,
  label,
  selectItems,
  placeholder,
  scholarType,
  asd,
  setIsScholarType,
}: IProps) {
  const [isDisabled, setIsDisabled] = React.useState(false);
  const [data, setData] = React.useState('');

  React.useEffect(() => {
      if (scholarType && scholarType !== '' && scholarType !== 'None') {
        setData('Regular');
        setIsDisabled(true);
      } else {
        setData('');
        setIsDisabled(false);
      }
  }, [scholarType]);

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className='relative bg-slate-50 rounded-lg'>
              <Select
                disabled={isDisabled}
                onValueChange={(value) => {
                  console.log(value)
                  field.onChange(value);
                  console.log(data)
                  console.log('field.value', field.value)
                  if (asd) {
                    setData(value);
                  }
                }}
                value={data !== '' ? data : field.value }
              >
                <SelectTrigger
                  id={name}
                  className='w-full pt-10 pb-4 text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className='bg-white border-gray-300'>
                  <SelectGroup>
                    {selectItems.map((item, index) => (
                      <SelectItem
                        value={item.name}
                        key={index}
                        className='capitalize'
                      >
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label
                htmlFor={name}
                className='pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
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
