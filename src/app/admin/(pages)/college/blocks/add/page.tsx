'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import TextareaField from './components/Textarea';
import Input from './components/Input';
import { SelectInput } from './components/SelectInput';
import { studentSemesterData, studentYearData } from '@/constant/enrollment';
import { useCourseQueryByCategory } from '@/lib/queries/courses/get/category';
import { BlockValidatorInCollege } from '@/lib/validators/block/create/college';
import { useCreateCourseBlockMutation } from '@/lib/queries/blocks/create';

const Page = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [course, setCourse] = useState<any[]>([]);
  const { data: cData, isLoading, isError } = useCourseQueryByCategory('College');
  useEffect(() => {
    if (!cData || !cData.courses || isError) return;

    if (cData) return setCourse(cData.courses);
  }, [cData, isLoading, isError]);
  const mutation = useCreateCourseBlockMutation();

  const formCollege = useForm<z.infer<typeof BlockValidatorInCollege>>({
    resolver: zodResolver(BlockValidatorInCollege),
    defaultValues: {
      category: 'College',
      courseCode: '',
      year: '',
      semester: '',
      section: '',
      description: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof BlockValidatorInCollege>> = async (data) => {
    setIsNotEditable(true);

    mutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            formCollege.reset();
            if (res.message) makeToastSucess(`New Block has been added ${data.courseCode.toUpperCase()}`);
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
          <CardTitle className='text-lg xs:text-2xl sm:text-3xl text-center w-full uppercase'>Add a New Block in Course</CardTitle>
          <CardDescription className='text-xs sm:text-sm'>
            &nbps;&nbps;&nbps;&nbps;To register a new block, start by selecting the course from the list provided. This list is populated with courses created and managed by the administrator. Next, specify the academic year and semester for the block to
            ensure it is correctly aligned with the course schedule. Providing this information will help synchronize the block with the appropriate course and academic period.
          </CardDescription>
        </CardHeader>
        <Form {...formCollege}>
          <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
            <CardContent className='w-full '>
              <div className='flex flex-col gap-4'>
                {/* <SelectInput name={'category'} selectItems={selectType.courseType} form={form} label={'Select Category:'} placeholder={'Select course'} setCategorySelected={setCategorySelected} /> */}
                <SelectInput name={'courseCode'} selectItems={course} form={formCollege} label={'Select Course:'} placeholder={'Select course'} />
                <SelectInput name={'year'} selectItems={studentYearData} form={formCollege} label={'Select Block Year:'} placeholder={'Select block year'} />
                <SelectInput name={'semester'} selectItems={studentSemesterData} form={formCollege} label={'Select Block Semester:'} placeholder={'Select block semester'} />
                <Input name={'section'} type={'text'} form={formCollege} label={'Block type:'} classNameInput={''} />
                <TextareaField name={'description'} type={'text'} form={formCollege} label={'Description'} classNameInput={'capitalize'} />
              </div>
            </CardContent>
            <CardFooter>
              <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                <Button type='submit' disabled={isNotEditable} variant={'destructive'} className='bg-blue-500 hover:bg-blue-700 text-white font-semibold tracking-wide'>
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
