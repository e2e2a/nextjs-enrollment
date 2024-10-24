'use client';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { NewPasswordValidator } from '@/lib/validators/user/password';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const EmailTab = () => {
  const { data } = useSession();
  const form = useForm<z.infer<typeof NewPasswordValidator>>({
    resolver: zodResolver(NewPasswordValidator),
    defaultValues: {
      currentPassword: '1',
      password: '',
      CPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof NewPasswordValidator>) => {
    // console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger className='w-full rounded-none' asChild>
        <Button className='hover:bg-slate-300 w-full justify-start text-[16px] h-[60px] bg-slate-200 rounded-t-lg border-b border-gray-300'>
          <div className='grid text-start '>
            <span className='font-semibold'>Email address</span>
            <span className='text-muted-foreground text-sm'>marzvelasco73019@gmail.com</span>
          </div>
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <DialogContent className='rounded-md max-w-[500px] bg-sky-50'>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <DialogHeader>
              <span className='font-normal text-[15px] select-none'>
                {data?.user.firstname} {data?.user.lastname}
                <span className=' text-[8px] align-middle'> • </span>e2e2a
              </span>
              <DialogTitle className='text-[22px] font-bold text tracking-normal'>EmailTab</DialogTitle>
              <DialogDescription>
                Your password must be at least 6 characters and should include a combination of numbers, letters and special
                characters (!$@%).
              </DialogDescription>
            </DialogHeader>
            <FormField
              control={form.control}
              name='currentPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <input
                        type='password'
                        id='currentPassword'
                        className='block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-white border border-gray-200 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom'
                        placeholder=' '
                        {...field}
                      />
                      <label
                        htmlFor='currentPassword'
                        className='absolute text-sm text-muted-foreground duration-200 transform -translate-y-2.5 scale-90 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-2.5'
                      >
                        Current password
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className='text-red pl-2' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <input
                        type='password'
                        id='password'
                        className='block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-white border border-gray-200 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom'
                        placeholder=' '
                        {...field}
                      />
                      <label
                        htmlFor='password'
                        className='absolute text-sm text-muted-foreground duration-200 transform -translate-y-2.5 scale-90 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-2.5'
                      >
                        New password
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className='text-red pl-2' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='CPassword'
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative'>
                      <input
                        type='password'
                        id='CPassword'
                        className='block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-white border border-gray-200 appearance-none dark:text-white focus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom'
                        placeholder=' '
                        {...field}
                      />
                      <label
                        htmlFor='CPassword'
                        className='absolute text-sm text-muted-foreground duration-200 transform -translate-y-2.5 scale-90 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-90 peer-focus:-translate-y-2.5'
                      >
                        Confirm password
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className='text-red pl-2' />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};

export default EmailTab;
