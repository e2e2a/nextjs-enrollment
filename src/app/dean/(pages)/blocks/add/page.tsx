'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useSession } from 'next-auth/react';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import TextareaField from './components/Textarea';
import Input from './components/Input';
import { SelectInput } from './components/SelectInput';
import { studentSemesterData, studentYearData } from '@/constant/enrollment';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { BlockValidatorInCollege } from '@/lib/validators/block/create/college';
import { useCreateCourseBlockMutation } from '@/lib/queries/blocks/create';

const Page = () => {
  const [isNotEditable, setIsNotEditable] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const { data: pData, isLoading: pload, error: pError } = useProfileQueryBySessionId();

  useEffect(() => {
    if (!pData || pError) return;

    if (pData) {
      return setIsPageLoading(false);
    }
  }, [pData, pError]);

  const mutation = useCreateCourseBlockMutation();
  const formCollege = useForm<z.infer<typeof BlockValidatorInCollege>>({
    resolver: zodResolver(BlockValidatorInCollege),
    defaultValues: {
      category: 'College',
      courseCode: `123`,
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
            if (res.message) makeToastSucess(res.message);
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
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='border py-5 bg-white rounded-xl'>
          {pData?.error && pData?.status === 404 && <div className=''>404</div>}
          {pData?.error && pData?.status > 500 && <div className=''>Something Went Wrong</div>}
          {pData?.profile && !pData?.error && (
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
                      <SelectInput name={'year'} selectItems={studentYearData} form={formCollege} label={'Select Block Year:'} placeholder={'Select block year'} />
                      <SelectInput name={'semester'} selectItems={studentSemesterData} form={formCollege} label={'Select Block Semester:'} placeholder={'Select block semester'} />
                      <Input name={'section'} type={'text'} form={formCollege} label={'Block type:'} classNameInput={'capitalize'} />
                      <TextareaField name={'description'} type={'text'} form={formCollege} label={'Description'} classNameInput={'capitalize'} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                      <Button type='submit' disabled={isNotEditable} variant={'destructive'} className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>
                        Register now!
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
