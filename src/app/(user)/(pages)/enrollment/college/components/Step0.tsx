'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import React, { useEffect, useRef, useState } from 'react';
import { SelectInput } from './SelectInput';
import { Form } from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEnrollmentDeleteMutation } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import { selectType, studentYearData } from '@/constant/enrollment';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import FileBirth from './FileBirth';
import Photo from './Photo';
import FileGoodMoral from './FileGoodMoral';
import FileTOR from './FileTOR';
import Image from 'next/image';
import Input from './Input';
import { StudentProfileExtension } from '@/lib/validators/profile/extension';
import { SelectCourse } from './SelectCourse';
import InputDisabled from './InputDisabled';
import { useCreateEnrollmentByCategoryMutation } from '@/lib/queries/enrollment/create';

type IProps = {
  search: any;
  enrollmentSetup: any;
  courses: any;
};

const Step0 = ({ search, enrollmentSetup, courses }: IProps) => {
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

  const [selectedCourse, setSelectedCourse] = useState(search || '');
  const [isCourseError, setIsCourseError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const handleSelectedPhoto = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 1000000) {
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
      if (files[0].size < 1000000) {
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
      if (files[0].size < 1000000) {
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
      if (files[0].size < 1000000) {
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
  const mutation = useCreateEnrollmentByCategoryMutation();
  const deleteMutation = useEnrollmentDeleteMutation();
  const form = useForm<z.infer<typeof StudentProfileExtension>>({
    resolver: zodResolver(StudentProfileExtension),
    defaultValues: {
      studentStatus: '',
      studentYear: '',

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
    },
  });

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsPending(true);
    if (!selectedCourse) {
      setIsPending(false);
      setIsCourseError('Please select a course');
      return;
    }

    const isProfileValid = await form.trigger();
    if (!isProfileValid) return setIsPending(false);

    const formData = new FormData();
    if (!photoPreview) {
      setIsPending(false);
      setPhotoError('Student Photo is required.');
      return;
    }
    formData.append('photo', photoPreview!);
    if (!filePreview) {
      setIsPending(false);
      setPhotoError('Student Photo is required.');
      return;
    }
    formData.append('filePsa', filePreview);
    const isAnyFilePresent = fileGoodMoralPreview || fileTORPreview;

    if (!isAnyFilePresent) {
      setFileGoodMoralError('Good Moral is required.');
      setTORError('Report Card is required.');
      setIsPending(false);
    } else {
      setFileGoodMoralError('');
      setTORError('');

      if (fileGoodMoralPreview) {
        formData.append('fileGoodMoral', fileGoodMoralPreview);
      }

      if (fileTORPreview) {
        formData.append('fileTOR', fileTORPreview);
      }
    }

    const profileData = form.getValues();
    profileData.studentYear = profileData.studentYear.toLowerCase();
    const dataa = {
      ...profileData,
      courseCode: selectedCourse,
      formData: formData,
      category: 'College',
    };

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setTimeout(() => {
              makeToastSucess(`You are enrolling to this course ${selectedCourse.toUpperCase()}`);
            }, 500);
            setIsPending(false);
            setSelectedCourse(search || '');
            form.reset()
            return;
          default:
            setIsPending(false);
            makeToastError(res.error);
            return;
        }
      },
    });
  };

  const handleDeleteEnrollment = (EId: any) => {
    deleteMutation.mutate(EId, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            console.log(res);
            if (res.error) return window.location.reload();
            return;
          default:
            return;
        }
      },
    });
  };
  return (
    <TabsContent value='0' className=' focus-visible:ring-0 border-0'>
      <Card className={`border-0 shadow-none drop-shadow-none `}>
        <CardHeader className='space-y-3'>
          <CardTitle className=''>
            <div className='flex flex-col justify-center gap-y-1 items-center'>
              <div className=''>
                <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={75} height={75} alt='nothing to say' />
              </div>
              <div className='text-center lg:text-left font-poppins tracking-tight'>Online Enrollment Form</div>
            </div>
          </CardTitle>
          <CardDescription>
            To proceed with your enrollment, please ensure all required fields are completed. Accurate and complete information is essential for successful registration. Double-check your details before submitting to avoid any delays in processing your
            enrollment. If you have trouble filling out any fields, please check out our documentation or contact us at <span className='text-blue-500 cursor-pointer'>+639123456789</span> for further information.
          </CardDescription>
        </CardHeader>
        <form action='' className='' method='post' onSubmit={(e) => onSubmit(e)}>
          <Form {...form}>
            <CardContent className='w-full space-y-2'>
              <div className='flex flex-col gap-4 w-full'>
                <div className='grid sm:grid-cols-2 gap-4 w-full'>
                  <SelectCourse selectItems={courses} placeholder='Select course' isCourseError={isCourseError} selectedCourse={selectedCourse} setSelectedCourse={setSelectedCourse} />
                  <SelectInput label='Student Status' form={form} name={'studentStatus'} selectItems={selectType.studentStatus} placeholder='Select status' />
                  <SelectInput label='Select year' form={form} name={'studentYear'} selectItems={studentYearData} placeholder='Select year' />
                  {/* <SelectInput label='Select semester' form={form} name={'studentSemester'} selectItems={studentSemesterData} placeholder='Select semester' /> */}
                  <InputDisabled label={`Semester`} type='text' disabled={true} value={enrollmentSetup.enrollmentTertiary.semester} />
                  <InputDisabled label={`School Year`} type='text' disabled={true} value={enrollmentSetup.enrollmentTertiary.schoolYear} />
                </div>
                <div className='grid grid-cols-1 xs:grid-cols-2 w-full gap-5'>
                  <FileBirth handleSelectedFile={handleSelectedFile} handleRemoveFile={handleRemoveFile} handleClick={handleClick} fileInputRef={fileInputRef} filePreview={filePreview} fileError={fileError} isUploading={isPending} />
                  <Photo handleSelectedPhoto={handleSelectedPhoto} handleRemovePhoto={handleRemovePhoto} handleClickPhoto={handleClickPhoto} PhotoInputRef={PhotoInputRef} photoPreview={photoPreview} photoError={photoError} isUploading={isPending} />
                  <FileGoodMoral
                    handleSelectedFileGoodMoral={handleSelectedFileGoodMoral}
                    handleRemoveFileGoodMoral={handleRemoveFileGoodMoral}
                    handleClickFileGoodMoral={handleClickFileGoodMoral}
                    fileGoodMoralInputRef={fileGoodMoralInputRef}
                    fileGoodMoralPreview={fileGoodMoralPreview}
                    fileGoodMoralError={fileGoodMoralError}
                    isUploading={isPending}
                  />
                  <FileTOR
                    handleSelectedFileTOR={handleSelectedFileTOR}
                    handleRemoveFileTOR={handleRemoveFileTOR}
                    handleClickFileTOR={handleClickFileTOR}
                    fileTORInputRef={fileTORInputRef}
                    fileTORPreview={fileTORPreview}
                    fileTORError={fileTORError}
                    isUploading={isPending}
                  />
                </div>
                <div className='mt-4'>
                  <h1 className='font-semibold text-[14px] sm:text-[16px] uppercase'>Educational Background</h1>
                  <div className='grid sm:grid-cols-2 md:grid-cols-3 items-start gap-4 w-full'>
                    <div className='flex flex-col gap-2'>
                      <Input label='Primary School Name' type='text' form={form} name={'primarySchoolName'} />
                      <Input label='Year Graduated' type='text' form={form} name={'primarySchoolYear'} />
                    </div>
                    <div className='flex flex-col gap-2'>
                      <Input label='Secondary School Name' type='text' form={form} name={'secondarySchoolName'} />
                      <Input label='Year Graduated' type='text' form={form} name={'secondarySchoolYear'} />
                    </div>
                    <div className='flex flex-col gap-2'>
                      <Input label='Senior High School Name' type='text' form={form} name={'seniorHighSchoolName'} />
                      <Input label='Year Graduated' type='text' form={form} name={'seniorHighSchoolYear'} />
                      <Input label='Strand' type='text' form={form} name={'seniorHighSchoolStrand'} classNameInput={''} />
                    </div>
                  </div>
                </div>
                <div className='mt-4'>
                  <h1 className='font-semibold text-[14px] sm:text-[16px] uppercase'>Parent&apos;s Information (Put N/A if not applicable)</h1>
                  <div className='grid sm:grid-cols-2 gap-4 w-full'>
                    <div className='flex flex-col gap-2'>
                      <Input label={`Father's Last Name`} type='text' form={form} name={'FathersLastName'} />
                      <Input label={`Father's First Name`} type='text' form={form} name={'FathersFirstName'} />
                      <Input label={`Father's Middle Name`} type='text' form={form} name={'FathersMiddleName'} />
                      <Input label={`Father's Contact Number`} type='text' form={form} name={'FathersContact'} />
                    </div>
                    <div className='flex flex-col gap-2'>
                      <Input label={`Mother's Last Name`} type='text' form={form} name={'MothersLastName'} />
                      <Input label={`Mother's First Name`} type='text' form={form} name={'MothersFirstName'} />
                      <Input label={`Mother's Middle Name`} type='text' form={form} name={'MothersMiddleName'} />
                      <Input label={`Mother's Contact Number`} type='text' form={form} name={'MothersContact'} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                <Button type='submit' disabled={isPending} className=' bg-blue-500 hover:bg-blue-400 text-white font-medium tracking-wide'>
                  {isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Submit'}
                </Button>
              </div>
            </CardFooter>
          </Form>
        </form>
      </Card>
    </TabsContent>
  );
};

export default Step0;
