'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { Combobox } from './components/Combobox';
import Input from './components/Input';
import { roomType } from '@/constant/room';
import { RoomValidator } from '@/lib/validators/room/create';
import Image from 'next/image';
import { useCreateRoomMutation } from '@/lib/queries/rooms/create/admin';

const Page = () => {
  const [isPending, setIsPending] = useState(false);
  const [value, setValue] = React.useState('');
  const mutation = useCreateRoomMutation();
  const formCollege = useForm<z.infer<typeof RoomValidator>>({
    resolver: zodResolver(RoomValidator),
    defaultValues: {
      roomName: '',
      roomType: '',
      floorLocation: '',
      educationLevel: 'tertiary',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof RoomValidator>> = async (data) => {
    data.roomName = data.roomName.toLowerCase();

    mutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setValue('');
            formCollege.reset();
            makeToastSucess('New Room has been added.');
            return;
          default:
            if (res.error) return makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };
  return (
    <div className='border-0 bg-white rounded-xl min-h-[87vh]'>
      <Card className='border-0 py-5 bg-transparent'>
        <CardHeader className='space-y-3'>
          <CardTitle className='text-lg xs:text-2xl sm:text-3xl tracking-tight w-full text-center uppercase'>Add a New Room</CardTitle>
          <CardDescription className='text-xs sm:text-sm hidden'></CardDescription>
          <div className='text-xs sm:text-sm'>
            <div className=''>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To register a new Room, This list is populated with teacher&apos;s schedule created and managed by the administrator. Providing this information will help synchronize and ensure smooth management.
            </div>
          </div>
        </CardHeader>
        <Form {...formCollege}>
          <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
            <CardContent className='w-full'>
              <div className='flex flex-col gap-4'>
                <Input name={'roomName'} type={'text'} form={formCollege} label={'Room Name:'} classNameInput={'uppercase'} />
                <Combobox name={'roomType'} selectItems={roomType} form={formCollege} label={'Select Room Type:'} placeholder={'Select Room Type'} value={value} setValue={setValue} />
                <Input name={'floorLocation'} type={'text'} form={formCollege} label={'Floor Location: Optional*'} classNameInput={''} />
              </div>
            </CardContent>
            <CardFooter className=''>
              <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                <Button type='submit' variant={'destructive'} disabled={isPending} className='bg-blue-500 hover:bg-blue-700 text-white font-semibold tracking-wide'>
                  {isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Submit'}
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Page;
