'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import React, { useEffect } from 'react';
import { SelectInput } from './SelectInput';
import { Form } from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnrollmentStep1 } from '@/lib/validators/Validator';
import { studentSemesterData, studentYearData } from '@/constant/test/courses';
import { useCourseQuery, useEnrollmentDeleteMutation, useEnrollmentStep1Mutation } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Icons } from '@/components/shared/Icons';
type IProps = {
  search: any;
  enrollment: any;
};
const Step1 = ({ search, enrollment }: IProps) => {
  console.log('enrollment step: ', enrollment);
  const { data: s } = useSession();
  const session = s?.user;
  const { data: res, isLoading: isCoursesLoading, error: isCoursesError } = useCourseQuery();
  useEffect(() => {
    if (isCoursesError || !res || !res.courses) {
      return;
    }
    // if (res) console.log('courses logs:', res.courses)
  }, [res, isCoursesLoading, isCoursesError]);
  const mutation = useEnrollmentStep1Mutation();
  const deleteMutation = useEnrollmentDeleteMutation();
  const form = useForm<z.infer<typeof EnrollmentStep1>>({
    resolver: zodResolver(EnrollmentStep1),
    defaultValues: {
      courseCode: search !== null ? search.toLowerCase() : '',
      studentYear: '',
      studentSemester: '',
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof EnrollmentStep1>> = async (data) => {
    console.log(data);
    const EData = {
      ...data,
      userId: session?.id,
    };
    mutation.mutate(EData, {
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

  //implement cancelation of enrollment by deleting the enrollment model by the enrollment found ${enrollment}
  console.log(enrollment);
  const handleDeleteEnrollment = (EId: any) => {
    deleteMutation.mutate(EId, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            console.log(res);
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
      {enrollment?.onProcess ? (
        <>
          <Card className={`${enrollment?.onProcess ? 'min-h-[35vh] shadow-none drop-shadow-none items-center justify-center flex border-0' : ''}`}>
            <CardHeader className='space-y-3 hidden'>
              <CardTitle className=' hidden'>Waiting for Approval!</CardTitle>
              <CardDescription className='text-center hidden'></CardDescription>
            </CardHeader>
            <CardContent className='flex w-full justify-center flex-col items-center border-0 focus-visible:ring-0 space-y-5 px-0 mx-0'>
              <div className='w-full flex flex-col items-center justify-center h-full'>
                <div className='w-full flex justify-center items-center md:my-4'>
                    <Icons.hourglass className='md:h-14 md:w-14 h-10 w-10 my-3 stroke-green-400 animate-spin' style={{ animationDuration: '6s' }}/>
                </div>
                <h1 className='text-center text-xl sm:text-3xl font-bold font-poppins text-green-400'>Wating for Approval!</h1>
                <span className='text-sm text-center mt-2'>This may take time to review your credentials. We will notify you as soon as possible.</span>
              </div>
              <div className='flex flex-col w-full space-y-3'>
                <span className='text-center text-sm text-muted-foreground'>If you are undecided with your course you can cancel it anytime.</span>
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
              <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
            </CardHeader>
            <Form {...form}>
              <form action='' method='post' onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className='w-full space-y-2'>
                  <div className='flex flex-col gap-4'>
                    <SelectInput label='Course name' form={form} name={'courseCode'} selectItems={res?.courses!} placeholder='Select course' />
                    <SelectInput label='Student year' form={form} name={'studentYear'} selectItems={studentYearData} placeholder='Select year' />
                    <SelectInput label='Student semester' form={form} name={'studentSemester'} selectItems={studentSemesterData} placeholder='Select semester' />
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
