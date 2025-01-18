'use client';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import CardWrapper from '@/components/shared/CardWrapper';
import { FormMessageDisplay } from '@/components/shared/FormMessageDisplay';
import { useSignInMutation } from '@/lib/queries/auth/signIn';
import { SigninValidator } from '@/lib/validators/auth/signIn';
import SocialFooter from '@/components/shared/auth/SocialFooter';

const SignInForm = () => {
  const [message, setMessage] = useState<string | undefined>('');
  const [typeMessage, setTypeMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const mutation = useSignInMutation();

  const form = useForm<z.infer<typeof SigninValidator>>({
    resolver: zodResolver(SigninValidator),
    shouldFocusError: true,
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: z.infer<typeof SigninValidator>) => {
    // const onSubmit: SubmitHandler<z.infer<typeof SigninValidator>> = async (data: any) => {
    setIsPending(true);
    mutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            if (!res.token) {
              setTypeMessage('success');
              setMessage(res?.message);
              if (res.role === 'ADMIN') {
                window.location.href = '/admin';
              } else if (res.role === 'STUDENT') {
                window.location.href = '/';
              } else if (res.role === 'TEACHER') {
                window.location.href = '/instructor';
              } else if (res.role === 'DEAN') {
                window.location.href = '/dean';
              } else if (res.role === 'ACCOUNTING') {
                window.location.href = '/accounting';
              }
              return;
            }
            return (window.location.href = `/verification?token=${res.token}`);
          default:
            setIsPending(false);
            setMessage(res.error);
            setTypeMessage('error');
            return;
        }
      },
      onSettled: () => {},
    });
  };
  return (
    <CardWrapper header={'Sign In'} headerLabel='Welcome Back' backButtonHref='/sign-up' backButtonLabel="Don't have an account?">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} method='POST' className='space-y-6'>
          <div className='space-y-4'>
            {message && <FormMessageDisplay message={message} typeMessage={typeMessage} />}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder='example@gmail.com' type='email' className='bg-gray-50' />
                  </FormControl>
                  <FormMessage className='text-red' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder='********' type='password' className='bg-gray-50' />
                  </FormControl>
                  <FormMessage className='text-red' />
                </FormItem>
              )}
            />
          </div>
          <Button type='button' variant='link' className='font-normal w-full text-indigo-500 text-center flex justify-end items-center' size='sm'>
            <Link href={'/recovery'} className=''>
              Forgot Password?
            </Link>
          </Button>
          <Button type='submit' disabled={isPending} className='w-full bg-blue-600 hover:bg-blue-700 text-white'>
            Sign In
          </Button>
        </form>
      </Form>
      <div className='mt-5'>
        <SocialFooter isPending={isPending} setIsPending={setIsPending} />
      </div>
    </CardWrapper>
  );
};

export default SignInForm;
