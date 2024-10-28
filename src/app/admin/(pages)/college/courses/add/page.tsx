'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import Photo from './components/Photo';
import { useSession } from 'next-auth/react';
import Input from './components/Input';
import TextareaField from './components/Textarea';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import CourseToast from '@/lib/toast/CourseToast';
import { useCreateCourseMutation } from '@/lib/queries/courses/create/admin';
import Image from 'next/image';
import { CourseValidatorInCollege } from '@/lib/validators/course/create/college';

const Page = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mutation = useCreateCourseMutation();
  const { data } = useSession();
  const session = data?.user;
  const form = useForm<z.infer<typeof CourseValidatorInCollege>>({
    resolver: zodResolver(CourseValidatorInCollege),
    defaultValues: {
      courseCode: '',
      name: '',
      category: 'College',
      description: '',
    },
  });
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
    if (imageFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('image', imageFile);
      data.courseCode = data.courseCode.toLowerCase();
      data.name = data.name.toLowerCase();
      const dataa = {
        ...data,
        formData: formData,
      };

      mutation.mutate(dataa, {
        onSuccess: (res) => {
          switch (res.status) {
            case 200:
            case 201:
            case 203:
              console.log('res', res);
              // CourseToast(data.courseCode, imagePreview!);
              if (res.message) makeToastSucess(res.message);
              return;
            default:
              if (res.error) return makeToastError(res.error);
              return;
          }
        },
        onSettled: () => {
          setIsUploading(false);
          form.reset();
          setImageFile(null);
          setImagePreview(null);
        },
      });
    } else {
      setPhotoError('Photo is required...');
    }
  };
  return (
    <div className='border py-5 bg-white rounded-xl'>
      <Card className='border-0 bg-transparent'>
        <CardHeader className='space-y-3'>
          <CardTitle className='text-center text-3xl font-poppins'>Register a new course!</CardTitle>
          <CardDescription className='hidden'>Make changes to your account here. Click save when you&apos;re done.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
            {/* <CardContent className='w-full space-y-2' onSubmit={form.handleSubmit(onSubmit)}> */}
            <CardContent className='w-full space-y-2'>
              <Photo session={session} handleSelectedFile={handleSelectedFile} handleClick={handleClick} fileInputRef={fileInputRef} imagePreview={imagePreview} photoError={photoError} isUploading={isUploading} />

              <div className='flex flex-col gap-4'>
                {/* <SelectInput name={'category'} selectItems={selectType.courseType} form={form} label={'Select Course Category:'} placeholder={'Select Course Category'} /> */}
                <Input name={'courseCode'} type={'text'} form={form} label={'Course Initialism:'} classNameInput={'uppercase'} />
                <Input name={'name'} type={'text'} form={form} label={'Course Name:'} classNameInput={'capitalize'} />
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
  );
};

export default Page;
