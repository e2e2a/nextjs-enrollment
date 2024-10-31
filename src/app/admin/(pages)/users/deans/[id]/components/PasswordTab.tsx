'use client';
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from './Input';
import { NewPasswordValidator } from '@/lib/validators/user/update/password';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useNewPasswordMutationByAdmin } from '@/lib/queries/user/update/id/password';
import PasswordAlert from './PasswordAlert';

interface IProps {
  profile: any;
}

const PasswordTab = ({ profile }: IProps) => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
  const mutation = useNewPasswordMutationByAdmin();
  
  const form = useForm<z.infer<typeof NewPasswordValidator>>({
    resolver: zodResolver(NewPasswordValidator),
    defaultValues: { currentPassword: '1', password: '', CPassword: '', },
  });

  useEffect(() => {
    const subscription = form.watch((values: any) => {
      const { password, CPassword } = values;
      if (!password || !CPassword) {
        setIsButtonDisabled(true);
      } else {
        setIsButtonDisabled(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsPending(true);
    const isValid = await form.trigger();
    if (!isValid) {
      setIsPending(false);
      setIsOpen(false);
      return;
    }
    const parseData = form.getValues();
    const dataa = {
      ...parseData,
      userId: profile.userId._id,
    };

    mutation.mutate(dataa, {
      onSuccess: async (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res.message);
            setIsOpen(false);
            form.reset();
            return;
          case 400:
          case 401:
          case 402:
          case 403:
          case 404:
            if (res.error) {
              setIsPending(false);
              setIsOpen(false);
              form.setError('currentPassword', { message: res.error });
              return;
            }
            return;
          default:
            setIsOpen(false);
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };
  return (
    <form onSubmit={(e) => onSubmit(e)} className='space-y-4'>
      <Form {...form}>
        <Card className='space-y-4'>
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
            <Input isNotEditable={isNotEditable} name={'password'} type={'password'} form={form} label={'New Password'} />
            <Input isNotEditable={isNotEditable} name={'CPassword'} type={'password'} form={form} label={'Re-type new password'} />
          </CardContent>
          <CardFooter className='w-full flex justify-center items-center '>
            {/* <Button type='submit' disabled={isPending} className=' bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide'>
              {isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Save'}
            </Button> */}
            <PasswordAlert disabled={isButtonDisabled} isPending={isPending} isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={onSubmit} form={form} />
          </CardFooter>
        </Card>
      </Form>
    </form>
  );
};

export default PasswordTab;
