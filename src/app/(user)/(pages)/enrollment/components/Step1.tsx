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
import { makeToastError } from '@/lib/toast/makeToast';
import FileBirth from './FileBirth';
import Photo from './Photo';
type IProps = {
  search: any;
  enrollment: any;
};
const Step1 = ({ search, enrollment }: IProps) => {
  const [photoPreview, setPhotoPreview] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState('');
  const PhotoInputRef = useRef<HTMLInputElement>(null);
  console.log(photoPreview);

  const [filePreview, setFilePreview] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { data: s } = useSession();
  const { data: res, isLoading: isCoursesLoading, error: isCoursesError } = useCourseQuery();
  useEffect(() => {
    if (!enrollment) return;
    if (isCoursesError || !res || !res.courses) {
      return;
    }
    if (res) console.log('courses logs:', res.courses);
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
  const handleRemoveFile = () => setFilePreview(null);
  const handleRemovePhoto = () => setPhotoPreview(null);
  const mutation = useEnrollmentStep1Mutation();
  const deleteMutation = useEnrollmentDeleteMutation();
  const form = useForm<z.infer<typeof EnrollmentStep1>>({
    resolver: zodResolver(EnrollmentStep1),
    defaultValues: {
      courseCode: search !== null ? search.toLowerCase() : '',
      studentStatus: '',
      studentYear: '',
      studentSemester: '',
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof EnrollmentStep1>> = async (data) => {
    console.log(data);
    const formData = new FormData();
    formData.append('file', filePreview!);
    formData.append('photo', photoPreview!);
    data.courseCode = data.courseCode.toLowerCase();
    data.studentSemester = data.studentSemester.toLowerCase()
    const dataa = {
      ...data,
      userId: s?.user.id,
      formData: formData,
    };
    console.log(dataa);
    // const EData = {
    //   ...data,

    // };
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
            return;
          default:
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
    <TabsContent value='1' className='p-5 focus-visible:ring-0 border-0'>
      {enrollment && enrollment?.onProcess ? (
        <>
          <Card className={`${enrollment?.onProcess ? 'min-h-[35vh] shadow-none drop-shadow-none items-center justify-center flex border-0' : ''}`}>
            <CardHeader className='space-y-3 hidden'>
              <CardTitle className=' hidden'>Waiting for Approval!</CardTitle>
              <CardDescription className='text-center hidden'></CardDescription>
            </CardHeader>
            <CardContent className='flex w-full justify-center flex-col rounded-lg shadow-sm bg-white items-center border focus-visible:ring-0 space-y-5 px-0 mx-0'>
              <div className='w-full flex flex-col items-center justify-center h-full'>
                <div className='w-full flex justify-center items-center md:my-4'>
                  <Icons.hourglass className='md:h-14 md:w-14 h-10 w-10 my-3 stroke-green-400 animate-spin' style={{ animationDuration: '6s' }} />
                </div>
                <h1 className='text-center text-xl sm:text-3xl font-bold font-poppins text-green-400 px-4'>Awaiting Confirmation!</h1>
                <span className='text-sm text-left sm:mt-10 mt-5 w-full px-5 sm:px-10'>
                  Dear{' '}
                  <span className='font-semibold capitalize'>
                    <span className='capitalize'>{enrollment.profileId.firstname} </span>
                    <span className='capitalize'>{enrollment.profileId.lastname}</span>
                  </span>
                  ,
                </span>
                <span className='text-sm text-left mt-4 px-5 sm:px-10 w-full'>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please wait a couple of hours, once the administrator sees your submission, they will begin reviewing your credentials and process it right away. After approval, you will automatically proceed to step 2,
                  and we will notify you via email and on this website. If you have any questions or need further assistance, please do not hesitate to contact us +639123456789
                </span>
              </div>
              <div className='flex flex-col w-full space-y-3'>
                <span className='text-left sm:text-center w-full px-5 sm:px-10 mt-5 sm:mt-10 text-sm text-muted-foreground'>
                  <span className=' relative sm:hidden'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>If you are undecided with your course you can cancel it anytime.
                </span>
                <div className=' w-full flex justify-center items-center'>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant={'outline'} size={'sm'} className='select-none focus-visible:ring-0 text-[15px] bg-red text-white tracking-normal font-medium font-poppins'>
                        Cancel Enrollment
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className='bg-white'>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>This action cannot be undone. This will permanently delete your account and remove your data from our servers.</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className='hover:bg-slate-100 focus-visible:ring-0 '>Cancel</AlertDialogCancel>
                        <AlertDialogAction type='submit' className='border rounded-lg hover:bg-slate-100 focus-visible:ring-0 ' onClick={() => handleDeleteEnrollment(enrollment._id)}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card className={`${enrollment?.onProcess ? 'min-h-[35vh] shadow-none drop-shadow-none items-center justify-center flex border-0' : ''}`}>
            <CardHeader className='space-y-3'>
              <CardTitle className='text-center lg:text-left font-poppins'>Step 1</CardTitle>
              <CardDescription>Make changes to your account here. Click save when you&apos;re done.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form action='' method='post' onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className='w-full space-y-2'>
                  <div className='flex flex-col gap-4 w-full'>
                    <div className='grid sm:grid-cols-2 gap-4 w-full'>
                      <SelectInput label='Course name' form={form} name={'courseCode'} selectItems={res?.courses!} placeholder='Select course' />
                      <SelectInput label='Student Status' form={form} name={'studentStatus'} selectItems={selectType.studentStatus} placeholder='Select semester' />
                      <SelectInput label='Student year' form={form} name={'studentYear'} selectItems={studentYearData} placeholder='Select year' />
                      <SelectInput label='Student semester' form={form} name={'studentSemester'} selectItems={studentSemesterData} placeholder='Select semester' />
                    </div>
                    <div className='flex flex-col w-full sm:flex-row sm:gap-0 gap-4'>
                      <FileBirth handleSelectedFile={handleSelectedFile} handleRemoveFile={handleRemoveFile} handleClick={handleClick} fileInputRef={fileInputRef} filePreview={filePreview} fileError={fileError} isUploading={isUploading} />
                      <Photo handleSelectedPhoto={handleSelectedPhoto} handleRemovePhoto={handleRemovePhoto} handleClickPhoto={handleClickPhoto} PhotoInputRef={PhotoInputRef} photoPreview={photoPreview} photoError={photoError} isUploading={isUploading} />
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
        </>
      )}
    </TabsContent>
  );
};

export default Step1;
