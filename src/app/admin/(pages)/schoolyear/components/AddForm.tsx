'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { z } from 'zod';
import { SchoolYearValidator } from '@/lib/validators/AdminValidator';
import { Checkbox } from '@/components/ui/checkbox';
import { useCreateSchoolYearMutation } from '@/lib/queries';

const AddForm = () => {
  const [value, setValue] = useState('');
  const mutation = useCreateSchoolYearMutation();
  const form = useForm<z.infer<typeof SchoolYearValidator>>({
    resolver: zodResolver(SchoolYearValidator),
    defaultValues: {
      schoolYear: '',
      isEnable: false,
    },
  });
  const handleChange = (e: any) => {
    let inputValue = e.target.value;
    // Optionally, format input value if necessary
    setValue(inputValue);
  };
  const actionFormSubmit = (data: z.infer<typeof SchoolYearValidator>) => {
    console.log(data)
    data.schoolYear = data.schoolYear.toLowerCase();
    mutation.mutate(data, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // setTypeMessage('success');
            // setMessage(res?.message);
            // return (window.location.href = '/');
            console.log(res);
            return;
          default:
            //create maketoast
            return;
        }
      },
      onSettled: () => {},
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'sm'} className={' focus-visible:ring-0 flex mb-2 bg-transparent bg-green-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'}>
          <Icons.add className='h-4 w-4' />
          <span className='hidden sm:flex'>Add New School Year</span>
          <span className='flex sm:hidden'>Add New SY</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-md w-full bg-white focus-visible:ring-0 '
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className='flex flex-col space-y-1'>
            <span>Add New School Year</span>
          </DialogTitle>
          <DialogDescription>Adding new school year to student.</DialogDescription>
          <div className='flex flex-col text-sm'>
            <span>
              <span className='text-orange-400'>Format</span>: SY1999-2000
            </span>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form action='' method='post' className='gap-4 flex flex-col'>
            <FormField
              control={form.control}
              name={'schoolYear'}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className='relative bg-slate-50 rounded-lg'>
                      <input
                        type={'text'}
                        id={'schoolYear'}
                        className={` uppercase block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-slate-50 border border-gray-200 appearance-nonefocus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom`}
                        onDragStart={(e) => e.preventDefault()}
                        placeholder=''
                        maxLength={11}
                        {...field}
                      />

                      <label
                        htmlFor={'schoolYear'}
                        className='pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
                      >
                        {'School year'}
                      </label>
                    </div>
                  </FormControl>
                  <FormMessage className='text-red pl-2' />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={'isEnable'}
              render={({ field }) => (
                <FormItem className='flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4'>
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />

                  </FormControl>
                    <div className='space-y-1 leading-none'>
                      <FormLabel>Use enable settings for school year</FormLabel>
                      <FormDescription>
                        By enabling this setting it will auto display the value in enrolling of the student.
                      </FormDescription>
                    </div>
                  <FormMessage className='text-red pl-2' />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter className='justify-end flex flex-row'>
          <Button type='submit' onClick={form.handleSubmit(actionFormSubmit)} variant='secondary'>
            Submit
          </Button>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddForm;
