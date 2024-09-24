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
import { EnrollmentStep1 } from '@/lib/validators/Validator';
import { useCourseQuery, useEnrollmentDeleteMutation, useEnrollmentStep1Mutation } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Icons } from '@/components/shared/Icons';
import { selectType, studentSemesterData, studentYearData } from '@/constant/enrollment';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import FileBirth from './FileBirth';
import Photo from './Photo';
import FileGoodMoral from './FileGoodMoral';
import FileTOR from './FileTOR';
import Image from 'next/image';
import Input from './Input';
type IProps = {
  search: any;
  enrollment: any;
};
const Step0 = ({ search, enrollment }: IProps) => {
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
  const { data: s } = useSession();
  const { data: res, isLoading: isCoursesLoading, error: isCoursesError } = useCourseQuery();
  useEffect(() => {
    if (!enrollment) return;
    if (isCoursesError || !res || !res.courses) {
      return;
    }
    if (res) console.log('me and you');
  }, [res, isCoursesLoading, isCoursesError, enrollment]);
  const handleSelectedPhoto = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 10000000) {
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
      if (files[0].size < 10000000) {
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
      if (files[0].size < 10000000) {
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
      if (files[0].size < 10000000) {
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
  const mutation = useEnrollmentStep1Mutation();
  const deleteMutation = useEnrollmentDeleteMutation();
  const form = useForm<z.infer<typeof EnrollmentStep1>>({
    resolver: zodResolver(EnrollmentStep1),
    defaultValues: {
      courseCode: search !== null ? search.toLowerCase() : '',
      studentStatus: '',
      studentYear: '',
      studentSemester: '',
      schoolYear: 'SY2024-2025',

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
  const onSubmit: SubmitHandler<z.infer<typeof EnrollmentStep1>> = async (data) => {
    console.log(data);
    const formData = new FormData();
    if (!filePreview) return setFileError('PSA Birth is required.');
    formData.append('filePsa', filePreview!);
    if (!photoPreview) return setPhotoError('Student Photo is required.');
    formData.append('photo', photoPreview!);
    if (!fileGoodMoralPreview) return setFileGoodMoralError('Good Moral is required.');
    formData.append('fileGoodMoral', fileGoodMoralPreview!);
    if (!fileTORPreview) return setTORError('Report Card is required.');
    formData.append('fileTOR', fileTORPreview!);

    data.courseCode = data.courseCode.toLowerCase();
    data.studentYear = data.studentYear.toLowerCase();
    data.studentSemester = data.studentSemester.toLowerCase();
    data.schoolYear = data.schoolYear.toLowerCase();
    const dataa = {
      ...data,
      userId: s?.user.id,
      formData: formData,
    };
    console.log(dataa);

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            console.log(res);
            // setMessage(res?.message);
            // return (window.location.href = '/');
            // return (window.location.reload());
            makeToastSucess(`You are enrolling to this course ${data.courseCode.toUpperCase()}`);
            return;
          default:
            // setIsPending(false);
            // setMessage(res.error);
            // setTypeMessage('error');
            return;
        }
      },
      // onSettled: () => {
      //   setIsPending(false);
      // },
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
            // setMessage(res?.message);
            // return (window.location.reload());
            return;
          default:
            // setMessage(res.error);
            // setTypeMessage('error');
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
                <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={65} height={65} alt='nothing to say' />
              </div>
              <div className='text-center lg:text-left font-poppins'>Online Enrollment Form</div>
            </div>
          </CardTitle>
          <CardDescription>
            To proceed with your enrollment, please ensure all required fields are completed. Accurate and complete information is essential for successful registration. Double-check your details before submitting to avoid any delays in processing your
            enrollment. If you have trouble filling out any fields, please check out our documentation or contact us at <span className='text-blue-500 cursor-pointer'>+639123456789</span> for further information.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form action='' className='' method='post' onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className='w-full space-y-2'>
              <div className='flex flex-col gap-4 w-full'>
                <div className='grid sm:grid-cols-2 gap-4 w-full'>
                  <SelectInput label='Course name' form={form} name={'courseCode'} selectItems={res?.courses!} placeholder='Select course' />
                  <SelectInput label='Student Status' form={form} name={'studentStatus'} selectItems={selectType.studentStatus} placeholder='Select semester' />
                  <SelectInput label='Select year' form={form} name={'studentYear'} selectItems={studentYearData} placeholder='Select year' />
                  <SelectInput label='Select semester' form={form} name={'studentSemester'} selectItems={studentSemesterData} placeholder='Select semester' />
                  <Input label={`School Year`} type='text' form={form} name={'schoolYear'} disabled={true} />
                </div>
                <div className='grid grid-cols-1 xs:grid-cols-2 w-full gap-5'>
                  <FileBirth handleSelectedFile={handleSelectedFile} handleRemoveFile={handleRemoveFile} handleClick={handleClick} fileInputRef={fileInputRef} filePreview={filePreview} fileError={fileError} isUploading={isUploading} />
                  <Photo handleSelectedPhoto={handleSelectedPhoto} handleRemovePhoto={handleRemovePhoto} handleClickPhoto={handleClickPhoto} PhotoInputRef={PhotoInputRef} photoPreview={photoPreview} photoError={photoError} isUploading={isUploading} />
                  <FileGoodMoral
                    handleSelectedFileGoodMoral={handleSelectedFileGoodMoral}
                    handleRemoveFileGoodMoral={handleRemoveFileGoodMoral}
                    handleClickFileGoodMoral={handleClickFileGoodMoral}
                    fileGoodMoralInputRef={fileGoodMoralInputRef}
                    fileGoodMoralPreview={fileGoodMoralPreview}
                    fileGoodMoralError={fileGoodMoralError}
                    isUploading={isUploading}
                  />
                  <FileTOR
                    handleSelectedFileTOR={handleSelectedFileTOR}
                    handleRemoveFileTOR={handleRemoveFileTOR}
                    handleClickFileTOR={handleClickFileTOR}
                    fileTORInputRef={fileTORInputRef}
                    fileTORPreview={fileTORPreview}
                    fileTORError={fileTORError}
                    isUploading={isUploading}
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
                <Button type='submit' variant={'destructive'} className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>
                  Proceed
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </TabsContent>
  );
};

export default Step0;
