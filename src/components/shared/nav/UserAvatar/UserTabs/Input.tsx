import React from 'react';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';

type IProps = {
  form: any;
  type: string;
  name: string;
  label: string;
};

const Input = ({ form, type, name, label }: IProps) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <div className='relative'>
              <input
                type={type}
                id={name}
                className='block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-white border border-gray-200 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom'
                placeholder=' '
                {...field}
              />
              <label
                htmlFor='CPassword'
                className='absolute text-sm text-muted-foreground duration-200 transform -translate-y-2.5 scale-90 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-2.5'
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
