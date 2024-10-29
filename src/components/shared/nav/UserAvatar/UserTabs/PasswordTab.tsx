'use client';
import { Icons } from '@/components/shared/Icons';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useNewPasswordMutation } from '@/lib/queries/user/update/password';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { NewPasswordValidator } from '@/lib/validators/user/update/password';
import { zodResolver } from '@hookform/resolvers/zod';
import { signOut, useSession } from 'next-auth/react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLoading } from '../../logout/LoadingContext';
import Input from './Input';
import Image from 'next/image';

const PasswordTab = () => {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
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
    setIsPending(true);
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
        setIsPending(false);
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
        <DialogContent className='rounded-md max-w-[500px] bg-white'>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <DialogHeader>
              <span className='font-normal text-[15px] select-none'>
                {session?.user.firstname} {session?.user.lastname}
                <span className=' text-[8px] align-middle'> • </span>
                {session?.user?.username}
              </span>
              <DialogTitle className='text-[22px] font-bold text tracking-normal'>New Password</DialogTitle>
              <DialogDescription>Your password must be at least 6 characters and should include a combination of numbers, letters and special characters (!$@%).</DialogDescription>
            </DialogHeader>
            <Input type='password' form={form} name={'currentPassword'} label={'Current password'} />
            <Input type='password' form={form} name={'password'} label={'New password'} />
            <Input type='password' form={form} name={'CPassword'} label={'Re-type new password'} />
            <DialogFooter>
              <Button type='submit' size={'sm'} autoFocus={false} className='bg-blue-600 w-auto px-3 flex-col ' disabled={isPending}>
                <span className=' text-white text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Save'}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Form>
    </Dialog>
  );
};

export default PasswordTab;
