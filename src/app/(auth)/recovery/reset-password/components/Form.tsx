'use client';
import CardWrapper from '@/components/shared/CardWrapper';
import { FormMessageDisplay } from '@/components/shared/FormMessageDisplay';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRPTokenQueryByParamsToken } from '@/lib/queries/tokens/resetPassword';
import { useResetPasswordMutation } from '@/lib/queries/tokens/resetPassword/password';
import { ResetPasswordValidator } from '@/lib/validators/resetPassword';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const ResetPasswordForm = () => {
  const [message, setMessage] = useState<string | undefined>('');
  const [typeMessage, setTypeMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const mutation = useResetPasswordMutation();

  const token = searchParams.get('token') ?? '';
  const { data: result, error } = useRPTokenQueryByParamsToken(token);

  useEffect(() => {
    if (error) {
      router.push('/recovery');
      return;
    }
    console.log('result', result);
    if (result) {
      if (result.error) return router.push('/recovery');
      setLoading(false);
    }
  }, [result, error, router]);

  const form = useForm<z.infer<typeof ResetPasswordValidator>>({
    resolver: zodResolver(ResetPasswordValidator),
    defaultValues: {
      password: '',
      CPassword: '',
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof ResetPasswordValidator>> = async (data) => {
    setIsPending(true);
    const newData = {
      ...data,
      token: token,
    };
    mutation.mutate(newData, {
      onSuccess: (res) => {
        if (res.error) {
          setIsPending(false);
          setMessage(res.error);
          setTypeMessage('error');
          return;
        }
        setMessage(res.message);
        setTypeMessage('success');
        return (window.location.href = `/sign-in`);
      },

      onSettled: () => {
        
      },
    });
  };
  return (
    <CardWrapper header={'Reset Password'} headerLabel='Enter your email to reset your password.' backButtonHref='/sign-in' backButtonLabel='Go back to signin?'>
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
