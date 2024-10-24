'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SignupValidator } from '@/lib/validators/auth/signUp';
import { Form } from '@/components/ui/form';
import { useSession } from 'next-auth/react';
import { useCourseQuery, useAdminCreateUserRoleMutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { SelectInput } from './components/SelectInput';
import Input from './components/Input';
import { profileSelectItems } from '@/constant/profile/selectItems';
import { BirthdayInput } from './components/BirthdayInput';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { TeacherProfileValidator } from '@/lib/validators/AdminValidator';

const Page = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const mutation = useAdminCreateUserRoleMutation();
  const { data } = useSession();
  const [showProfile, setShowProfile] = useState('No');
  const [typeValidate, setTypeValidate] = useState<any>(SignupValidator);
  const [defaultValues, setDefaultValues] = useState<any>({
    email: '',
    username: '',
    firstname: '',
    middlename: '',
    lastname: '',
    extensionName: '',
    contact: '',
    sex: '',
    civilStatus: '',
    birthday: new Date(Date.now()),
    password: '',
    CPassword: '',
  });
  const session = data?.user;

  useEffect(() => {
    if (showProfile === 'Yes') {
      setTypeValidate(TeacherProfileValidator);
      setDefaultValues({
        email: '',
        username: '',
        firstname: '',
        middlename: '',
        lastname: '',
        extensionName: '',
        contact: '',
        sex: '',
        civilStatus: '',
        birthday: new Date(Date.now()),
        password: '',
        CPassword: '',
      });
    } else if (showProfile === 'No') {
      setTypeValidate(SignupValidator);
      setDefaultValues({
        email: '',
        username: '',
        password: '',
        CPassword: '',
      });
    }
  }, [showProfile]);

  const formCollege = useForm<z.infer<typeof typeValidate>>({
    resolver: zodResolver(typeValidate),
    defaultValues: defaultValues,
  });

  const onSubmit: SubmitHandler<z.infer<typeof typeValidate>> = async (data) => {
    setIsNotEditable(true)
    if (showProfile === 'Yes') {
      data.firstname = data.firstname.toLowerCase();
      data.lastname = data.lastname.toLowerCase();
      data.middlename = data.middlename.toLowerCase();
      if (data.extensionName) data.extensionName = data.extensionName.toLowerCase();
    }
    const dataa = {
      ...data,
      role: 'TEACHER',
      createProfile: showProfile === 'Yes' ? true : false,
    };
    mutation.mutate(dataa, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            formCollege.reset();
            setShowProfile('No');
            setTypeValidate(SignupValidator);
            setDefaultValues({
              email: '',
              username: '',
              password: '',
              CPassword: '',
            });
            makeToastSucess(res.message);
            return;
          default:
            if (res.error) return makeToastError(res.error);
            return;
        }
      },
      onError: (error) => {
        console.error(error.message);
      },
      onSettled: () => {
        setIsNotEditable(false)
      },
    });
  };
  return (
    <div className='border py-5 bg-white rounded-xl'>
      <Card className='border-0 bg-transparent'>
        <CardHeader className='space-y-3'>
          <CardTitle className='text-left text-lg xs:text-2xl sm:text-3xl font-poppins'>Register a New Instructor!</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>To register a new instructor, please provide the necessary information. This information is essential for administrative purposes and will help enable additional features in the system.</CardDescription>
        </CardHeader>
        <Form {...formCollege}>
          <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
            <CardContent className='w-full '>
              <div className='flex flex-col gap-4'>
                <Input name={'email'} type={'email'} form={formCollege} label={'Email:'} classNameInput={''} />
                <Input name={'username'} type={'text'} form={formCollege} label={'Username:'} classNameInput={''} />
                <Input name={'password'} type={'password'} form={formCollege} label={'Password:'} classNameInput={'capitalize'} />
                <Input name={'CPassword'} type={'password'} form={formCollege} label={'Confirm Password:'} classNameInput={'capitalize'} />
                <div className='flex flex-col space-y-2'>
                  <span className=''>Configure Profile</span>
                  <RadioGroup className='flex' value={showProfile} onValueChange={(value) => setShowProfile(value)}>
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
                {showProfile === 'Yes' ? (
                  <>
                    <Input name={'firstname'} type={'text'} form={formCollege} label={'Firstname:'} classNameInput={'capitalize'} />
                    <Input name={'middlename'} type={'text'} form={formCollege} label={'Middlename:'} classNameInput={'capitalize'} />
                    <Input name={'lastname'} type={'text'} form={formCollege} label={'Lastname:'} classNameInput={'capitalize'} />
                    <Input name={'extensionName'} type={'text'} form={formCollege} label={'Suffix:'} classNameInput={'capitalize'} />
                    <Input name={'contact'} type={'text'} form={formCollege} label={'Contact:'} classNameInput={'capitalize'} />
                    <SelectInput name={'sex'} form={formCollege} label={'Sex:'} selectItems={profileSelectItems.sex} placeholder='Select gender' />
                    <SelectInput name={'civilStatus'} form={formCollege} label={'Civil Status:'} selectItems={profileSelectItems.civilStatus} placeholder='Select gender' />
                    <BirthdayInput name={'birthday'} form={formCollege} label={'Birthday:'} classNameInput={'capitalize'} />
                  </>
                ) : null}
              </div>
            </CardContent>
            <CardFooter>
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
