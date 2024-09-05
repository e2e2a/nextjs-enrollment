'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { SubjectCollegeValidator } from '@/lib/validators/Validator';
import { Form } from '@/components/ui/form';
import { useSession } from 'next-auth/react';
import { useCreateSubjectCollegeMutation } from '@/lib/queries';
import { makeToastError } from '@/lib/toast/makeToast';
import Input from './components/Input';

const Page = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);

  const mutation = useCreateSubjectCollegeMutation();
  const { data } = useSession();
  const session = data?.user;
  const formCollege = useForm<z.infer<typeof SubjectCollegeValidator>>({
    resolver: zodResolver(SubjectCollegeValidator),
    defaultValues: {
      category: "College",
      subjectCode: '',
      name: '',
      lec: '',
      lab: '',
      unit: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof SubjectCollegeValidator>> = async (data) => {
    data.subjectCode = data.subjectCode.toLowerCase();
  
    console.log('data', data);
    mutation.mutate(data, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // return (window.location.reload());
            // form.reset();
            return;
          default:
            if (res.error) return makeToastError(res.error);
            return;
        }
      },
      onError: (error) => {
        console.error(error.message);
      },
      onSettled: () => {},
    });
  };
  return (
    <div className='border py-5 bg-white rounded-xl'>
      <Card className='border-0 bg-transparent'>
        <CardHeader className='space-y-3'>
          <CardTitle className='text-left text-lg xs:text-2xl sm:text-3xl font-poppins'>Register a New Block in Course!</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            To register a new block, start by selecting the course from the list provided. This list is populated with courses created and managed by the administrator. Next, specify the academic year and semester for the block to ensure it is correctly
            aligned with the course schedule. Providing this information will help synchronize the block with the appropriate course and academic period.
          </CardDescription>
        </CardHeader>
        <Form {...formCollege}>
          <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
            <CardContent className='w-full '>
              <div className='flex flex-col gap-4'>
                {/* <SelectInput name={'category'} selectItems={selectType.courseType} form={form} label={'Select Category:'} placeholder={'Select course'} setCategorySelected={setCategorySelected} /> */}
                <Input name={'subjectCode'} type={'text'} form={formCollege} label={'Subject Code:'} classNameInput={'capitalize'} />
                <Input name={'name'} type={'text'} form={formCollege} label={'Descriptive Title:'} classNameInput={'capitalize'} />
                <Input name={'lec'} type={'text'} form={formCollege} label={'Lec:'} classNameInput={'capitalize'} />
                <Input name={'lab'} type={'text'} form={formCollege} label={'Lab:'} classNameInput={'capitalize'} />
                <Input name={'unit'} type={'text'} form={formCollege} label={'Unit:'} classNameInput={'capitalize'} />
              </div>
            </CardContent>
            <CardFooter>
              <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                <Button type='submit' variant={'destructive'} className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>
                  Register now!
                </Button>
              </div>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default Page;
