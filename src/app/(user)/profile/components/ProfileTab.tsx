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
import { BirthdayInput } from './BirthdayInput';
import { SelectInput } from './selectInput';

const ProfileTab = () => {
  const { data } = useSession();
  const [isNotEditable, setIsNotEditable] = useState(true);
  const session = data?.user;
  const handleEditable = async () => {
    setIsNotEditable(!isNotEditable);
    form.reset();
  };
  const form = useForm<z.infer<typeof StudentProfileValidator>>({
    resolver: zodResolver(StudentProfileValidator),
    defaultValues: {
      firstname: 'qwe qwe',
      middlename: 'qwe',
      lastname: 'qwe',
      numberStreet: '',
      barangay: '',
      district: '',
      cityMunicipality: '',
      province: '',
      region: '',
      emailFbAcc: 'http://localhost:3000/profileasdasdasdaaaaaaaaaaa',
      contact: '',
      nationality: '',
      sex: '',
      civilStatus: '',
      employmentStatus: '',
      birthday: new Date(new Date()),
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
          <CardTitle className='pt-3 pb-5'>
            <div className='flex justify-between'>
              <h1 className='text-3xl font-bold leading-[140%] tracking-wide'>Profile</h1>
              <div
                className='bg-slate-100 rounded-full py-1.5 px-2 cursor-pointer flex items-center gap-1'
                title='Edit'
                onClick={handleEditable}
              >
                <Icons.squarePen className='h-5 w-5 fill-white stroke-blue-600' />
                <span className='hidden sm:flex tracking-normal text-sm'>Edit</span>
              </div>
            </div>
            <CardDescription className='text-muted-foreground'>Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent className=''>
          <div className='flex flex-col lg:flex-row lg:gap-2'>
            <div className='flex-col flex-1 flex gap-4'>
              <div className='flex-1 mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-center lg:text-left'>Manpower Profile</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <Input isNotEditable={isNotEditable} name={'lastname'} type={'text'} form={form} label={'Lastname:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'firstname'} type={'text'} form={form} label={'Firstname:'} classNameInput={'capitalize'}  />
                  <Input isNotEditable={isNotEditable} name={'middlename'} type={'text'} form={form} label={'Middlename:'} classNameInput={'capitalize'} />
                </div>
              </div>
              <div className='flex-1 mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-center lg:text-left'>Complete Permanent Mailing Address</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <Input isNotEditable={isNotEditable} name={'numberStreet'} type={'text'} form={form} label={'Number, Street:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'barangay'} type={'text'} form={form} label={'Barangay:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'district'} type={'text'} form={form} label={'District:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'cityMunicipality'} type={'text'} form={form} label={'City/Municipality:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'province'} type={'text'} form={form} label={'Province:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'region'} type={'text'} form={form} label={'Region:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'emailFbAcc'} type={'text'} form={form} label={'Fb account link:'} />
                  <Input isNotEditable={isNotEditable} name={'contact'} type={'text'} form={form} label={'Contact No:'} />
                  <Input isNotEditable={isNotEditable} name={'nationality'} type={'text'} form={form} label={'Nationality:'} classNameInput={'capitalize'} />
                </div>
              </div>
            </div>

            <div className='w-px border border-gray-300 hidden md:flex mx-2 h-auto' />
            <div className='flex-col flex-1 flex gap-4'>
              <div className='mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-center lg:text-left'>Personal Information</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <Input isNotEditable={isNotEditable} name={'sex'} type={'text'} form={form} label={'Sex:'} />
                  <Input isNotEditable={isNotEditable} name={'civilStatus'} type={'text'} form={form} label={'Civil Status:'} />
                  {/* <Input isNotEditable={isNotEditable} name={'employmentStatus'} type={'text'} form={form} label={'Employment Status(before the training):'}/> */}
                  <SelectInput isNotEditable={isNotEditable} name={'employmentStatus'} form={form} label={'Employment Status:'} classNameInput={'capitalize'}/>
                  <BirthdayInput isNotEditable={isNotEditable} name={'birthday'} form={form} label={'Birthday:'} classNameInput={'capitalize'}/>
                </div>
              </div>
              <div className='flex-1 mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-center lg:text-left'>Learner/Trainee/Student (Clients) Classification</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <Input isNotEditable={isNotEditable} name={'numberStreet'} type={'text'} form={form} label={'Number, Street:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'barangay'} type={'text'} form={form} label={'Barangay:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'barangay'} type={'text'} form={form} label={'Barangay:'} classNameInput={'capitalize'} />
                  
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
