'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import Photo from './components/Photo';
import Input from './components/Input';
import TextareaField from './components/Textarea';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Image from 'next/image';
import { CourseValidatorInCollege } from '@/lib/validators/course/create/college';
import { useCourseQueryById } from '@/lib/queries/courses/get/id';
import { useUpdateCourseByIdMutation } from '@/lib/queries/courses/update/id';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = ({ params }: { params: { id: string } }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mutation = useUpdateCourseByIdMutation();
  const { data: courseData, error } = useCourseQueryById(params.id || 'e2e2a');

  useEffect(() => {
    if (error || !courseData) return;
    if (courseData) {
      if (courseData.course) {
        setIsError(false);
        setIsPageLoading(false);
      }
      if (courseData.error) {
        if (courseData.status === 404 || courseData.status === 500) {
          setIsError(true);
        }
      }
    }
  }, [courseData, error]);

  const form = useForm<z.infer<typeof CourseValidatorInCollege>>({
    resolver: zodResolver(CourseValidatorInCollege),
    defaultValues: {
      courseCode: '',
      name: '',
      category: 'College',
      description: '',
    },
  });

  useEffect(() => {
    form.setValue('courseCode', courseData?.course?.courseCode);
    form.setValue('name', courseData?.course?.name);
    form.setValue('description', courseData?.course?.description);
  }, [form, courseData]);

  const handleSelectedFile = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 1000000) {
        setPhotoError('');
        const file = files[0];
        setImageFile(file);
      } else {
        makeToastError('File size too large');
      }
    }
  };

  useEffect(() => {
    if (imageFile) {
      const reader = new FileReader();
      reader.readAsDataURL(imageFile);
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
    }
  }, [imageFile]);
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const onSubmit: SubmitHandler<z.infer<typeof CourseValidatorInCollege>> = async (data) => {
    setIsUploading(true);
    const formData = new FormData();
    if (imageFile) {
      formData.append('image', imageFile);
    }
    const dataa = {
      ...data,
      id: courseData?.course?._id,
      ...(imageFile ? { formData: formData } : {}),
    };

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            return makeToastSucess(res.message);
          default:
            return makeToastError(res.error);
        }
      },
      onSettled: () => {
        setIsUploading(false);
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
          {courseData && !isError && !courseData.error && (
            <div className='border py-5 bg-white rounded-xl'>
              <Card className='border-0 bg-transparent'>
                <CardHeader className='space-y-3'>
                  <CardTitle className='text-center text-3xl font-poppins'>Register a new course!</CardTitle>
                  <CardDescription className='hidden'>Make changes to your account here. Click save when you&apos;re done.</CardDescription>
                </CardHeader>
                <Form {...form}>
                  <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
                    <CardContent className='w-full space-y-2'>
                      <Photo handleSelectedFile={handleSelectedFile} handleClick={handleClick} fileInputRef={fileInputRef} link={courseData?.course?.imageUrl} imagePreview={imagePreview} photoError={photoError} isUploading={isUploading} />

                      <div className='flex flex-col gap-4'>
                        <Input name={'courseCode'} type={'text'} form={form} label={'Course Initialism:'} classNameInput={''} />
                        <Input name={'name'} type={'text'} form={form} label={'Course Name:'} classNameInput={''} />
                        <TextareaField name={'description'} form={form} label={'Description:'} classNameInput={'capitalize'} />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                        <Button type='submit' disabled={isUploading} variant={'destructive'} className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>
                          {isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Submit'}
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
