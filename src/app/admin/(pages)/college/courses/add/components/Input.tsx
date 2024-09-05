import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React from 'react';
interface IProps {
  name: string;
  type: string;
  isNotEditable: boolean;
  form: any;
  label: string;
  classNameInput?: string;
}
const Input = ({ name, type, isNotEditable, form, label, classNameInput }: IProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className={`${isNotEditable ? 'flex flex-row-reverse' : 'relative'}`}>
              <input
                type={type}
                id={name}
                className={`capitalize block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-slate-50 border border-gray-200 appearance-nonefocus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom`}
                onDragStart={(e) => e.preventDefault()}
                disabled={isNotEditable}
                placeholder=''
                {...field}
              />
              <label
                htmlFor={name}
                className={`text-nowrap ${
                  isNotEditable
                    ? 'px-1 text-normal font-medium text-md py-2 '
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
};

export default Input;
