'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import Input from './Input';
import Image from 'next/image';
import { EmailValidator } from '@/lib/validators/user/update/email';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useNewEmailMutation } from '@/lib/queries/user/update/email';

const EmailTab = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const mutation = useNewEmailMutation();
  const { data } = useSession();
  const session = data?.user;
  const form = useForm<z.infer<typeof EmailValidator>>({
    resolver: zodResolver(EmailValidator),
    defaultValues: {
      email: `${session?.email}`,
    },
  });

  const onSubmit = async (data: z.infer<typeof EmailValidator>) => {
    setIsPending(true);
    mutation.mutate(data, {
      onSuccess: async (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res.message);
            window.location.href = `/verification?token=${res.token.token}`;
            return;
          case 400:
          case 401:
          case 402:
          case 403:
            if (res.error) return form.setError('email', { message: res.error });
            return;
          default:
            setIsPending(false);
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {},
    });
  };
  return (
    <Form {...form}>
      <Card className='pb-8'>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <CardHeader>
            <CardTitle className=''>
              <div className='flex justify-center w-full'>
                <h1 className='text-3xl font-semibold tracking-wide text-center'>Email</h1>
              </div>
              <CardDescription className='text-sm font-normal w-full text-center'>Change your email address here. After saving, you&apos;ll receive a confirmation email.</CardDescription>
            </CardTitle>
          </CardHeader>
          <CardContent className='space-y-2'>
            <Input isNotEditable={isNotEditable} name={'email'} type={'email'} form={form} label={'Email:'} />
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

export default EmailTab;
