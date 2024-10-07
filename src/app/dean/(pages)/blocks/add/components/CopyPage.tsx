'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CourseBlockCollegeValidator } from '@/lib/validators/Validator';
import { Form } from '@/components/ui/form';
import { useSession } from 'next-auth/react';
import { useCourseQuery, useCreateCourseBlockMutation, useCreateCourseMutation } from '@/lib/queries';
import { makeToastError } from '@/lib/toast/makeToast';
import TextareaField from './Textarea';
import Input from './Input';
import { SelectInput } from './SelectInput';
import { studentSemesterData, studentYearData } from '@/constant/enrollment';
import { selectType } from '@/constant/course';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';

const BackUpPage = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [categorySelected, setCategorySelected] = useState('');
  const [courseSelected, setCourseSelected] = useState('');
  const [course, setCourse] = useState<any[]>([]);
  const { data: cData, isLoading, isError } = useCourseQuery();
  useEffect(() => {
    if (!cData || !cData.courses || isError) return;

    if (cData) return setCourse(cData.courses);
  }, [cData, isLoading, isError]);  
  const mutation = useCreateCourseBlockMutation();
  const { data } = useSession();
  const session = data?.user;
  const formCollege = useForm<z.infer<typeof CourseBlockCollegeValidator>>({
    resolver: zodResolver(CourseBlockCollegeValidator),
    defaultValues: {
      courseCode: '',
      year: '',
      semester: '',
      section: '',
      description: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof CourseBlockCollegeValidator>> = async (data) => {
    data.courseCode = data.courseCode.toLowerCase();
    data.section = data.section.toLowerCase();
    const dataa = {
      ...data,
      category: categorySelected
    }
    console.log('data', dataa)
    // mutation.mutate(data, {
    //   onSuccess: (res) => {
    //     console.log(res);
    //     switch (res.status) {
    //       case 200:
    //       case 201:
    //       case 203:
    //         // return (window.location.reload());
    //         // form.reset();
    //         return;
    //       default:
    //         if (res.error) return makeToastError(res.error);
    //         return;
    //     }
    //   },
    //   onError: (error) => {
    //     console.error(error.message);
    //   },
    //   onSettled: () => {},
    // });
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

        <CardContent className='w-full '>
          <div className='flex flex-col gap-4'> 
            {/* <SelectInput name={'category'} selectItems={selectType.courseType} form={form} label={'Select Category:'} placeholder={'Select course'} setCategorySelected={setCategorySelected} /> */}
            <div className='relative bg-slate-50 rounded-lg'>
              <Select
                onValueChange={(e) => {
                  if (setCategorySelected) {
                    setCategorySelected(e);
                  }
                }}
                defaultValue={''}
              >
                <SelectTrigger id={'category'} className='w-full pt-10 pb-4 text-left text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                  <SelectValue placeholder={'Select Category:'} />
                </SelectTrigger>
                <SelectContent className='bg-white border-gray-300'>
                  <SelectGroup>
                    {selectType.courseType &&
                      selectType.courseType.map((item: any, index: any) => {
                        return item.name ? (
                          <SelectItem value={item.courseCode} key={index} className='capitalize'>
                            {item.name}
                          </SelectItem>
                        ) : (
                          <SelectItem value={item.title} key={index} className='capitalize'>
                            {item.title}
                          </SelectItem>
                        );
                      })}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <label
                htmlFor={'category'}
                className={`pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
              >
                {'Select Category'}
              </label>
            </div>
            {categorySelected === 'Nursery' ? (
              <>this is nursery</>
            ) : categorySelected === 'Kindergarten 1&2' ? (
              <>this is kindergarten 1&2</>
            ) : categorySelected === 'Junior High School' ? (
              <>this is Junior High School</>
            ) : categorySelected === 'Senior High School' ? (
              <>this is Senior High School</>
            ) : categorySelected === 'Tesda' ? (
              <>this is Tesda</>
            ) : categorySelected === 'College' ? (
                <Form {...formCollege}>
                  <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
                    <SelectInput name={'courseCode'} selectItems={course} form={formCollege} label={'Select Course:'} placeholder={'Select course'} />
                    <SelectInput name={'year'} selectItems={studentYearData} form={formCollege} label={'Select Block Year:'} placeholder={'Select block year'} />
                    <SelectInput name={'semester'} selectItems={studentSemesterData} form={formCollege} label={'Select Block Semester:'} placeholder={'Select block semester'} />
                    <Input name={'section'} type={'text'} form={formCollege} label={'Block type:'} classNameInput={'capitalize'} />
                    <TextareaField name={'description'} type={'text'} form={formCollege} label={'Description'} classNameInput={'capitalize'} />
                    <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                      <Button type='submit' variant={'destructive'} className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>
                        Register now!
                      </Button>
                    </div>
                  </form>
                </Form>
            ) : null}
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

export default BackUpPage;
