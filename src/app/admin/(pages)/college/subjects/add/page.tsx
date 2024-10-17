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
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Input from './components/Input';

const Page = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);

  const mutation = useCreateSubjectCollegeMutation();
  const { data } = useSession();
  const session = data?.user;
  const formCollege = useForm<z.infer<typeof SubjectCollegeValidator>>({
    resolver: zodResolver(SubjectCollegeValidator),
    defaultValues: {
      category: 'College',
      fixedRateAmount: '0.00',
      preReq: '',
      subjectCode: '',
      name: '',
      lec: '',
      lab: '',
      unit: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof SubjectCollegeValidator>> = async (data) => {
    setIsNotEditable(true);
    data.subjectCode = data.subjectCode.toLowerCase();

    mutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // return (window.location.reload());
            formCollege.reset();
            makeToastSucess('New Subject has been added.');
            return;
          default:
            if (res.error) return makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsNotEditable(false);
      },
    });
  };
  return (
    <div className='border py-5 bg-white rounded-xl'>
      <Card className='border-0 bg-transparent'>
        <CardHeader className='space-y-3'>
          <CardTitle className='text-lg xs:text-2xl sm:text-3xl text-center w-full uppercase'>Add a New Subject!</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            &nbsp;&nbsp;&nbsp;&nbsp;Easily add a new subject by filling out the required details below. Each subject you add will contribute to the growth and diversity of our educational offerings, enriching the learning experiences of students. Let&apos;s
            work together to create an engaging and comprehensive academic environment!
          </CardDescription>
        </CardHeader>
        <Form {...formCollege}>
          <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
            <CardContent className='w-full '>
              <div className='flex flex-col gap-4'>
                {/* <SelectInput name={'category'} selectItems={selectType.courseType} form={form} label={'Select Category:'} placeholder={'Select course'} setCategorySelected={setCategorySelected} /> */}
                <Input name={'fixedRateAmount'} type={'text'} form={formCollege} label={'Rate Amount:'} classNameInput={'capitalize'} />
                <Input name={'preReq'} type={'text'} form={formCollege} label={'Pre. Req.:'} classNameInput={'capitalize'} />
                <Input name={'subjectCode'} type={'text'} form={formCollege} label={'Subject Code:'} classNameInput={'capitalize'} />
                <Input name={'name'} type={'text'} form={formCollege} label={'Descriptive Title:'} classNameInput={'capitalize'} />
                <Input name={'lec'} type={'text'} form={formCollege} label={'Lec:'} classNameInput={'capitalize'} />
                <Input name={'lab'} type={'text'} form={formCollege} label={'Lab:'} classNameInput={'capitalize'} />
                <Input name={'unit'} type={'text'} form={formCollege} label={'Unit:'} classNameInput={'capitalize'} />
              </div>
            </CardContent>
            <CardFooter>
              <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                <Button type='submit' disabled={isNotEditable} variant={'destructive'} className='bg-blue-500 hover:bg-blue-700 text-white font-semibold'>
                  Submit
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
