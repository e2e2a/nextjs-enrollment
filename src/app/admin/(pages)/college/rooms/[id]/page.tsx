'use client';
import React, { useEffect, useState } from 'react';
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
import { useRoomQueryById } from '@/lib/queries/rooms/get/id';
import { useUpdateRoomByIdMutation } from '@/lib/queries/rooms/update/id';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [value, setValue] = React.useState('');

  const { data: roomData, error } = useRoomQueryById(params.id);

  useEffect(() => {
    if (error || !roomData) return;

    if (roomData) {
      if (roomData.room) {
        setIsError(false);
        setIsPageLoading(false);
      }
      if (roomData.error) {
        if (roomData.status === 404 || roomData.status === 500) {
          setIsError(true);
        }
      }
    }
  }, [roomData, error]);

  const mutation = useUpdateRoomByIdMutation();

  const formCollege = useForm<z.infer<typeof RoomValidator>>({
    resolver: zodResolver(RoomValidator),
    defaultValues: {
      roomName: '',
      roomType: '',
      floorLocation: '',
      educationLevel: 'tertiary',
    },
  });

  useEffect(() => {
    setValue(roomData?.room?.roomType);
    formCollege.setValue('roomName', roomData?.room?.roomName);
    formCollege.setValue('roomType', roomData?.room?.roomType);
    formCollege.setValue('floorLocation', roomData?.room?.floorLocation);
  }, [formCollege, roomData]);

  const onSubmit: SubmitHandler<z.infer<typeof RoomValidator>> = async (data) => {
    data.roomName = data.roomName.toLowerCase();
    const dataa = { ...data, id: roomData?.room?._id, category: 'College' };
    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setValue('');
            formCollege.reset();
            makeToastSucess('Room has been updated.');
            return;
          default:
            return makeToastError(res.error);
        }
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <>
          {isError && <div className=''>404</div>}
          {roomData && !isError && !roomData.error && (
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
          )}
        </>
      )}
    </>
  );
};

export default Page;
