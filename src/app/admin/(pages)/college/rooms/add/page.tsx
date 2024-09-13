'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useSession } from 'next-auth/react';
import { useCreateRoomMutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { Combobox } from './components/Combobox';
import Link from 'next/link';
import { RoomCollegeValidator } from '@/lib/validators/AdminValidator';
import Input from './components/Input';
import { roomType } from '@/constant/room';

const Page = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [value, setValue] = React.useState('');
  const mutation = useCreateRoomMutation();
  const { data } = useSession();
  const session = data?.user;
  const formCollege = useForm<z.infer<typeof RoomCollegeValidator>>({
    resolver: zodResolver(RoomCollegeValidator),
    defaultValues: {
      roomName: '',
      roomType: '',
      floorLocation: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof RoomCollegeValidator>> = async (data) => {
    data.roomName = data.roomName.toLowerCase();
    // data.section = data.section.toLowerCase();
    const dataa = {
      ...data,
      educationLevel: 'tertiary'
    }
    console.log('data', dataa);
    mutation.mutate(dataa, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setValue('')
            formCollege.reset();
            makeToastSucess(res.message)
            return;
          default:
            if (res.error) return makeToastError(res.error);
            return;
        }
      },
      onError: (error) => {
        console.error(error.message);
      },
      onSettled: () => {},
    });
  };
  return (
    <div className='border-0 bg-white rounded-xl min-h-[87vh]'>
      <Card className='border-0 py-5 bg-transparent'>
        <CardHeader className='space-y-3'>
          <CardTitle className='text-left text-lg xs:text-2xl sm:text-3xl font-poppins'>Register a New Room in College!</CardTitle>
          <CardDescription className='text-xs sm:text-sm hidden'></CardDescription>
          <div className='text-xs sm:text-sm'>
            <div className=''>
              To register a new Room, This list is populated with teacher&apos;s schedule created and managed by the administrator. Providing this information will help synchronize and ensure smooth management.
              <div className='flex flex-col mt-2'>
                <span className='text-orange-400 font-medium'>Note:</span>
                <span>• Newly Registered room must have been registered in teacher&apos;s schedule to display this in student schedule and adding schedule in blocks/sections. </span>
                <div className='pl-3 flex flex-col '>
                  <span className='font-medium text-black'>Features to consider:</span>
                  <span className=''>- Scheduling with rooms</span>
                  <span className=''>- Printing rooms with schedule</span>
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <Form {...formCollege}>
          <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
            <CardContent className='w-full'>
              <div className='flex flex-col gap-4'>
                <Input name={'roomName'} type={'text'} form={formCollege} label={'Room Name:'} classNameInput={'uppercase'} />
                <Combobox name={'roomType'} selectItems={roomType} form={formCollege} label={'Select Room Type:'} placeholder={'Select Room Type'} value={value} setValue={setValue}/>
                <Input name={'floorLocation'} type={'text'} form={formCollege} label={'Floor Location: Optional*'} classNameInput={''} />
              </div>
            </CardContent>
            <CardFooter className=''>
              <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                <Button type='submit' variant={'destructive'} className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>
                  Register now!
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
