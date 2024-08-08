'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import React from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SelectInput } from './SelectInput';
import { Form } from '@/components/ui/form';
import { SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { EnrollmentStep1 } from '@/lib/validators/Validator';
import { coursesData } from '@/constant/test/courses';

const Step1 = () => {
  const form = useForm<z.infer<typeof EnrollmentStep1>>({
    resolver: zodResolver(EnrollmentStep1),
    defaultValues: {
      course: '',
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
                <SelectInput label='course' form={form} name={'Course'} selectItems={coursesData} placeholder='Select course' />
                <SelectInput label='studentYear' form={form} name={'studentYear'} selectItems={coursesData} placeholder='studentYear' />
                <SelectInput label='studentSemester' form={form} name={'studentSemester'} selectItems={coursesData} placeholder='studentSemester' />
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
