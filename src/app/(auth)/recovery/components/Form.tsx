'use client';
import CardWrapper from '@/components/shared/CardWrapper';
import { FormMessageDisplay } from '@/components/shared/FormMessageDisplay';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRecoveryMutation } from '@/lib/queries';
import { RecoveryValidator } from '@/lib/validators/Validator';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const RecoveryForm = () => {
  const [message, setMessage] = useState<string | undefined>('');
  const [typeMessage, setTypeMessage] = useState('');
  const [isPending, setIsPending] = useState(false);
  const mutation = useRecoveryMutation();
  const form = useForm<z.infer<typeof RecoveryValidator>>({
    resolver: zodResolver(RecoveryValidator),
    defaultValues: {
      email: '',
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof RecoveryValidator>> = async (data) => {
    setIsPending(true);
    mutation.mutate(data, {
      onSuccess: (res) => {
        if (res.error) {
          setMessage(res.error);
          setTypeMessage('error');
          return;
        }
        setMessage(res.message);
        setTypeMessage('success');
        return (window.location.href = `/verification?token=${res.token}`);
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
          </div>
          <Button type='submit' disabled={isPending} className='w-full bg-blue-600 hover:bg-blue-700 text-white tracking-wider'>
            Find Email
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RecoveryForm;
