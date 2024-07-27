'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SignupValidator } from '@/lib/validators/Validator';
import { useSignUpMutation } from '@/lib/queries';
import CardWrapper from '@/components/shared/CardWrapper';
import { FormMessageDisplay } from '@/components/shared/FormMessageDisplay';

const SignUpForm = () => {
  const [isPending, setIsPending] = useState(false);
  const [message, setMessage] = useState<string | undefined>('');
  const [typeMessage, setTypeMessage] = useState('');

  const mutation = useSignUpMutation();
  const form = useForm<z.infer<typeof SignupValidator>>({
    resolver: zodResolver(SignupValidator),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      CPassword: '',
    },
  });
  const onSubmit = async (data: z.infer<typeof SignupValidator>) => {
    setIsPending(true);

    mutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            console.log('res',res)
            setTypeMessage('success');
            setMessage(res?.message);
            if (!res.token) {
              // return router.push('/sign-up');
              return;
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
    <CardWrapper className={'my-16'} headerLabel='Create an Account' backButtonHref='/sign-in' backButtonLabel='Already have an account?' showSocial>
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
            {/* <FormField
              control={form.control}
              name='firstname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder='Enter Firstname' className='bg-gray-50' />
                  </FormControl>
                  <FormMessage className='text-red' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='lastname'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lastname</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder='Enter Lastname' className='bg-gray-50' />
                  </FormControl>
                  <FormMessage className='text-red' />
                </FormItem>
              )}
            /> */}
            <FormField
              control={form.control}
              name='username'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder='Enter Username' className='bg-gray-50' />
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
            <FormField
              control={form.control}
              name='CPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder='********' type='password' className='bg-gray-50' />
                  </FormControl>
                  <FormMessage className='text-red' />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' disabled={isPending} className='w-full bg-blue-600 hover:bg-blue-700 text-white'>
            Sign Up
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default SignUpForm;
