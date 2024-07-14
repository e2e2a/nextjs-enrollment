'use client';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { SigninValidator } from '@/lib/validators/Validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSignInMutation } from '@/lib/queries';
import CardWrapper from '@/components/shared/CardWrapper';
import { FormMessageDisplay } from '@/components/shared/FormMessageDisplay';

const SignInForm = () => {
  const searchParams = useSearchParams();
  const urlError = searchParams.get('error') === 'OAuthAccountNotLinked' ? 'Email Error provider' : '';
  const [message, setMessage] = useState<string | undefined>('');
  const [typeMessage, setTypeMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const mutation = useSignInMutation();

  const form = useForm<z.infer<typeof SigninValidator>>({
    resolver: zodResolver(SigninValidator),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof SigninValidator>> = async (data) => {
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
              return (window.location.href = '/admin');
            }
            return (window.location.href = `/verification?token=${res.token}`);
          default:
            setMessage(res.error);
            setTypeMessage('error');
            return;
        }
      },

      onSettled: () => {
        setIsPending(false);
      },
    });
  };
  return (
    <CardWrapper headerLabel='Welcome Back' backButtonHref='/sign-up' backButtonLabel="Don't have an account?" showSocial>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
          <Button
            variant='link'
            className='font-normal w-full text-indigo-500 text-center flex justify-end items-center'
            size='sm'
          >
            <Link href={'/recovery'} className=''>
              Forgot Password?
            </Link>
          </Button>
          <Button type='submit' disabled={isPending} className='w-full bg-blue-600 hover:bg-blue-700 text-white'>
            Sign In
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SignInForm;
