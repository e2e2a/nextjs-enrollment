'use client';
import React, { useCallback, useEffect, useState } from 'react';
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
import Image from 'next/image';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useUpdateProfileMutation } from '@/lib/queries/profile/update/session';
import { StudentProfileUpdateValidator } from '@/lib/validators/profile/update';
type FormData = z.infer<typeof StudentProfileUpdateValidator>;
type Iprops = {
  session?: any;
  profile: any;
};
const ProfileTab = ({ profile }: Iprops) => {
  const mutation = useUpdateProfileMutation();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isNotEditable, setIsNotEditable] = useState<boolean>(!!profile.isVerified);

  const handleEditable = async () => {
    setIsNotEditable(!isNotEditable);
    form.reset();
  };
  const form = useForm<z.infer<typeof StudentProfileUpdateValidator>>({
    resolver: zodResolver(StudentProfileUpdateValidator),
    defaultValues: {
      firstname: '',
      middlename: '',
      lastname: '',
      extensionName: '',
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
    },
  });

  useEffect(() => {
    form.setValue('firstname', profile.firstname);
    form.setValue('middlename', profile.middlename);
    form.setValue('lastname', profile.lastname);
    form.setValue('extensionName', profile.extensionName);
    form.setValue('numberStreet', profile.numberStreet);
    form.setValue('barangay', profile.barangay);
    form.setValue('district', profile.district);
    form.setValue('cityMunicipality', profile.cityMunicipality);
    form.setValue('province', profile.province);
    form.setValue('region', profile.region);
    form.setValue('emailFbAcc', profile.emailFbAcc);
    form.setValue('contact', profile.contact);
    form.setValue('nationality', profile.nationality);
    form.setValue('sex', profile.sex);
    form.setValue('civilStatus', profile.civilStatus);
    form.setValue('employmentStatus', profile.employmentStatus);
    form.setValue('birthday', new Date(profile.birthday));
    form.setValue('birthPlaceCity', profile.birthPlaceCity);
    form.setValue('birthPlaceProvince', profile.birthPlaceProvince);
    form.setValue('birthPlaceRegion', profile.birthPlaceRegion);
    form.setValue('educationAttainment', profile.educationAttainment);
    form.setValue('learnerOrTraineeOrStudentClassification', profile.learnerOrTraineeOrStudentClassification);
  }, [form, profile, isNotEditable]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    setIsPending(true);
    data.firstname = data.firstname.toLowerCase();
    data.lastname = data.lastname.toLowerCase();
    data.middlename = data.middlename.toLowerCase();
    data.middlename = data.middlename.toLowerCase();

    mutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsNotEditable(true);
            makeToastSucess('Profile has been updated.');
            return;
          default:
            makeToastError('Update profile failed.');
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
                <div className='w-full pl-11'>
                  <h1 className='text-3xl font-bold leading-[140%] tracking-wide text-center'>Profile</h1>
                </div>
                {profile.isVerified && (
                  <div className='bg-slate-200 hover:bg-slate-300 relative right-2 rounded-xl py-1.5 px-2 cursor-pointer flex items-center gap-1' title='Edit' onClick={handleEditable}>
                    <Icons.squarePen className='h-5 w-5 fill-white stroke-blue-600 relative' />
                    <span className='hidden sm:flex tracking-normal text-sm'>Edit</span>
                  </div>
                )}
              </div>
              <CardDescription className='text-sm font-normal w-full text-center'>Update your profile information here. Ensure all your details are accurate to have the best experience on our platform.</CardDescription>
            </CardTitle>
          </CardHeader>
          {/* note if its not editable its pb-0 @button */}
          <CardContent className=''>
            <div className={`flex flex-col lg:flex-row lg:gap-8 ${isNotEditable ? 'justify-around ' : 'px-0 lg:px-11'}`}>
              <div className={`flex-col flex gap-4 ${isNotEditable ? '' : 'flex-1'}`}>
                <div className='flex-1 mb-5 lg:mb-0'>
                  <h1 className='text-lg font-bold border-b text-center lg:text-left'>Manpower Profile</h1>
                  <div className={`space-y-3 mt-2 mb-3`}>
                    <Input isNotEditable={isNotEditable} name={'firstname'} type={'text'} form={form} label={'Firstname:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'middlename'} type={'text'} form={form} label={'Middlename:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'lastname'} type={'text'} form={form} label={'Lastname:'} classNameInput={'capitalize'} />
                    <Input isNotEditable={isNotEditable} name={'extensionName'} type={'text'} form={form} label={'Suffix:'} classNameInput={'capitalize'} />
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
              {!isNotEditable && <div className='w-px border border-gray-300 hidden md:flex mx-1 h-auto' />}

              <div className={`flex-col flex gap-4 ${isNotEditable ? '' : 'flex-1'}`}>
                <div className='lg:mb-0'>
                  <h1 className='text-lg font-bold border-b text-center lg:text-left'>Personal Information</h1>
                  <div className={`space-y-3 mt-2 mb-3`}>
                    <SelectInput isNotEditable={isNotEditable} name={'sex'} form={form} label={'Sex:'} classNameInput={'capitalize'} selectItems={profileSelectItems.sex} placeholder='Select gender' profile={profile} />
                    <SelectInput isNotEditable={isNotEditable} name={'civilStatus'} form={form} label={'Civil Status:'} classNameInput={'capitalize'} selectItems={profileSelectItems.civilStatus} placeholder='Select civil status' profile={profile} />
                    <SelectInput
                      isNotEditable={isNotEditable}
                      name={'employmentStatus'}
                      form={form}
                      label={'Employment Status:'}
                      classNameInput={'capitalize'}
                      selectItems={profileSelectItems.employmentStatus}
                      placeholder='Select employment status'
                      profile={profile}
                    />
                    <SelectInput
                      isNotEditable={isNotEditable}
                      name={'educationAttainment'}
                      form={form}
                      label={'Education Attainment:'}
                      classNameInput={'capitalize'}
                      selectItems={profileSelectItems.educationAttainment}
                      placeholder='Select employment status'
                      profile={profile}
                    />
                    {/* <BirthdayInput isNotEditable={isNotEditable} name={'birthday'} form={form} label={'Birthday:'} classNameInput={'capitalize'} /> */}
                  </div>
                  <div className='mb-5 mt-7 lg:mb-0'>
                    <h1 className='text-lg font-bold border-b text-center lg:text-left '>Birthdate & Birth Place</h1>
                    <div className={`space-y-3 mt-2 mb-3`}>
                      <BirthdayInput isNotEditable={isNotEditable} name={'birthday'} form={form} label={'Birthday:'} classNameInput={'capitalize'} />
                      <Input isNotEditable={isNotEditable} name={'birthPlaceCity'} type={'text'} form={form} label={'City/Municipality:'} classNameInput={'capitalize'} />
                      <Input isNotEditable={isNotEditable} name={'birthPlaceProvince'} type={'text'} form={form} label={'Province:'} classNameInput={'capitalize'} />
                      <Input isNotEditable={isNotEditable} name={'birthPlaceRegion'} type={'text'} form={form} label={'Region:'} classNameInput={'capitalize'} />
                    </div>
                  </div>
                </div>

                <div className='flex-1 mb-5 lg:mb-0'>
                  <h1 className='text-lg font-bold border-b text-center lg:text-left'>Learner/Trainee/Student (Clients) </h1>
                  <div className={`space-y-3 mt-2 mb-3`}>
                    <SelectInput
                      profile={profile}
                      isNotEditable={isNotEditable}
                      name={'learnerOrTraineeOrStudentClassification'}
                      form={form}
                      label={'Classification:'}
                      classNameInput={'capitalize'}
                      selectItems={profileSelectItems.learnerOrTraineeOrStudentClassification}
                      placeholder='Select employment status'
                    />
                  </div>
                  {/* {isNotEditable && (
                    <div className='mb-5 mt-7 lg:mb-0'>
                      <h1 className={`${isNotEditable ? 'flex flex-row text-lg font-bold border-b lg:text-left text-center' : 'hidden'}`}>Course/Qualification:</h1>
                      <div className={`space-y-3 mt-2 mb-3`}>
                        <div className='flex flex-row'>
                          <span className='font-medium px-1'>Department:</span>
                          <span className='font-normal flex w-full items-center px-1 gap-2 text-center'>Diploma Program in Information Technology</span>
                        </div>
                      </div>
                    </div>
                  )} */}
                </div>
              </div>
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
