'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import React, { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSession } from 'next-auth/react';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Image from 'next/image';
import Input from './Input';
import { EnrollmentOldStudentFormValidator } from '@/lib/validators/enrollment/create/oldStudent';
import { useCreateEnrollmentForOldStudentByCategoryMutation } from '@/lib/queries/enrollment/create/oldStudent';

type IProps = {
  profile: any;
  enrollmentSetup: any;
};
const CollegeOldStudent = ({ profile, enrollmentSetup }: IProps) => {
  const { data: s } = useSession();
  const mutation = useCreateEnrollmentForOldStudentByCategoryMutation();

  const form = useForm<z.infer<typeof EnrollmentOldStudentFormValidator>>({
    resolver: zodResolver(EnrollmentOldStudentFormValidator),
    defaultValues: {
      studentStatus: '',
      studentYear: '',
      studentSemester: '',
      schoolYear: '',

      numberStreet: '',
      barangay: '',
      district: '',
      cityMunicipality: '',
      province: '',
      contact: '',
      civilStatus: '',
    },
  });

  useEffect(() => {
    form.setValue('studentStatus', profile.studentStatus);
    form.setValue('studentSemester', enrollmentSetup.enrollmentTertiary.semester);
    form.setValue('schoolYear', enrollmentSetup.enrollmentTertiary.schoolYear);
    if (profile.studentSemester === '1st semester') {
      form.setValue('studentYear', profile.studentYear);
    } else if (profile.studentSemester === '2nd semester') {
      switch (profile.studentYear) {
        case '1st year':
          form.setValue('studentYear', '2nd year');
          break;
        case '2nd year':
          form.setValue('studentYear', '3rd year');
          break;
        case '3rd year':
          form.setValue('studentYear', '4th year');
          break;
        case '4th year':
          form.setValue('studentYear', '5th year');
          break;
        default:
          break;
      }
    }
  }, [profile, form, enrollmentSetup]);

  const onSubmit: SubmitHandler<z.infer<typeof EnrollmentOldStudentFormValidator>> = async (data) => {
    data.studentYear = data.studentYear.toLowerCase();
    data.studentSemester = data.studentSemester.toLowerCase();
    data.schoolYear = data.schoolYear.toLowerCase();
    const dataa = {
      ...data,
      category: 'College',
      userId: s?.user.id,
    };
    console.log(dataa);

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // setMessage(res?.message);
            makeToastSucess(`Enrollment has been processed.`);
            return;
          default:
            // setIsPending(false);
            if (res.error) makeToastError(res?.error);
            return;
        }
      },
      // onSettled: () => {
      //   setIsPending(false);
      // },
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
        <Form {...form}>
          <form action='' className='' method='post' onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className='w-full space-y-2'>
              <div className='flex flex-col gap-4 w-full'>
                <div className='grid sm:grid-cols-2 gap-4 w-full'>
                  {/* <SelectInput label='Student Status' form={form} name={'studentStatus'} selectItems={selectType.studentStatus} placeholder='Select semester' /> */}
                  {/* <SelectInput label='Select year' form={form} name={'studentYear'} selectItems={studentYearData} placeholder='Select year' /> */}
                  {/* <SelectInput label='Select semester' form={form} name={'studentSemester'} selectItems={studentSemesterData} placeholder='Select semester' /> */}
                  <Input label={`Student Status`} type='text' form={form} name={'studentStatus'} disabled={true} />
                  <Input label={`Select Year`} type='text' form={form} name={'studentYear'} disabled={true} />
                  <Input label={`Select semester`} type='text' form={form} name={'studentSemester'} disabled={true} />
                  <Input label={`School Year`} type='text' form={form} name={'schoolYear'} disabled={true} />
                </div>
                <div className='mt-4'>
                  <h1 className='font-semibold text-[14px] sm:text-[16px] uppercase'>Update Your Personal Information</h1>
                  <div className='grid sm:grid-cols-2 gap-4 w-full'>
                    <div className='flex flex-col gap-2'>
                      <Input label={`Number, Street:`} type='text' form={form} name={'numberStreet'} />
                      <Input label={`Barangay:`} type='text' form={form} name={'barangay'} />
                      <Input label={`District:`} type='text' form={form} name={'district'} />
                      <Input label={`City/Municipality:`} type='text' form={form} name={'cityMunicipality'} />
                    </div>
                    <div className='flex flex-col gap-2'>
                      <Input label={`Province:`} type='text' form={form} name={'province'} />
                      <Input label={`Contact No:`} type='text' form={form} name={'contact'} />
                      <Input label={`Civil Status:`} type='text' form={form} name={'civilStatus'} />
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

export default CollegeOldStudent;
