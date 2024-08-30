'use client';
import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CourseValidator } from '@/lib/validators/Validator';
import { Form } from '@/components/ui/form';
import Photo from './components/Photo';
import { useSession } from 'next-auth/react';
import Input from './components/Input';
import TextareaField from './components/Textarea';
import { useCreateCourseMutation } from '@/lib/queries';
import { makeToastError } from '@/lib/toast/makeToast';
import CourseToast from '@/lib/toast/CourseToast';

const Page = () => {
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [photoError, setPhotoError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mutation = useCreateCourseMutation();
  const { data } = useSession();
  const session = data?.user;
  const form = useForm<z.infer<typeof CourseValidator>>({
    resolver: zodResolver(CourseValidator),
    defaultValues: {
      courseCode: '',
      name: '',
      description: '',
    },
  });
  const handleSelectedFile = (files: FileList | null) => {
    if (files && files?.length > 0) {
      if (files[0].size < 10000000) {
        setPhotoError('');
        const file = files[0];
        setImageFile(file);
        // Preview the image
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);

      } else {
        makeToastError('File size too large');
      }
    }
  };
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  const onSubmit: SubmitHandler<z.infer<typeof CourseValidator>> = async (data) => {
    if (imageFile) {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', imageFile!);
      data.name = data.name.toLowerCase()
      const dataa = {
        ...data,
        formData: formData,
      };
      console.log(dataa);

      mutation.mutate(dataa, {
        onSuccess: (res) => {
          console.log(res);
          switch (res.status) {
            case 200:
            case 201:
            case 203:
              // return (window.location.reload());
              CourseToast(data.courseCode, imagePreview!);

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
                <Input isNotEditable={isNotEditable} name={'courseCode'} type={'text'} form={form} label={'Course Code:'} classNameInput={'capitalize'} />
                <Input isNotEditable={isNotEditable} name={'name'} type={'text'} form={form} label={'Course Name:'} classNameInput={'capitalize'} />
                <TextareaField isNotEditable={isNotEditable} name={'description'} type={'text'} form={form} label={'Description:'} classNameInput={'capitalize'} />
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
