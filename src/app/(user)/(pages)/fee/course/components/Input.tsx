import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React from 'react';
interface IProps {
  name: string;
  type: string;
  form: any;
  label: string;
  classNameInput?: string;
}
const Input = ({ name, type, form, label, classNameInput }: IProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className={`flex flex-row-reverse`}>
              <input type={type} id={name} className={` border-0 cursor-default select-none w-full ${classNameInput} text-md bg-transparent px-3`} onDragStart={(e) => e.preventDefault()} placeholder='' {...field} />
              <label htmlFor={name} className={`text-nowrap px-1 text-normal font-medium text-md py-2 `}>
                {label}
              </label>
            </div>
          </FormControl>
          <FormMessage className='text-red pl-2' />
        </FormItem>
      )}
    />
  );
};

export default Input;
