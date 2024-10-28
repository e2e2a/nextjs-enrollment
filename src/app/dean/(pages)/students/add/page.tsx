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
import { useAdminCreateUserRoleMutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { SelectInput } from './components/SelectInput';
import Input from './components/Input';
import { profileSelectItems } from '@/constant/profile/selectItems';
import { BirthdayInput } from './components/BirthdayInput';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { StudentProfileValidator } from '@/lib/validators/AdminValidator';

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
    birthday: new Date(Date.now()),
    birthPlaceCity: '',
    birthPlaceProvince: '',
    birthPlaceRegion: '',
    educationAttainment: '',
    learnerOrTraineeOrStudentClassification: '',
    password: '',
    CPassword: '',
  });
  const session = data?.user;
  useEffect(() => {
    if (showProfile === 'Yes') {
      setTypeValidate(StudentProfileValidator);
      setDefaultValues({
        email: '',
        username: '',
        firstname: '',
        middlename: '',
        lastname: '',
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
        birthday: new Date(Date.now()),
        birthPlaceCity: '',
        birthPlaceProvince: '',
        birthPlaceRegion: '',
        educationAttainment: '',
        learnerOrTraineeOrStudentClassification: '',
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
    setIsNotEditable(true);
    if (showProfile === 'Yes') {
      data.firstname = data.firstname.toLowerCase();
      data.lastname = data.lastname.toLowerCase();
      data.middlename = data.middlename.toLowerCase();
      if (data.extensionName) data.extensionName = data.extensionName.toLowerCase();
    }
    const dataa = {
      ...data,
      role: 'STUDENT',
      createProfile: showProfile === 'Yes' ? true : false,
    };
    mutation.mutate(dataa, {
      onSuccess: (res) => {
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
        setIsNotEditable(false);
      },
    });
  };
  return (
    <div className='border py-5 bg-white rounded-xl'>
      <Card className='border-0 bg-transparent'>
        <CardHeader className='space-y-3'>
          <CardTitle className='text-left text-lg xs:text-2xl sm:text-3xl font-poppins'>Register a New Student!</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>To register a new student, please provide the necessary information. This information is essential for administrative purposes and will help enable additional features in the system.</CardDescription>
        </CardHeader>
        <Form {...formCollege}>
          <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
            <CardContent className='w-full '>
              <div className='flex flex-col gap-4'>
                <Input isNotEditable={isNotEditable} name={'email'} type={'email'} form={formCollege} label={'Email:'} classNameInput={''} />
                <Input isNotEditable={isNotEditable} name={'username'} type={'text'} form={formCollege} label={'Username:'} classNameInput={''} />
                <Input isNotEditable={isNotEditable} name={'password'} type={'password'} form={formCollege} label={'Password:'} classNameInput={'capitalize'} />
                <Input isNotEditable={isNotEditable} name={'CPassword'} type={'password'} form={formCollege} label={'Confirm Password:'} classNameInput={'capitalize'} />
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
                    <span className='w-full mt-4 font-medium text-lg'>Manpower Profile:</span>
                    <Input isNotEditable={isNotEditable} name={'firstname'} type={'text'} form={formCollege} label={'Firstname:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'middlename'} type={'text'} form={formCollege} label={'Middlename:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'lastname'} type={'text'} form={formCollege} label={'Lastname:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'extensionName'} type={'text'} form={formCollege} label={'Suffix:'} classNameInput={'capitalize'} />
                    {/* <Input name={'contact'} type={'text'} form={formCollege} label={'Contact:'} classNameInput={'capitalize'} /> */}
                    <span className='w-full mt-4 font-medium text-lg'>Complete Permanent Mailing Address:</span>
                    <Input isNotEditable={isNotEditable} name={'numberStreet'} type={'text'} form={formCollege} label={'Number, Street:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'barangay'} type={'text'} form={formCollege} label={'Barangay:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'district'} type={'text'} form={formCollege} label={'District:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'cityMunicipality'} type={'text'} form={formCollege} label={'City/Municipality:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'province'} type={'text'} form={formCollege} label={'Province:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'region'} type={'text'} form={formCollege} label={'Region:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'emailFbAcc'} type={'text'} form={formCollege} label={'Fb account link:'} />
                    <Input isNotEditable={isNotEditable} name={'contact'} type={'text'} form={formCollege} label={'Contact No:'} />
                    <Input isNotEditable={isNotEditable} name={'nationality'} type={'text'} form={formCollege} label={'Nationality:'} classNameInput={'capitalize'} />
                    <span className='w-full mt-4 font-medium text-lg'>Personal Information:</span>
                    <SelectInput isNotEditable={isNotEditable} name={'sex'} form={formCollege} label={'Sex:'} selectItems={profileSelectItems.sex} placeholder='Select gender' />
                    <SelectInput isNotEditable={isNotEditable} name={'civilStatus'} form={formCollege} label={'Civil Status:'} selectItems={profileSelectItems.civilStatus} placeholder='Select civil status' />
                    <SelectInput isNotEditable={isNotEditable} name={'employmentStatus'} form={formCollege} label={'Employment Status:'} selectItems={profileSelectItems.employmentStatus} placeholder='Select employment status' />
                    <SelectInput isNotEditable={isNotEditable} name={'educationAttainment'} form={formCollege} label={'Education Attainment:'} selectItems={profileSelectItems.educationAttainment} placeholder='Select employment status' />
                    <SelectInput isNotEditable={isNotEditable} name={'sex'} form={formCollege} label={'Sex:'} selectItems={profileSelectItems.sex} placeholder='Select gender' />
                    <SelectInput isNotEditable={isNotEditable} name={'civilStatus'} form={formCollege} label={'Civil Status:'} selectItems={profileSelectItems.civilStatus} placeholder='Select gender' />
                    <span className='w-full mt-4 font-medium text-lg'>Birthdate & Birth Place:</span>
                    <BirthdayInput name={'birthday'} form={formCollege} label={'Birthday:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'birthPlaceCity'} type={'text'} form={formCollege} label={'City/Municipality:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'birthPlaceProvince'} type={'text'} form={formCollege} label={'Province:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'birthPlaceRegion'} type={'text'} form={formCollege} label={'Region:'} classNameInput={'capitalize'} />
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
