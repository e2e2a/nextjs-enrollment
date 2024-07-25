'use client';
import CardWrapper from '@/components/shared/CardWrapper';
import { FormMessageDisplay } from '@/components/shared/FormMessageDisplay';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useNewPasswordMutation, useRecoveryTokenCheckQuery } from '@/lib/queries';
import { NewPasswordValidator } from '@/lib/validators/Validator';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const ResetPasswordForm = () => {
  const [message, setMessage] = useState<string | undefined>('');
  const [typeMessage, setTypeMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const mutation = useNewPasswordMutation();

  const token = searchParams.get('token') ?? '';
  const { data: result, error } = useRecoveryTokenCheckQuery(token);
  
  useEffect(() => {
    if (error) {
      router.push('/recovery');
      return;
    }
    if (result) {
      if (result.error) return router.push('/recovery');
      setLoading(false);
    }
  }, [result,error,router]);

  const form = useForm<z.infer<typeof NewPasswordValidator>>({
    resolver: zodResolver(NewPasswordValidator),
    defaultValues: {
      /**
       * @todo add this
       */
      // currentPassword: '1',
      password: '',
      CPassword: '',
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof NewPasswordValidator>> = async (data) => {
    setIsPending(true);
    const newData = {
      ...data,
      email: result?.token?.email,
    };
    mutation.mutate(newData, {
      onSuccess: (res) => {
        if (res.error) {
          setMessage(res.error);
          setTypeMessage('error');
          return;
        }
        setMessage(res.message);
        setTypeMessage('success');
        return (window.location.href = `/sign-in`);
      },

      onSettled: () => {
        setIsPending(false);
      },
    });
  };
  return (
    <CardWrapper
      headerLabel='Enter your email to reset your password.'
      backButtonHref='/sign-in'
      backButtonLabel='Go back to signin?'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
          <div className='space-y-4'>
            {message && <FormMessageDisplay message={message} typeMessage={typeMessage} />}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={isPending} placeholder='password' type='password' className='bg-gray-50' />
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
                    <Input {...field} disabled={isPending} placeholder='password' type='password' className='bg-gray-50' />
                  </FormControl>
                  <FormMessage className='text-red' />
                </FormItem>
              )}
            />
          </div>
          <Button type='submit' disabled={isPending} className='w-full bg-blue-600 hover:bg-blue-700 text-white tracking-wider'>
            Create New Password
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default ResetPasswordForm;
