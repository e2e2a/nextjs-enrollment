'use client';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useNewPasswordMutation } from '@/lib/queries/user/password';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { NewPasswordValidator } from '@/lib/validators/user/password';
import { zodResolver } from '@hookform/resolvers/zod';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLoading } from '../../logout/LoadingContext';

const PasswordTab = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { setLoading } = useLoading();
  const mutation = useNewPasswordMutation();

  const form = useForm<z.infer<typeof NewPasswordValidator>>({
    resolver: zodResolver(NewPasswordValidator),
    defaultValues: {
      currentPassword: '',
      password: '',
      CPassword: '',
    },
  });

  const onSubmit = async (data: z.infer<typeof NewPasswordValidator>) => {
    mutation.mutate(data, {
      onSuccess: async (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsOpen(false);
            setLoading(true);
            signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL, redirect: true });
            return;
          case 400:
          case 401:
          case 402:
          case 403:
            if (res.error) return form.setError('currentPassword', { message: res.error });
            return;
          default:
            setLoading(false);
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        // setIsPending(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className='w-full' asChild>
        <Button className='hover:bg-slate-300 w-full rounded-md gap-2 justify-between items-center text-[16px] p-2'>
          <div className='flex items-center gap-2'>
            <div className='rounded-full bg-slate-200 p-1'>
              <Icons.settings />
            </div>
            New password
          </div>
        </Button>
      </DialogTrigger>
      <Form {...form}>
        <DialogContent className='rounded-md max-w-[500px] bg-sky-50'>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <DialogHeader>
              <span className='font-normal text-[15px] select-none'>
                {session?.user.firstname} {session?.user.lastname}
                <span className=' text-[8px] align-middle'> • </span>e2e2a
              </span>
              <DialogTitle className='text-[22px] font-bold text tracking-normal'>New Password</DialogTitle>
              <DialogDescription>Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%).</DialogDescription>
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
                        Re-type new password
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

export default PasswordTab;
