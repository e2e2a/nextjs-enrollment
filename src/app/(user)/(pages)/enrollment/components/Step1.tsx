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
import { useCourseQuery } from '@/lib/queries';

const Step1 = ({search}: any) => {
  const { data: res,isLoading: isCoursesLoading, error: isCoursesError } = useCourseQuery();
  useEffect(() => {
    if (isCoursesError || !res || !res.courses) {
      return;
    }
    if (res) console.log('courses logs:', res.courses)
      
  }, [ res,isCoursesLoading ,isCoursesError]);
  
  const form = useForm<z.infer<typeof EnrollmentStep1>>({
    resolver: zodResolver(EnrollmentStep1),
    defaultValues: {
      course: search || '',
      studentYear: '',
      studentSemester: '',
    },
  });
  const onSubmit: SubmitHandler<z.infer<typeof EnrollmentStep1>> = async (data) => {
    console.log(data);
  };
  return (
    <TabsContent value='1' className='p-5'>
      <Card className='border-0'>
        <CardHeader className='space-y-3'>
          <CardTitle className='text-center lg:text-left font-poppins'>Step 1</CardTitle>
          <CardDescription>Make changes to your account here. Click save when you're done.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form action='' method='post'>
            <CardContent className='w-full space-y-2' onSubmit={form.handleSubmit(onSubmit)}>
              <div className='flex flex-col gap-4'>
                <SelectInput label='Course' form={form} name={'course'} selectItems={res?.courses!} placeholder='Select course' />
                <SelectInput label='Student Year' form={form} name={'studentYear'} selectItems={studentYearData} placeholder='Select year' />
                <SelectInput label='Student Semester' form={form} name={'studentSemester'} selectItems={studentSemesterData} placeholder='Select semester' />
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

export default Step1;
