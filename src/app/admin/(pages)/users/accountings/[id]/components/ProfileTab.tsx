'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icons } from '@/components/shared/Icons';
import Input from './Input';
import { BirthdayInput } from './BirthdayInput';
import { SelectInput } from './selectInput';
import { profileSelectItems } from '@/constant/profile/selectItems';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Image from 'next/image';
import { AccountingProfileUpdateValidator } from '@/lib/validators/profile/update';
import { useUpdateProfileByAdminMutation } from '@/lib/queries/profile/update/id';

type IProps = {
  session?: any;
  profile: any;
};

const ProfileTab = ({ profile }: IProps) => {
  const mutation = useUpdateProfileByAdminMutation();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isNotEditable, setIsNotEditable] = useState<boolean>(!!profile.isVerified);

  const form = useForm<z.infer<typeof AccountingProfileUpdateValidator>>({
    resolver: zodResolver(AccountingProfileUpdateValidator),
    defaultValues: { firstname: '', middlename: '', lastname: '', extensionName: '', contact: '', sex: '', civilStatus: '', birthday: new Date(Date.now()) },
  });

  const handleEditable = async () => {
    setIsNotEditable(!isNotEditable);
    form.reset();
  };

  useEffect(() => {
    form.setValue('firstname', profile.firstname);
    form.setValue('middlename', profile.middlename);
    form.setValue('lastname', profile.lastname);
    form.setValue('extensionName', profile.extensionName);
    form.setValue('contact', profile.contact);
    form.setValue('sex', profile.sex);
    form.setValue('civilStatus', profile.civilStatus);
    form.setValue('birthday', new Date(profile.birthday));
  }, [form, profile, isNotEditable]);

  const onSubmit: SubmitHandler<z.infer<typeof AccountingProfileUpdateValidator>> = async (data) => {
    setIsPending(true);
    data.firstname = data.firstname.toLowerCase();
    data.lastname = data.lastname.toLowerCase();
    data.middlename = data.middlename?.toLowerCase();

    const dataa = {
      ...data,
      userId: profile.userId._id,
    };
    
    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res.message);
            setIsNotEditable(true);
            return;
          default:
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
    <Form {...form}>
      <Card className=''>
        <form action='' method='post' onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className='pt-3 pb-5 pl-0'>
              <div className='flex '>
                <div className='flex justify-center w-full'>
                  <h1 className='text-3xl font-semibold tracking-wide text-center'>Profile</h1>
                </div>
              </div>
              <CardDescription className='text-sm font-normal w-full text-center'>Update the profile information here. Ensure all the details are accurate to have the best experience on our platform.</CardDescription>
            </CardTitle>
          </CardHeader>
          <CardContent className=''>
            {profile.isVerified && (
              <div className='w-full flex justify-end mb-2'>
                <div className='bg-slate-200 hover:bg-slate-300 relative right-2 rounded-xl py-1.5 px-2 cursor-pointer flex items-center gap-1' title='Edit' onClick={handleEditable}>
                  <Icons.squarePen className='h-5 w-5 fill-white stroke-blue-600 relative' />
                  <span className='hidden sm:flex tracking-normal text-sm'>Edit</span>
                </div>
              </div>
            )}
            <div className={`grid sm:grid-cols-2 grid-cols-1 md:gap-8 ${isNotEditable ? 'justify-around ' : 'px-0 lg:px-11'}`}>
              <Input isNotEditable={isNotEditable} name={'firstname'} type={'text'} form={form} label={'Firstname:'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} name={'middlename'} type={'text'} form={form} label={'Middlename:'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} name={'lastname'} type={'text'} form={form} label={'Lastname:'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} name={'extensionName'} type={'text'} form={form} label={'Suffix:'} classNameInput={'capitalize'} />
              <Input isNotEditable={isNotEditable} name={'contact'} type={'text'} form={form} label={'Contact No:'} />
              <SelectInput isNotEditable={isNotEditable} name={'sex'} form={form} label={'Sex:'} classNameInput={'capitalize'} selectItems={profileSelectItems.sex} placeholder='Select gender' profile={profile} />
              <SelectInput isNotEditable={isNotEditable} name={'civilStatus'} form={form} label={'Civil Status:'} classNameInput={'capitalize'} selectItems={profileSelectItems.civilStatus} placeholder='Select civil status' profile={profile} />
              <BirthdayInput isNotEditable={isNotEditable} name={'birthday'} form={form} label={'Birthday:'} classNameInput={'capitalize'} />
              {isNotEditable && (
                <div className='flex gap-2 px-2'>
                  <label>Age: </label> {profile.age}
                </div>
              )}
            </div>
          </CardContent>
          {!isNotEditable && (
            <CardFooter className='w-full flex justify-center items-center '>
              <Button type='submit' disabled={isPending} className=' bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide' onClick={form.handleSubmit(onSubmit)}>
                {isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Submit'}
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </Form>
  );
};

export default ProfileTab;
