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
  selectItems: any[];
  placeholder: string;
  scholarship: any;
}

export function SelectInput({ form, name, label, isNotEditable, classNameInput, selectItems, placeholder, scholarship }: IProps) {
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    const getVal = name;
    if (!scholarship) return;
    if (name === 'discountPercentage' && scholarship?.discountPercentage !== undefined) {
      const decimalValue = String(scholarship.discountPercentage); // Set as decimal string like "0.5"
      setValue(decimalValue);
      form.setValue(name, decimalValue);
    } else if (scholarship[name] !== undefined) {
      setValue(String(scholarship[name]));
      form.setValue(name, String(scholarship[name]));
    }
  }, [form, scholarship, name, isNotEditable]);
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className={`${isNotEditable ? 'flex flex-row-reverse ' : 'relative bg-slate-50 rounded-lg'}`}>
              {isNotEditable ? (
                <span className='w-full flex items-center uppercase font-semibold' id={name}>
                  {name === 'discountPercentage' ? `${parseFloat((Number(field?.value) * Number(100)).toFixed(0))}%` : field.value}
                </span>
              ) : (
                <Select
                  value={value}
                  onValueChange={(val) => {
                    setValue(val);
                    field.onChange(val);
                  }}
                >
                  <SelectTrigger id={name} className='w-full pt-10 pb-4 text-black rounded-xl focus:border-gray-400 ring-0 focus:ring-0 px-4 text-left capitalize '>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent className='bg-white border-gray-300'>
                    <SelectGroup className=''>
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
              )}
              <label
                className={`sm:text-nowrap w-auto ${
                  isNotEditable
                    ? 'px-1 text-normal text-left font-medium text-md py-2'
                    : ' pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
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
