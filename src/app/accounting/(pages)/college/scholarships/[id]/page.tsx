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
import { studentSemesterData, studentYearData } from '@/constant/enrollment';
import { useScholarshipQueryById } from '@/lib/queries/scholarship/get/id';
import { Icons } from '@/components/shared/Icons';
import { useUpdateScholarshipMutation } from '@/lib/queries/scholarship/update/id';

const excemptedItems = [{ value: 'Tuition Fee' }, { value: 'Miscellaneous Fees' }];

const typeItems = [
  { value: 'percentage', title: 'percentage' },
  { value: 'fixed', title: 'fixed' },
];

const availableScholarship = [
  { title: 'Working Student' },
  { title: 'Person with Disability Discount' },
  { title: 'Alay Lakad Scholar' },
  { title: 'Tulong Dunong Scholarship' },
  { title: 'TES Scholarship' },
  { title: 'Corporate Scholar' },
  { title: 'Family Discount' },
];

const percentageItems = Array.from({ length: 20 }, (_, i) => {
  const percentage = (i + 1) * 5;
  return {
    title: `${percentage}%`,
    value: (percentage / 100).toString(),
  };
});

const Page = ({ params }: { params: { id: string } }) => {
  const [studentId, setStudentId] = useState<string | undefined>('');
  const [studentName, setStudentName] = useState<string | undefined>('');
  const [isPending, setIsPending] = useState(false);
  const [isNotEditable, setIsNotEditable] = useState(true);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  const { data: sData, error: sError } = useScholarshipQueryById(params.id);
  const { data, error } = useAllProfileQueryByUserRoles('STUDENT');

  useEffect(() => {
    if (error || !data) return;
    if (sError || !sData) return;
    if (data) {
      return setIsPageLoading(false);
    }
  }, [data, sData, sError, error]);

  const mutation = useUpdateScholarshipMutation();
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

  useEffect(() => {
    const name = `${sData?.scholarship?.profileId?.lastname ? sData?.scholarship?.profileId?.lastname + ',' : ''}${sData?.scholarship?.profileId?.firstname ?? ''} ${sData?.scholarship?.profileId?.middlename ?? ''}${
      sData?.scholarship?.profileId?.extensionName ? ', ' + sData?.scholarship?.profileId?.extensionName + '.' : ''
    }`
      .replace(/\s+,/g, ',')
      .replace(/(\S),/g, '$1,')
      .replace(/,(\S)/g, ', $1')
      .trim();
    setStudentId(sData?.scholarship?.profileId?._id);
    setStudentName(name);
    form.setValue('studentId', `${name}`);
    form.setValue('year', sData?.scholarship?.year);
    form.setValue('semester', sData?.scholarship?.semester);
    form.setValue('type', sData?.scholarship?.type);
    form.setValue('amount', sData?.scholarship?.amount);
    form.setValue('name', sData?.scholarship?.name);
    form.setValue('discountPercentage', String(sData?.scholarship?.discountPercentage));
    setSelectedItems(sData?.scholarship?.exemptedFees);
    form.setValue('exemptedFees', sData?.scholarship?.exemptedFees);
  }, [form, sData, isNotEditable]);

  const onSubmit: SubmitHandler<z.infer<typeof ScholarshipValidator>> = async (data) => {
    if (!studentId) return makeToastError('Must select a student.');
    setIsPending(true);
    data.studentId = studentId;
    const dataa = { ...data, scholarshipId: sData?.scholarship?._id };

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setSelectedItems([]);
            setIsNotEditable(true);
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

  const handleEditable = async () => {
    setIsNotEditable(!isNotEditable);
    form.reset();
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
              <CardTitle className='text-lg xs:text-2xl sm:text-3xl tracking-tight w-full text-center uppercase'>Edit Scholarship Student</CardTitle>
              <CardDescription className='text-xs sm:text-sm hidden'></CardDescription>
              <div className='text-xs sm:text-sm'>
                <div className=''>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To edit a student scholarship, fill out the form below. This section allows you to specify the student&apos;s scholarship details, applicable discounts, and exempted fees. Providing accurate information ensures
                  proper billing and fee management for the student.
                </div>
              </div>
              <div className='flex justify-end mb-5'>
                <div className='bg-slate-200 hover:bg-slate-300 relative right-2 rounded-xl py-1.5 px-2 cursor-pointer flex items-center gap-1' title='Edit' onClick={handleEditable}>
                  <Icons.squarePen className='h-5 w-5 fill-white stroke-blue-600 relative' />
                  <span className='hidden sm:flex tracking-normal text-sm'>Edit</span>
                </div>
              </div>
            </CardHeader>
            <Form {...form}>
              <form method='post' onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-4'>
                <CardContent className='w-full'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    {isNotEditable ? (
                      <div className=''>
                        <span className='text-[16px] font-medium'>
                          Student: <span className=' capitalize font-semibold'>{studentName}</span>
                        </span>
                      </div>
                    ) : (
                      <Combobox name={'studentId'} selectItems={data?.profiles || []} form={form} label={'Select Student:'} placeholder={'Select Student'} fullname={`${studentName}`} setStudentId={setStudentId} />
                    )}
                    <SelectInput name={'name'} selectItems={availableScholarship} isNotEditable={isNotEditable} form={form} label={'Scholarship Name:'} placeholder={'Select Scholarship Name'} scholarship={sData?.scholarship} />
                    <SelectInput name={'year'} selectItems={studentYearData} isNotEditable={isNotEditable} form={form} label={'Year:'} placeholder={'Select Year'} scholarship={sData?.scholarship} />
                    <SelectInput name={'semester'} selectItems={studentSemesterData} isNotEditable={isNotEditable} form={form} label={'Semester:'} placeholder={'Select Semester'} scholarship={sData?.scholarship} />
                    <SelectInput name={'type'} selectItems={typeItems} isNotEditable={isNotEditable} form={form} label={'Type:'} placeholder={'Select Type'} scholarship={sData?.scholarship} />
                    {type === 'percentage' && (
                      <>
                        <SelectInput name={'discountPercentage'} selectItems={percentageItems} isNotEditable={isNotEditable} form={form} label={'Discount Percentage:'} placeholder={'Select Discount Percentage'} scholarship={sData?.scholarship} />

                        {isNotEditable ? (
                          <div className=''>
                            <span className='text-[16px] font-medium'>
                              Exempted: <span className=' capitalize font-semibold'>{sData?.scholarship?.exemptedFees.join(', ')}</span>
                            </span>
                          </div>
                        ) : (
                          <ComboboxExempted name={'exemptedFees'} selectItems={excemptedItems} form={form} label={'Exempted Fees:'} placeholder={'Select Exempted Fees'} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                        )}
                      </>
                    )}

                    {type === 'fixed' && <Input name={'amount'} type={'number'} isNotEditable={isNotEditable} form={form} label={'Amount:'} classNameInput={'uppercase'} />}
                  </div>
                </CardContent>
                <CardFooter className=''>
                  {!isNotEditable && (
                    <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                      <Button type='submit' variant={'destructive'} disabled={isPending} className='bg-blue-500 hover:bg-blue-700 text-white font-semibold tracking-wide'>
                        {isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Submit'}
                      </Button>
                    </div>
                  )}
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
