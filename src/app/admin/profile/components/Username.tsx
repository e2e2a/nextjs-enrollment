'use client';
import { Icons } from '@/components/shared/Icons';
import React, { useEffect, useState } from 'react';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { UsernameValidator } from '@/lib/validators/user/update/username';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useNewUsernameMutation } from '@/lib/queries/user/update/username';

type IProps = {
  profile: any;
};

const Username = ({ profile }: IProps) => {
  const [showInputUsername, setShowUsernameInput] = useState(false);
  const mutation = useNewUsernameMutation();
  const form = useForm<z.infer<typeof UsernameValidator>>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      username: '',
    },
  });
  
  form.watch('username');

  useEffect(() => {
    form.setValue('username', `${profile.userId.username}`);
  }, [form,profile]);
  
  const onChange = () => {
    setShowUsernameInput(!showInputUsername);
  };

  const onSubmit: SubmitHandler<z.infer<typeof UsernameValidator>> = async (data) => {
    if (data.username === profile.userId.username) return;
    mutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setShowUsernameInput(!showInputUsername);
            form.reset();
            makeToastSucess(res.message);
            return;
          default:
            if (res.error) return makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        //   setIsNotEditable(false);
      },
    });
  };

  return (
    <div className='flex flex-row gap-x-2 w-full items-center justify-center group'>
      {showInputUsername ? (
        <>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='w-2/3 space-y-1'>
              <FormField
                control={form.control}
                name={'username'}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className={`relative`}>
                        <input
                          type={'text'}
                          id={'username'}
                          className={` block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-slate-50 border border-gray-200 appearance-nonefocus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom`}
                          onDragStart={(e) => e.preventDefault()}
                          placeholder=''
                          {...field}
                        />
                        <label
                          htmlFor={'username'}
                          className='text-black absolute cursor-text text-md select-none text-muted-foreground duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
                        >
                          Username
                        </label>
                      </div>
                    </FormControl>
                    <FormMessage className='text-red pl-2' />
                  </FormItem>
                )}
              />
              <div className='flex'>
                <Button type='button' size={'sm'} variant={'outline'} onClick={onChange} className='focus-visible:ring-0 text-xs hover:bg-red hover:text-neutral-50'>
                  Cancel
                </Button>
                <Button type='submit' size={'sm'} variant={'outline'} className='focus-visible:ring-0 text-xs hover:bg-green-500 hover:text-neutral-50'>
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </>
      ) : (
        <>
          <p className='small-regular md:body-medium text-light-3 text-center'>@{profile.userId.username}</p>
          <div className='hidden group-hover:flex'>
            <Icons.squarePen className='h-4 w-4 text-blue-600 cursor-pointer' onClick={onChange} />
          </div>
        </>
      )}
    </div>
  );
};

export default Username;
