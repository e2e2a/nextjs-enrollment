'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/form';
import { z } from 'zod';
import { ProspectusValidator } from '@/lib/validators/AdminValidator';
import { useUpdateCurriculumLayerMutation } from '@/lib/queries';
import { SelectInput } from './SelectInput';
import { studentSemesterData, studentYearData } from '@/constant/enrollment';
import Input from './Input';

interface IProps {
  c: any;
}

const AddForm = ({ c }: IProps) => {
  const [value, setValue] = useState('');
  const mutation = useUpdateCurriculumLayerMutation();
  const form = useForm<z.infer<typeof ProspectusValidator>>({
    resolver: zodResolver(ProspectusValidator),
    defaultValues: {
      year: '',
      semester: '',
      order: '0',
    },
  });
  const handleChange = (e: any) => {
    let inputValue = e.target.value;
    // Optionally, format input value if necessary
    setValue(inputValue);
  };
  const actionFormSubmit = (data: z.infer<typeof ProspectusValidator>) => {
    data.year = data.year.toLowerCase();
    data.semester = data.semester.toLowerCase();
    const dataa = {
      ...data,
      CId: c._id
    }
    mutation.mutate(dataa, {
      onSuccess: (res: any) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // return (window.location.href = '/');
            return;
          default:
            return;
        }
      },
      onSettled: () => {},
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild >
        <Button size={'sm'} className={'focus-visible:ring-0 flex mb-7 bg-transparent bg-green-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'}>
          <Icons.add className='h-4 w-4' />
          <span className='flex'>Add Curriculum Layer</span>
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
            <span>Add New Curriculum Layer</span>
          </DialogTitle>
          <DialogDescription>Please fill the year, semester and List Order to follow.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form action='' method='post' className='gap-4 flex flex-col'>
            <SelectInput name={'year'} selectItems={studentYearData} form={form} label={'Select Year:'} placeholder={'Select Year'} />
            <SelectInput name={'semester'} selectItems={studentSemesterData} form={form} label={'Select Semester:'} placeholder={'Select Semester'} />
            <Input name={'order'} form={form} type={'text'} label={'List Order:'} classNameInput={''} />
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
