'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Icons } from '@/components/shared/Icons';
import { StudentProfileInAdminValidator } from '@/lib/validators/AdminValidator';
import Input from './Input';
import { BirthdayInput } from './BirthdayInput';
import { SelectInput } from './selectInput';
import { profileSelectItems } from '@/constant/profile/selectItems';
// import { useStudentProfileMutation } from '@/lib/queries';
import PSAFile from './PSAFile';
import GoodMoralFile from './GoodMoralFile';
import ReportCardFile from './ReportCardFile';
import StudentPhoto from './StudentPhoto';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import EditPSAFile from './edit/EditPSAFile';
import EditGoodMoralFile from './edit/EditGoodMoralFile';
import EditReportCardFile from './edit/EditReportCardFile';
import EditStudentPhoto from './edit/EditStudentPhoto';
import Link from 'next/link';

type FormData = z.infer<typeof StudentProfileInAdminValidator>;
type Iprops = {
  session?: any;
  profile: any;
};
const ProfileTabEnrollCollege = ({ profile }: Iprops) => {
  const [photoPreview, setPhotoPreview] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState('');
  const PhotoInputRef = useRef<HTMLInputElement>(null);

  const [filePreview, setFilePreview] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fileGoodMoralPreview, setFileGoodMoralPreview] = useState<File | null>(null);
  const [fileGoodMoralError, setFileGoodMoralError] = useState('');
  const fileGoodMoralInputRef = useRef<HTMLInputElement>(null);

  const [fileTORPreview, setFileTORPreview] = useState<File | null>(null);
  const [fileTORError, setTORError] = useState('');
  const fileTORInputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  // const mutation = useStudentProfileMutation();
  const [isNotEditable, setIsNotEditable] = useState<boolean>(!!profile.isVerified);

  const [defaultValues, setDefaultValues] = useState({
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

    primarySchoolName: '',
    primarySchoolYear: '',
    secondarySchoolName: '',
    secondarySchoolYear: '',
    seniorHighSchoolName: '',
    seniorHighSchoolYear: '',
    seniorHighSchoolStrand: '',

    FathersLastName: '',
    FathersFirstName: '',
    FathersMiddleName: '',
    FathersContact: '',
    MothersLastName: '',
    MothersFirstName: '',
    MothersMiddleName: '',
    MothersContact: '',
  });

  const handleEditable = async () => {
    setIsNotEditable(!isNotEditable);
    form.reset();
  };
  const form = useForm<z.infer<typeof StudentProfileInAdminValidator>>({
    resolver: zodResolver(StudentProfileInAdminValidator),
    defaultValues,
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      const profileDefaultValues = {
        firstname: profile?.firstname || '',
        middlename: profile?.middlename || '',
        lastname: profile?.lastname || '',
        extensionName: profile?.extensionName || '',
        numberStreet: profile?.numberStreet || '',
        barangay: profile?.barangay || '',
        district: profile?.district || '',
        cityMunicipality: profile?.cityMunicipality || '',
        province: profile?.province || '',
        region: profile?.region || '',
        emailFbAcc: profile?.emailFbAcc || '',
        contact: profile?.contact || '',
        nationality: profile?.nationality || '',
        sex: profile?.sex || '',
        civilStatus: profile?.civilStatus || '',
        employmentStatus: profile?.employmentStatus || '',
        birthday: new Date(profile.birthday) || new Date(Date.now()), // Handle date conversion profile?.birthday ? new Date(profile.birthday) :
        birthPlaceCity: profile?.birthPlaceCity || '',
        birthPlaceProvince: profile?.birthPlaceProvince || '',
        birthPlaceRegion: profile?.birthPlaceRegion || '',
        educationAttainment: profile?.educationAttainment || '',
        learnerOrTraineeOrStudentClassification: profile?.learnerOrTraineeOrStudentClassification || '',

        primarySchoolName: profile?.primarySchoolName || '',
        primarySchoolYear: profile?.primarySchoolYear || '',
        secondarySchoolName: profile?.secondarySchoolName || '',
        secondarySchoolYear: profile?.secondarySchoolYear || '',
        seniorHighSchoolName: profile?.seniorHighSchoolName || '',
        seniorHighSchoolYear: profile?.seniorHighSchoolYear || '',
        seniorHighSchoolStrand: profile?.seniorHighSchoolStrand || '',

        FathersLastName: profile?.FathersLastName || '',
        FathersFirstName: profile?.FathersFirstName || '',
        FathersMiddleName: profile?.FathersMiddleName || '',
        FathersContact: profile?.FathersContact || '',
        MothersLastName: profile?.MothersLastName || '',
        MothersFirstName: profile?.MothersFirstName || '',
        MothersMiddleName: profile?.MothersMiddleName || '',
        MothersContact: profile?.MothersContact || '',
      };
      setDefaultValues(profileDefaultValues);
      form.reset(profileDefaultValues); // Reset form with fetched default values
    };
    fetchProfileData();
  }, [form, profile]);

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData();
    if (filePreview) formData.append('filePsa', filePreview);
    if (photoPreview) formData.append('photo', photoPreview);
    if (fileGoodMoralPreview) formData.append('fileGoodMoral', fileGoodMoralPreview);
    if (fileTORPreview) formData.append('fileTOR', fileTORPreview);

    data.firstname = data.firstname.toLowerCase();
    data.lastname = data.lastname.toLowerCase();
    data.middlename = data.middlename.toLowerCase();
    data.middlename = data.middlename.toLowerCase();
    const profileData = {
      profileId: profile?._id!,
      ...data,
    };
    console.log('Form Submitted: ', profileData);
    // mutation.mutate(profileData, {
    //   onSuccess: (res) => {
    //     console.log(res);
    //     switch (res.status) {
    //       case 200:
    //       case 201:
    //       case 203:
    //         makeToastSucess(res?.message);
    //         return;
    //       default:
    //         makeToastError(res.error);
    //         return;
    //     }
    //   },
    //   onSettled: () => {
    //     setIsPending(false);
    //   },
    // });
  };

  //added
  const handleSelectedPhoto = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 5000000) {
        if (files[0].type === 'image/jpeg' || files[0].type === 'image/png') {
          setPhotoError('');
          const file = files[0];
          setPhotoPreview(file);
        } else {
          makeToastError('Student Photo Only allowed JPEG and PNG files.');
        }
      } else {
        makeToastError('File size too large');
      }
    }
  };
  const handleSelectedFile = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 5000000) {
        if (files[0].type === 'image/jpeg' || files[0].type === 'image/png' || files[0].type === 'application/pdf') {
          setFileError('');
          const file = files[0];
          setFilePreview(file);
        } else {
          makeToastError('PSA file Only allowed JPEG, PNG and PDF files.');
        }
      } else {
        makeToastError('File size too large');
      }
    }
  };
  const handleSelectedFileGoodMoral = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 5000000) {
        if (files[0].type === 'image/jpeg' || files[0].type === 'image/png' || files[0].type === 'application/pdf') {
          setFileGoodMoralError('');
          const file = files[0];
          setFileGoodMoralPreview(file);
        } else {
          makeToastError('Good Moral Only allowed JPEG, PNG and PDF files.');
        }
      } else {
        makeToastError('File size too large');
      }
    }
  };
  const handleSelectedFileTOR = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 5000000) {
        if (files[0].type === 'image/jpeg' || files[0].type === 'image/png' || files[0].type === 'application/pdf') {
          setTORError('');
          const file = files[0];
          setFileTORPreview(file);
        } else {
          makeToastError('Form 138/137 Only allowed JPEG, PNG and PDF files.');
        }
      } else {
        makeToastError('File size too large');
      }
    }
  };
  const handleClickPhoto = () => {
    if (PhotoInputRef.current) {
      PhotoInputRef.current.click();
    }
  };
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const handleClickFileGoodMoral = () => {
    if (fileGoodMoralInputRef.current) {
      fileGoodMoralInputRef.current.click();
    }
  };
  const handleClickFileTOR = () => {
    if (fileTORInputRef.current) {
      fileTORInputRef.current.click();
    }
  };
  const handleRemovePhoto = () => setPhotoPreview(null);
  const handleRemoveFile = () => setFilePreview(null);
  const handleRemoveFileGoodMoral = () => setFileGoodMoralPreview(null);
  const handleRemoveFileTOR = () => setFileTORPreview(null);
  return (
    <Form {...form}>
      <Card className=''>
        <form action='' method='post' onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className='pl-0'>
              <div className=' '>
                {profile.isVerified && (
                  <div className='flex justify-end'>
                    <div className='bg-slate-200 w-auto hover:bg-slate-300 right-2 rounded-xl py-1.5 px-2 cursor-pointer flex items-center gap-1' title='Edit' onClick={handleEditable}>
                      <Icons.squarePen className='h-5 w-5 fill-white stroke-blue-600 relative' />
                      <span className='hidden sm:flex tracking-normal text-sm'>Edit</span>
                    </div>
                  </div>
                )}
                <div className='w-full pl-11'>
                  <h1 className='text-3xl font-bold leading-[140%] tracking-wide text-center'>Student Profile</h1>
                  <h1 className='text-lg font-bold tracking-wide text-center capitalize'>
                    {profile.lastname && profile.lastname + ','} {profile.firstname} {profile.middlename} {profile.middlename && profile.extensionName + '.'}
                  </h1>
                </div>
              </div>
              <CardDescription className='text-sm font-normal w-full text-center hidden'>Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
            </CardTitle>
          </CardHeader>
          <CardContent className=''>
            <div className='grid grid-cols-1'>
              <div className=' mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left'>Manpower Profile</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <Input isNotEditable={isNotEditable} name={'firstname'} type={'text'} form={form} label={'Firstname:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'middlename'} type={'text'} form={form} label={'Middlename:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'lastname'} type={'text'} form={form} label={'Lastname:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'extensionName'} type={'text'} form={form} label={'Suffix:'} classNameInput={'capitalize'} />
                </div>
              </div>
              <div className='mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left'>Complete Permanent Mailing Address</h1>
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
              <div className='mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left'>Personal Information</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <SelectInput isNotEditable={isNotEditable} name={'sex'} form={form} label={'Sex:'} classNameInput={'capitalize'} selectItems={profileSelectItems.sex} placeholder='Select gender' />
                  <SelectInput isNotEditable={isNotEditable} name={'civilStatus'} form={form} label={'Civil Status:'} classNameInput={'capitalize'} selectItems={profileSelectItems.civilStatus} placeholder='Select civil status' />
                  <SelectInput isNotEditable={isNotEditable} name={'employmentStatus'} form={form} label={'Employment Status:'} classNameInput={'capitalize'} selectItems={profileSelectItems.employmentStatus} placeholder='Select employment status' />
                  <SelectInput isNotEditable={isNotEditable} name={'educationAttainment'} form={form} label={'Education Attainment:'} classNameInput={'capitalize'} selectItems={profileSelectItems.educationAttainment} placeholder='Select employment status' />
                  {/* <BirthdayInput isNotEditable={isNotEditable} name={'birthday'} form={form} label={'Birthday:'} classNameInput={'capitalize'} /> */}
                </div>
              </div>
              <div className='mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left '>Birthdate & Birth Place</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <BirthdayInput isNotEditable={isNotEditable} name={'birthday'} form={form} label={'Birthday:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'birthPlaceCity'} type={'text'} form={form} label={'City/Municipality:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'birthPlaceProvince'} type={'text'} form={form} label={'Province:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'birthPlaceRegion'} type={'text'} form={form} label={'Region:'} classNameInput={'capitalize'} />
                </div>
              </div>
              <div className='flex-1 mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left'>Learner/Trainee/Student (Clients) </h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <SelectInput
                    isNotEditable={isNotEditable}
                    name={'learnerOrTraineeOrStudentClassification'}
                    form={form}
                    label={'Classification:'}
                    classNameInput={'capitalize'}
                    selectItems={profileSelectItems.learnerOrTraineeOrStudentClassification}
                    placeholder='Select employment status'
                  />
                </div>
              </div>
              <h1 className='text-lg sm:text-xl font-bold text-center mt-7'>Additional Information for Student Enrolling/Enrolled </h1>
              <h1 className='text-sm sm:text-[18px] font-medium border-b text-center mb-4'>
                Applicant in <span className='text-green-500'>{profile.courseId.category}</span>
              </h1>
              <h1 className='text-sm sm:text-[18px] font-medium border-b text-center mb-4 flex flex-col'>
                <div className="">
                  Enrollment Status: <span className='text-green-500'>{profile.enrollStatus}</span>
                </div>
                <div className='text-sm font-normal flex w-full justify-center items-center'> 
                  <Link href={'/courses'} className='hover:underline hover:text-blue-600 text-blue-500 space-y-2'>
                    <Button size={'sm'} type='button' className='w-auto flex gap-2'>
                      {' '}
                      View Enrollment Info 👉{' '}
                    </Button>
                  </Link>
                </div>
              </h1>
              {isNotEditable ? (
                <>
                  <div className='grid lg:grid-cols-4 sm:grid-cols-2'>
                    <div className='grid grid-cols-1'>
                      <div className=''>Student Photo</div>
                      <StudentPhoto user={profile} />
                    </div>
                    <div className='grid grid-cols-1'>
                      <div className=''>PSA Birth Certificate</div>
                      <PSAFile user={profile} />
                    </div>
                    <div className='grid grid-cols-1'>
                      <div className=''>Good Moral</div>
                      <GoodMoralFile user={profile} />
                    </div>
                    <div className='grid grid-cols-1'>
                      <div className=''>Report Card (Form 138)/Informative copy of TOR</div>
                      <ReportCardFile user={profile} />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className='flex flex-col mt-5 mb-3'>
                    <div className='font-medium text-[16px] text-orange-500'>Note </div>
                    <div className=''>You may leave the file or photo field empty if you do not wish to update it at this time. The current file or photo will remain unchanged.</div>
                  </div>
                  <div className='grid grid-cols-1 xs:grid-cols-2 w-full gap-5'>
                    <EditPSAFile handleSelectedFile={handleSelectedFile} handleRemoveFile={handleRemoveFile} handleClick={handleClick} fileInputRef={fileInputRef} filePreview={filePreview} fileError={fileError} isUploading={isUploading} />
                    <EditStudentPhoto
                      handleSelectedPhoto={handleSelectedPhoto}
                      handleRemovePhoto={handleRemovePhoto}
                      handleClickPhoto={handleClickPhoto}
                      PhotoInputRef={PhotoInputRef}
                      photoPreview={photoPreview}
                      photoError={photoError}
                      isUploading={isUploading}
                    />
                    <EditGoodMoralFile
                      handleSelectedFileGoodMoral={handleSelectedFileGoodMoral}
                      handleRemoveFileGoodMoral={handleRemoveFileGoodMoral}
                      handleClickFileGoodMoral={handleClickFileGoodMoral}
                      fileGoodMoralInputRef={fileGoodMoralInputRef}
                      fileGoodMoralPreview={fileGoodMoralPreview}
                      fileGoodMoralError={fileGoodMoralError}
                      isUploading={isUploading}
                    />
                    <EditReportCardFile
                      handleSelectedFileTOR={handleSelectedFileTOR}
                      handleRemoveFileTOR={handleRemoveFileTOR}
                      handleClickFileTOR={handleClickFileTOR}
                      fileTORInputRef={fileTORInputRef}
                      fileTORPreview={fileTORPreview}
                      fileTORError={fileTORError}
                      isUploading={isUploading}
                    />
                  </div>
                </>
              )}
              <div className='mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left'>Educational Background</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <Input isNotEditable={isNotEditable} name={'primarySchoolName'} type={'text'} form={form} label={'Primary School Name:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'primarySchoolYear'} type={'text'} form={form} label={'Year Graduated:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'secondarySchoolName'} type={'text'} form={form} label={'Secondary School Name:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'secondarySchoolYear'} type={'text'} form={form} label={'Year Graduated:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'seniorHighSchoolName'} type={'text'} form={form} label={'Senior High School Name:'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} name={'seniorHighSchoolYear'} type={'text'} form={form} label={'Year Graduated:'} />
                  <Input isNotEditable={isNotEditable} name={'seniorHighSchoolStrand'} type={'text'} form={form} label={'Strand:'} />
                </div>
              </div>
              <div className='mb-5 lg:mb-0'>
                <h1 className='text-lg font-bold border-b text-left'>Parent&apos;s Information</h1>
                <div className={`space-y-3 mt-2 mb-3`}>
                  <Input isNotEditable={isNotEditable} label={`Father's Last Name:`} type={'text'} form={form} name={'FathersLastName'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} label={`Father's First Name:`} type={'text'} form={form} name={'FathersFirstName'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} label={`Father's Middle Name:`} type={'text'} form={form} name={'FathersMiddleName'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} label={`Father's Contact Number:`} type={'text'} form={form} name={'FathersContact'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} label={`Mother's Last Name:`} type={'text'} form={form} name={'MothersLastName'} classNameInput={'capitalize'} />
                  <Input isNotEditable={isNotEditable} label={`Mother's First Name:`} type={'text'} form={form} name={'MothersFirstName'} />
                  <Input isNotEditable={isNotEditable} label={`Mother's Middle Name:`} type={'text'} form={form} name={'MothersMiddleName'} />
                  <Input isNotEditable={isNotEditable} label={`Mother's Contact Number:`} type={'text'} form={form} name={'MothersContact'} classNameInput={'capitalize'} />
                </div>
              </div>
            </div>
          </CardContent>
          {!isNotEditable && (
            <CardFooter className='w-full flex justify-center items-center '>
              <Button type='submit' className=' bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide' onClick={form.handleSubmit(onSubmit)}>
                Submit
              </Button>
            </CardFooter>
          )}
        </form>
      </Card>
    </Form>
  );
};

export default ProfileTabEnrollCollege;
