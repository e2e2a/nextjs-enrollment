'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Input from './components/Input';
import { SubjectValidator } from '@/lib/validators/subject/create';
import { useSubjectQueryById } from '@/lib/queries/subjects/get/id';
import { useUpdateSubjectByIdMutation } from '@/lib/queries/subjects/update/id';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = ({ params }: { params: { id: string } }) => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const { data: subjectData, error } = useSubjectQueryById(params.id);

  useEffect(() => {
    if (error || !subjectData) return;

    if (subjectData) {
      if (subjectData.subject) {
        setIsError(false);
        setIsPageLoading(false);
      }
      if (subjectData.error) {
        if (subjectData.status === 404 || subjectData.status === 500) {
          setIsError(true);
        }
      }
    }
  }, [subjectData, error]);

  const mutation = useUpdateSubjectByIdMutation();
  const formCollege = useForm<z.infer<typeof SubjectValidator>>({
    resolver: zodResolver(SubjectValidator),
    defaultValues: {
      category: 'College',
      preReq: '',
      subjectCode: '',
      name: '',
      lec: '',
      lab: '',
      unit: '',
    },
  });

  useEffect(() => {
    formCollege.setValue('preReq', subjectData?.subject?.preReq);
    formCollege.setValue('subjectCode', subjectData?.subject?.subjectCode);
    formCollege.setValue('name', subjectData?.subject?.name);
    formCollege.setValue('lec', subjectData?.subject?.lec);
    formCollege.setValue('lab', subjectData?.subject?.lab);
    formCollege.setValue('unit', subjectData?.subject?.unit);
  }, [formCollege, subjectData]);

  const onSubmit: SubmitHandler<z.infer<typeof SubjectValidator>> = async (data) => {
    setIsNotEditable(true);
    const dataa = { ...data, id: subjectData?.subject?._id, category: 'College' };
    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            return makeToastSucess('Subject has been updated.');
          default:
            return makeToastError(res.error);
        }
      },
      onSettled: () => {
        setIsNotEditable(false);
      },
    });
  };
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <>
          {isError && <div className=''>404</div>}
          {subjectData && !isError && !subjectData.error && (
            <div className='border py-5 bg-white rounded-xl'>
              <Card className='border-0 bg-transparent'>
                <CardHeader className='space-y-3'>
                  <CardTitle className='text-lg xs:text-2xl sm:text-3xl text-center w-full uppercase'>Add a New Subject!</CardTitle>
                  <CardDescription className='text-xs sm:text-sm'>
                    &nbsp;&nbsp;&nbsp;&nbsp;Easily add a new subject by filling out the required details below. Each subject you add will contribute to the growth and diversity of our educational offerings, enriching the learning experiences of students.
                    Let&apos;s work together to create an engaging and comprehensive academic environment!
                  </CardDescription>
                </CardHeader>
                <Form {...formCollege}>
                  <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
                    <CardContent className='w-full '>
                      <div className='flex flex-col gap-4'>
                        <Input name={'preReq'} type={'text'} form={formCollege} label={'Pre. Req.:'} classNameInput={''} />
                        <Input name={'subjectCode'} type={'text'} form={formCollege} label={'Subject Code:'} classNameInput={''} />
                        <Input name={'name'} type={'text'} form={formCollege} label={'Descriptive Title:'} classNameInput={''} />
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
          )}
        </>
      )}
    </>
  );
};

export default Page;
