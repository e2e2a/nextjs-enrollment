'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icons } from '@/components/shared/Icons';
import { profileSelectItems } from '@/constant/profile/selectItems';
// import { useStudentProfileMutation } from '@/lib/queries';
import { StudentProfileUpdateValidator } from '@/lib/validators/profile/update';
import { SelectInput } from './selectInput';
import Input from './Input';
import { BirthdayInput } from './BirthdayInput';
import { useUpdateProfileByAdminMutation } from '@/lib/queries/profile/update/id';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';

type Iprops = {
  session?: any;
  profile: any;
};

const ProfileTabEnrollCollege = ({ profile }: Iprops) => {
  const [isPending, setIsPending] = useState(false);
  const [isNotEditable, setIsNotEditable] = useState<boolean>(!!profile.isVerified);
  const mutation = useUpdateProfileByAdminMutation();
  const formProfile = useForm<z.infer<typeof StudentProfileUpdateValidator>>({
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
    formProfile.setValue('firstname', profile.firstname);
    formProfile.setValue('middlename', profile.middlename);
    formProfile.setValue('lastname', profile.lastname);
    formProfile.setValue('extensionName', profile.extensionName);
    formProfile.setValue('numberStreet', profile.numberStreet);
    formProfile.setValue('barangay', profile.barangay);
    formProfile.setValue('district', profile.district);
    formProfile.setValue('cityMunicipality', profile.cityMunicipality);
    formProfile.setValue('province', profile.province);
    formProfile.setValue('region', profile.region);
    formProfile.setValue('emailFbAcc', profile.emailFbAcc);
    formProfile.setValue('contact', profile.contact);
    formProfile.setValue('nationality', profile.nationality);
    formProfile.setValue('sex', profile.sex);
    formProfile.setValue('civilStatus', profile.civilStatus);
    formProfile.setValue('employmentStatus', profile.employmentStatus);
    formProfile.setValue('birthday', new Date(profile?.birthday ? profile.birthday : Date.now()));
    formProfile.setValue('birthPlaceCity', profile.birthPlaceCity);
    formProfile.setValue('birthPlaceProvince', profile.birthPlaceProvince);
    formProfile.setValue('birthPlaceRegion', profile.birthPlaceRegion);
    formProfile.setValue('educationAttainment', profile.educationAttainment);
    formProfile.setValue('learnerOrTraineeOrStudentClassification', profile.learnerOrTraineeOrStudentClassification);
  }, [formProfile, profile, isNotEditable]);

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();
    setIsPending(true);
    const isProfileValid = await formProfile.trigger();
    if (!isProfileValid) return setIsPending(false);

    const profileData = formProfile.getValues();
    profileData.firstname = profileData.firstname.toLowerCase();
    profileData.lastname = profileData.lastname.toLowerCase();
    profileData.middlename = profileData.middlename?.toLowerCase();

    const data = {
      ...profileData,
      userId: profile?.userId?._id,
      configuredExtension: false,
      formData: formData,
    };
    mutation.mutate(data, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res?.message);
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

  //added

  return (
    <form action='' method='post' onSubmit={(e) => onSubmit(e)}>
      <Card className=''>
        <CardHeader>
          <CardTitle className='pl-0'>
            <div className=' '>
              {profile.isVerified && (
                <div className='flex justify-end'>
                  <div
                    className='bg-slate-200 w-auto hover:bg-slate-300 right-2 rounded-xl py-1.5 px-2 cursor-pointer flex items-center gap-1'
                    title='Edit'
                    onClick={() => {
                      setIsNotEditable(!isNotEditable);
                      formProfile.reset();
                    }}
                  >
                    <Icons.squarePen className='h-5 w-5 fill-white stroke-blue-600 relative' />
                    <span className='hidden sm:flex tracking-normal text-sm'>Edit</span>
                  </div>
                </div>
              )}
              <div className='w-full pl-11'>
                <h1 className='text-3xl font-bold leading-[140%] tracking-wide text-center'>Student Profile</h1>
                <h1 className='text-lg font-bold tracking-wide text-center capitalize'>
                  {profile?.lastname && profile.lastname + ','} {profile?.firstname ?? ''} {profile?.middlename ?? ''}{profile?.extensionName && ', ' + profile.extensionName + '.'}
                </h1>
              </div>
            </div>
            <CardDescription className='text-sm font-normal w-full text-center hidden'>Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
          </CardTitle>
        </CardHeader>
        <CardContent className=''>
          <Form {...formProfile}>
            <div className='grid grid-cols-1'>
              <div className=' mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left'>Manpower Profile</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <Input isNotEditable={isNotEditable} name={'firstname'} type={'text'} form={formProfile} label={'Firstname:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'middlename'} type={'text'} form={formProfile} label={'Middlename:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'lastname'} type={'text'} form={formProfile} label={'Lastname:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'extensionName'} type={'text'} form={formProfile} label={'Suffix:'} classNameInput={'capitalize'} />
                </div>
              </div>
              <div className='mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left'>Complete Permanent Mailing Address</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <Input isNotEditable={isNotEditable} name={'numberStreet'} type={'text'} form={formProfile} label={'Number, Street:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'barangay'} type={'text'} form={formProfile} label={'Barangay:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'district'} type={'text'} form={formProfile} label={'District:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'cityMunicipality'} type={'text'} form={formProfile} label={'City/Municipality:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'province'} type={'text'} form={formProfile} label={'Province:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'region'} type={'text'} form={formProfile} label={'Region:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'emailFbAcc'} type={'text'} form={formProfile} label={'Fb account link:'} />
                  <Input isNotEditable={isNotEditable} name={'contact'} type={'text'} form={formProfile} label={'Contact No:'} />
                  <Input isNotEditable={isNotEditable} name={'nationality'} type={'text'} form={formProfile} label={'Nationality:'} classNameInput={'capitalize'} />
                </div>
              </div>
              <div className='mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left'>Personal Information</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <SelectInput isNotEditable={isNotEditable} name={'sex'} form={formProfile} label={'Sex:'} classNameInput={'capitalize'} selectItems={profileSelectItems.sex} placeholder='Select gender' profile={profile} />
                  <SelectInput isNotEditable={isNotEditable} name={'civilStatus'} form={formProfile} label={'Civil Status:'} classNameInput={'capitalize'} selectItems={profileSelectItems.civilStatus} placeholder='Select civil status' profile={profile} />
                  <SelectInput
                    isNotEditable={isNotEditable}
                    name={'employmentStatus'}
                    form={formProfile}
                    label={'Employment Status:'}
                    classNameInput={'capitalize'}
                    selectItems={profileSelectItems.employmentStatus}
                    placeholder='Select employment status'
                    profile={profile}
                  />
                  <SelectInput
                    profile={profile}
                    isNotEditable={isNotEditable}
                    name={'educationAttainment'}
                    form={formProfile}
                    label={'Education Attainment:'}
                    classNameInput={'capitalize'}
                    selectItems={profileSelectItems.educationAttainment}
                    placeholder='Select employment status'
                  />
                </div>
              </div>
              <div className='mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left '>Birthdate & Birth Place</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <BirthdayInput isNotEditable={isNotEditable} name={'birthday'} form={formProfile} label={'Birthday:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'birthPlaceCity'} type={'text'} form={formProfile} label={'City/Municipality:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'birthPlaceProvince'} type={'text'} form={formProfile} label={'Province:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'birthPlaceRegion'} type={'text'} form={formProfile} label={'Region:'} classNameInput={'capitalize'} />
                </div>
              </div>
              <div className='flex-1 mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left'>Learner/Trainee/Student (Clients) </h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <SelectInput
                    profile={profile}
                    isNotEditable={isNotEditable}
                    name={'learnerOrTraineeOrStudentClassification'}
                    form={formProfile}
                    label={'Classification:'}
                    classNameInput={'capitalize'}
                    selectItems={profileSelectItems.learnerOrTraineeOrStudentClassification}
                    placeholder='Select employment status'
                  />
                </div>
              </div>
            </div>
          </Form>
        </CardContent>
        {!isNotEditable && (
          <CardFooter className='w-full flex justify-center items-center '>
            <Button type='submit' className=' bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide'>
              Submit
            </Button>
          </CardFooter>
        )}
      </Card>
    </form>
  );
};

export default ProfileTabEnrollCollege;
