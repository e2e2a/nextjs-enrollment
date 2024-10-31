'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { signOut, useSession } from 'next-auth/react';
import Input from './Input';
import Image from 'next/image';
import { NewPasswordValidator } from '@/lib/validators/user/update/password';
import { useLoading } from '@/components/shared/nav/logout/LoadingContext';
import { useNewPasswordMutation } from '@/lib/queries/user/update/session/password';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';

const PasswordTab = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { setLoading } = useLoading();
  const mutation = useNewPasswordMutation();

  const form = useForm<z.infer<typeof NewPasswordValidator>>({
    resolver: zodResolver(NewPasswordValidator),
    defaultValues: { currentPassword: '', password: '', CPassword: '' },
  });

  const onSubmit = async (data: z.infer<typeof NewPasswordValidator>) => {
    setIsPending(true);
    mutation.mutate(data, {
      onSuccess: async (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res.message);
            setLoading(true);
            signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL, redirect: true });
            return;
          case 400:
          case 401:
          case 402:
          case 403:
          case 404:
            if (res.error) {
              setIsPending(false);
              setLoading(false);
              form.setError('currentPassword', { message: res.error });
              return;
            }
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
    <Form {...form}>
      <Card className='space-y-4'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <CardHeader>
            <CardTitle className='py-3'>
              <div className='flex '>
                <div className='flex justify-center w-full'>
                  <h1 className='text-3xl font-semibold tracking-wide text-center'>Password</h1>
                </div>
              </div>
              <CardDescription className='text-sm font-normal w-full text-center'>Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2 '>
            <Input isNotEditable={isNotEditable} name={'currentPassword'} type={'password'} form={form} label={'Current Password'} />
            <Input isNotEditable={isNotEditable} name={'password'} type={'password'} form={form} label={'New Password'} />
            <Input isNotEditable={isNotEditable} name={'CPassword'} type={'password'} form={form} label={'Re-type new password'} />
          </CardContent>
          <CardFooter className='w-full flex justify-center items-center '>
            <Button type='submit' disabled={isPending} className=' bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide'>
              {isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Save'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </Form>
  );
};

export default PasswordTab;
