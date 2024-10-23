'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { NewPasswordValidator } from '@/lib/validators/Validator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { Icons } from '@/components/shared/Icons';
import Input from './Input';
import Image from 'next/image';

const PasswordTab = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { data } = useSession();
  const session = data?.user;
  const form = useForm<z.infer<typeof NewPasswordValidator>>({
    resolver: zodResolver(NewPasswordValidator),
    defaultValues: {
      currentPassword: '',
      password: '',
      CPassword: '',
    },
  });
  const onSubmit = async (data: z.infer<typeof NewPasswordValidator>) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <Card className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
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
          <Button type='submit' disabled={isPending} className=' bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide' onClick={form.handleSubmit(onSubmit)}>
            {isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Save'}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
};

export default PasswordTab;
