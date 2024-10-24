'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { EmailValidator } from '@/lib/validators/Validator';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import Input from './Input';
import Image from 'next/image';

const EmailTab = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const { data } = useSession();
  const session = data?.user;
  
  const form = useForm<z.infer<typeof EmailValidator>>({
    resolver: zodResolver(EmailValidator),
    defaultValues: {
      email: `${session?.email}`,
    },
  });
  
  return (
    <Form {...form}>
      <Card className='pb-8'>
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
          {/* <Button type='submit' disabled={isPending} className=' bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide' onClick={form.handleSubmit(onSubmit)}> */}
          <Button type='submit' disabled={isPending} className=' bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide'>
            {isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Save'}
          </Button>
        </CardFooter>
      </Card>
    </Form>
  );
};

export default EmailTab;
