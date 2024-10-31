"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { Icons } from '@/components/shared/Icons';
import Input from './Input';
import { EmailValidator } from '@/lib/validators/user/update/email';

const EmailTab = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);
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
      <Card className='mb-8'>
        <CardHeader>
          <CardTitle className='py-3'>
            <div className='flex justify-between'>
              <h1>Email</h1>
              <div className='bg-slate-100 rounded-full py-1.5 px-2 cursor-pointer flex items-center gap-1' title='Edit'>
                <Icons.squarePen className='h-5 w-5 fill-white stroke-blue-600' />
                <span className='hidden sm:flex tracking-normal text-sm'>Edit</span>
              </div>
            </div>
            <CardDescription>Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-2'>
          <Input isNotEditable={isNotEditable} name={'email'} type={'email'} form={form} label={'Email'} />
        </CardContent>
        <CardFooter className='w-full flex justify-center items-center mt-3'>
          <Button className=' bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide'>Submit</Button>
        </CardFooter>
      </Card>
    </Form>
  );
};

export default EmailTab;
