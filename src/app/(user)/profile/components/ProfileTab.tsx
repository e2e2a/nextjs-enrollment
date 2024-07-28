'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { StudentProfileValidator } from '@/lib/validators/Validator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { Icons } from '@/components/shared/Icons';
import Input from './Input';

const ProfileTab = () => {
  const { data } = useSession();
  const [isNotEditable, setIsNotEditable] = useState(true);
  const session = data?.user;
  const handleEditable = async () => {
    setIsNotEditable(!isNotEditable);
  };
  const form = useForm<z.infer<typeof StudentProfileValidator>>({
    resolver: zodResolver(StudentProfileValidator),
    defaultValues: {
      firstname: 'qwe',
      middlename: 'qwe',
      lastname: 'qwe',
      numberStreet: '',
      barangay: '',
      district: '',
      cityMunicipality: '',
      province: '',
      region: '',
      emailFbAcc: '',
      contact: '',
      nationality: '',
      sex: '',
      civilStatus: '',
      employmentStatus: '',
      birthPlaceCity: '',
      birthPlaceProvince: '',
      birthPlaceRegion: '',
      educationAttainment: '',
      learnerOrTraineeOrStudentClassification: '',
    },
  });
  const onSubmit = async (data: z.infer<typeof StudentProfileValidator>) => {
    console.log(data);
  };
  return (
    <Form {...form}>
      <Card className='' onSubmit={form.handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle className='py-3'>
            <div className='flex justify-between'>
              <h1>Profile</h1>
              <div
                className='bg-slate-100 rounded-full py-1.5 px-2 cursor-pointer flex items-center gap-1'
                title='Edit'
                onClick={handleEditable}
              >
                <Icons.squarePen className='h-5 w-5 fill-white stroke-blue-600' />
                <span className='hidden sm:flex tracking-normal text-sm'>Edit</span>
              </div>
            </div>
            <CardDescription>Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent className=''>
          <div className='flex flex-col md:flex-row gap-2'>
            <div className='flex-col flex-1 flex gap-4'>
              <div className='flex-1'>
                <h1 className='text-lg font-bold border-b'>Manpower Profile</h1>
                <div className='space-y-3 mt-2 mb-3'>
                  <Input isNotEditable={isNotEditable} name={'lastname'} type={'text'} form={form} label={'Lastname:'} />
                  <Input isNotEditable={isNotEditable} name={'firstname'} type={'text'} form={form} label={'Firstname:'} />
                  <Input isNotEditable={isNotEditable} name={'middlename'} type={'text'} form={form} label={'Middlename:'} />
                </div>
              </div>
              <div className='flex-1'>
                <h1 className='text-lg font-bold border-b'>Complete Permanent Mailing Address</h1>
                <div className='space-y-3 mt-2 mb-3'>
                  <Input isNotEditable={isNotEditable} name={'lastname'} type={'text'} form={form} label={'Lastname:'} />
                  <Input isNotEditable={isNotEditable} name={'firstname'} type={'text'} form={form} label={'Firstname:'} />
                  <Input isNotEditable={isNotEditable} name={'middlename'} type={'text'} form={form} label={'Middlename:'} />
                </div>
              </div>
            </div>

            <div className='w-px border border-gray-300 hidden md:flex mx-2 h-auto' />

            <div className='flex-col flex-1'>
              <div className='flex-1'>
                <h1 className='text-lg font-bold border-b'>Complete Permanent Mailing Address</h1>
                <div className='space-y-3 mt-2 mb-3'>
                  <Input isNotEditable={isNotEditable} name={'lastname'} type={'text'} form={form} label={'Lastname:'} />
                  <Input isNotEditable={isNotEditable} name={'firstname'} type={'text'} form={form} label={'Firstname:'} />
                  <Input isNotEditable={isNotEditable} name={'middlename'} type={'text'} form={form} label={'Middlename:'} />
                </div>
              </div>
            </div>
          </div>
          {/* <Input isNotEditable={isNotEditable} name={'CPassword'} type={'password'} form={form} label={'Re-type new password'} /> */}
        </CardContent>
        <CardFooter className='w-full flex justify-center items-center '>
          <Button className=' bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide'>Submit</Button>
        </CardFooter>
      </Card>
    </Form>
  );
};

export default ProfileTab;
