import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React from 'react';
interface IProps {
  name: string;
  type: string;
  form: any;
  label: string;
  disabled?: boolean;
  classNameInput?: string;
}
const Input = ({ name, type, form, label, disabled, classNameInput }: IProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className={`relative`}>
              <input
                type={type}
                disabled={disabled}
                id={name}
                className={`${classNameInput} ${disabled ? 'cursor-not-allowed bg-slate-200' : 'bg-slate-50'} block capitalize rounded-xl px-5 pb-2 pt-7 w-full text-sm  border border-gray-200 appearance-nonefocus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom`}
                onDragStart={(e) => e.preventDefault()}
                placeholder=''
                {...field}
              />
              <label
                htmlFor={name}
                className='text-black absolute cursor-text text-md select-none text-muted-foreground duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
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
};

export default Input;
