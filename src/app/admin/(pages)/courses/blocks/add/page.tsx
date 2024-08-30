'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CourseBlockValidator } from '@/lib/validators/Validator';
import { Form } from '@/components/ui/form';
import { useSession } from 'next-auth/react';
import { useCourseQuery, useCreateCourseBlockMutation, useCreateCourseMutation } from '@/lib/queries';
import { makeToastError } from '@/lib/toast/makeToast';
import TextareaField from './components/Textarea';
import Input from './components/Input';
import { SelectInput } from './components/SelectInput';
import { studentSemesterData, studentYearData } from '@/constant/enrollment';

const Page = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [course, setCourse] = useState<any[]>([]);
  const { data: cData, isLoading, isError } = useCourseQuery();
  useEffect(() => {
    if (!cData || !cData.courses || isError) return;

    if (cData) return setCourse(cData.courses);
  }, [cData, isLoading, isError]);
  const mutation = useCreateCourseBlockMutation();
  const { data } = useSession();
  const session = data?.user;
  const form = useForm<z.infer<typeof CourseBlockValidator>>({
    resolver: zodResolver(CourseBlockValidator),
    defaultValues: {
      courseCode: '',
      year: '',
      semester: '',
      section: '',
      description: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof CourseBlockValidator>> = async (data) => {
   
    data.courseCode = data.courseCode.toLowerCase()
    data.section = data.section.toLowerCase()

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
        onSettled: () => {
          
        },
      });
  };
  return (
    <div className='border py-5 bg-white rounded-xl'>
      <Card className='border-0 bg-transparent'>
        <CardHeader className='space-y-3'>
          <CardTitle className='text-left text-lg xs:text-2xl sm:text-3xl font-poppins'>Register a New Block in Course!</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>To register a new block, start by selecting the course from the list provided. This list is populated with courses created and managed by the administrator. Next, specify the academic year and semester for the block to ensure it is correctly aligned with the course schedule. Providing this information will help synchronize the block with the appropriate course and academic period.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className='w-full space-y-2'>
              <div className='flex flex-col gap-4'>
                <SelectInput name={'courseCode'} selectItems={course} form={form} label={'Select Course:'} placeholder={'Select course'} />
                <SelectInput name={'year'} selectItems={studentYearData} form={form} label={'Select block year:'} placeholder={'Select block year'} />
                <SelectInput name={'semester'} selectItems={studentSemesterData} form={form} label={'Select block semester:'} placeholder={'Select block semester'} />
                <Input name={'section'} type={'text'} form={form} label={'Block type:'} classNameInput={'capitalize'} />
                <TextareaField name={'description'} type={'text'} form={form} label={'Description'} classNameInput={'capitalize'} />
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
