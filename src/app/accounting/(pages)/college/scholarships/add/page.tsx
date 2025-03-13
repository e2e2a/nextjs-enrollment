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
import Image from 'next/image';
import { SelectInput } from './components/SelectInputs';
import LoaderPage from '@/components/shared/LoaderPage';
import { ScholarshipValidator } from '@/lib/validators/scholarship';
import { useAllProfileQueryByUserRoles } from '@/lib/queries/profile/get/roles/admin';
import { Combobox } from './components/Combobox';
import { ComboboxExempted } from './components/ComboboxExempted';
import { useCreateScholarshipMutation } from '@/lib/queries/scholarship/create';
import { studentSemesterData, studentYearData } from '@/constant/enrollment';

const excemptedItems = [
  { value: 'Tuition Fee' },
  { value: 'Miscellaneous Fees' },
  // { value: 'Laboratory Fees' },
  // { value: 'Library Fees' },
  // { value: 'Athletic Fees' },
  // { value: 'Medical and Dental Fees' },
  // { value: 'Guidance and Counseling Fees' },
  // { value: 'Computer Fees' },
  // { value: 'Energy Fee (Electricity & Water)' },
  // { value: 'Development Fee' },
  { value: 'Departmental Fee' },
  { value: 'SSG Fee' },
];

const typeItems = [
  { value: 'percentage', title: 'percentage' },
  { value: 'fixed', title: 'fixed' },
];

const availableScholarship = [{ title: 'Working Student' }, { title: 'Person with Disability Discount' }, { title: 'Tulong Dunong Scholarship' }, { title: 'TES Scholarship' }, { title: 'Corporate Scholar' }, { title: 'Family Discount' }];

const percentageItems = Array.from({ length: 20 }, (_, i) => {
  const percentage = (i + 1) * 5;
  return {
    title: `${percentage}%`,
    value: (percentage / 100).toString(),
  };
});

const Page = () => {
  const [studentId, setStudentId] = useState('');
  const [isPending, setIsPending] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const { data, error } = useAllProfileQueryByUserRoles('STUDENT');

  useEffect(() => {
    if (error || !data) return;
    if (data) {
      return setIsPageLoading(false);
    }
  }, [data, error]);

  const mutation = useCreateScholarshipMutation();
  const form = useForm<z.infer<typeof ScholarshipValidator>>({
    resolver: zodResolver(ScholarshipValidator),
    defaultValues: {
      category: 'College',
      studentId: '',
      year: '',
      semester: '',
      type: '',
      amount: '',
      name: '',
      discountPercentage: '',
      exemptedFees: [],
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof ScholarshipValidator>> = async (data) => {
    setIsPending(true);
    data.studentId = studentId;

    mutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            form.reset();
            setSelectedItems([]);
            makeToastSucess(res.message);
            return;
          default:
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };

  const type = form.watch('type');

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='border-0 bg-white rounded-xl min-h-[87vh]'>
          <Card className='border-0 py-5 bg-transparent'>
            <CardHeader className='space-y-3'>
              <CardTitle className='text-lg xs:text-2xl sm:text-3xl tracking-tight w-full text-center uppercase'>Add New Scholarship Student</CardTitle>
              <CardDescription className='text-xs sm:text-sm hidden'></CardDescription>
              <div className='text-xs sm:text-sm'>
                <div className=''>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To create a new student scholarship, fill out the form below. This section allows you to specify the student&apos;s scholarship details, applicable discounts, and exempted fees. Providing accurate information
                  ensures proper billing and fee management for the student.
                </div>
              </div>
            </CardHeader>
            <Form {...form}>
              <form method='post' onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-4'>
                <CardContent className='w-full'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <Combobox name={'studentId'} selectItems={data?.profiles || []} form={form} label={'Select Student:'} placeholder={'Select Student'} setStudentId={setStudentId} />
                    <SelectInput name={'name'} selectItems={availableScholarship} form={form} label={'Scholarship Name:'} placeholder={'Select Scholarship Name'} />
                    <SelectInput name={'year'} selectItems={studentYearData} form={form} label={'Year:'} placeholder={'Select Year'} />
                    <SelectInput name={'semester'} selectItems={studentSemesterData} form={form} label={'Semester:'} placeholder={'Select Semester'} />
                    <SelectInput name={'type'} selectItems={typeItems} form={form} label={'Type:'} placeholder={'Select Type'} />
                    {type === 'percentage' && (
                      <>
                        <SelectInput name={'discountPercentage'} selectItems={percentageItems} form={form} label={'Discount Percentage:'} placeholder={'Select Discount Percentage'} />
                        <ComboboxExempted name={'exemptedFees'} selectItems={excemptedItems} form={form} label={'Exempted Fees:'} placeholder={'Select Exempted Fees'} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                      </>
                    )}

                    {type === 'fixed' && <Input name={'amount'} type={'number'} form={form} label={'Amount:'} classNameInput={'uppercase'} />}
                  </div>
                </CardContent>
                <CardFooter className=''>
                  <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                    <Button type='submit' variant={'destructive'} disabled={isPending} className='bg-blue-500 hover:bg-blue-700 text-white font-semibold tracking-wide'>
                      {isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Submit'}
                    </Button>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      )}
    </>
  );
};

export default Page;
