'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SignupValidator } from '@/lib/validators/auth/signUp';
import { Form } from '@/components/ui/form';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { SelectInput } from './components/SelectInput';
import Input from './components/Input';
import { profileSelectItems } from '@/constant/profile/selectItems';
import { BirthdayInput } from './components/BirthdayInput';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useAdminCreateUserRoleMutation } from '@/lib/queries/user/create';
import { TeacherProfileUpdateValidator } from '@/lib/validators/profile/update';
import Image from 'next/image';

const Page = () => {
  const [isPending, setIsPending] = useState(false);
  const mutation = useAdminCreateUserRoleMutation();
  const [configProfile, setConfigProfile] = useState('No');

  const formUser = useForm<z.infer<typeof SignupValidator>>({
    resolver: zodResolver(SignupValidator),
    defaultValues: { email: '', username: '', password: '', CPassword: '' },
  });

  const formProfile = useForm<z.infer<typeof TeacherProfileUpdateValidator>>({
    resolver: zodResolver(TeacherProfileUpdateValidator),
    defaultValues: { firstname: '', middlename: '', lastname: '', extensionName: '', contact: '', sex: '', civilStatus: '', birthday: new Date(Date.now()) },
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsPending(true);
    const isUserValid = await formUser.trigger();
    if (configProfile === 'Yes') {
      const isProfileValid = await formProfile.trigger();
      if (!isUserValid || !isProfileValid) return setIsPending(false);
    } else {
      if (!isUserValid) return setIsPending(false);
    }
    const userData = formUser.getValues();
    const profileData = formProfile.getValues();
    profileData.firstname = profileData.firstname.toLowerCase();
    profileData.lastname = profileData.lastname.toLowerCase();
    profileData.middlename = profileData.middlename.toLowerCase();
    if (profileData.extensionName) profileData.extensionName = profileData.extensionName.toLowerCase();
    const data = { ...userData, ...profileData, role: 'TEACHER', configProfile: configProfile };
    mutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            formUser.reset();
            formProfile.reset();
            setConfigProfile('No');
            makeToastSucess(res.message);
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
    <div className='border py-5 bg-white rounded-xl'>
      <Card className='border-0 bg-transparent'>
        <CardHeader className='space-y-3'>
          <CardTitle className='text-left text-lg xs:text-2xl sm:text-3xl font-poppins'>Register a New Instructor!</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            To register a new user instructor, please provide the necessary information. This information is essential for administrative purposes and will help enable additional features in the system.
          </CardDescription>
        </CardHeader>
        <form method='post' onSubmit={(e) => onSubmit(e)} className='w-full space-y-4'>
          <CardContent className='w-full '>
            <div className='flex flex-col gap-4'>
              <Form {...formUser}>
                <Input isPending={isPending} name={'email'} type={'email'} form={formUser} label={'Email:'} classNameInput={''} />
                <Input isPending={isPending} name={'username'} type={'text'} form={formUser} label={'Username:'} classNameInput={''} />
                <Input isPending={isPending} name={'password'} type={'password'} form={formUser} label={'Password:'} classNameInput={'capitalize'} />
                <Input isPending={isPending} name={'CPassword'} type={'password'} form={formUser} label={'Confirm Password:'} classNameInput={'capitalize'} />
              </Form>
              <div className='flex flex-col space-y-2'>
                <span className=''>Configure Profile</span>
                <RadioGroup className='flex' value={configProfile} onValueChange={(value) => setConfigProfile(value)}>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='No' id='No' />
                    <Label htmlFor='No'>No</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='Yes' id='Yes' />
                    <Label htmlFor='Yes'>Yes</Label>
                  </div>
                </RadioGroup>
              </div>
              {configProfile === 'Yes' && (
                <Form {...formProfile}>
                  <Input isPending={isPending} name={'firstname'} type={'text'} form={formProfile} label={'Firstname:'} classNameInput={'capitalize'} />
                  <Input isPending={isPending} name={'middlename'} type={'text'} form={formProfile} label={'Middlename:'} classNameInput={'capitalize'} />
                  <Input isPending={isPending} name={'lastname'} type={'text'} form={formProfile} label={'Lastname:'} classNameInput={'capitalize'} />
                  <Input isPending={isPending} name={'extensionName'} type={'text'} form={formProfile} label={'Suffix:'} classNameInput={'capitalize'} />
                  <Input isPending={isPending} name={'contact'} type={'text'} form={formProfile} label={'Contact:'} classNameInput={'capitalize'} />
                  <SelectInput isPending={isPending} name={'sex'} form={formProfile} label={'Sex:'} selectItems={profileSelectItems.sex} placeholder='Select gender' />
                  <SelectInput isPending={isPending} name={'civilStatus'} form={formProfile} label={'Civil Status:'} selectItems={profileSelectItems.civilStatus} placeholder='Select gender' />
                  <BirthdayInput name={'birthday'} form={formProfile} label={'Birthday:'} classNameInput={'capitalize'} />
                </Form>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <div className='flex w-full justify-center md:justify-end items-center mt-4'>
              <Button type='submit' disabled={isPending} variant={'destructive'} className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>
                {isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Submit'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Page;
