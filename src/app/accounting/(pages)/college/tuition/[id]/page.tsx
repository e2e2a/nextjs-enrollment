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
import { useCourseQueryByCategory } from '@/lib/queries/courses/get/category';
import { SelectInput } from './components/SelectInputs';
import LoaderPage from '@/components/shared/LoaderPage';
import RegOrMisc from './components/RegOrMisc';
import { CourseFeeValidator } from '@/lib/validators/courseFee/create';
import { useTuitionFeeQueryById } from '@/lib/queries/courseFee/get/id';
import { Icons } from '@/components/shared/Icons';
import { useUpdateTuitionFeeMutation } from '@/lib/queries/courseFee/update';
import { studentYearData } from '@/constant/enrollment';

const Page = ({ params }: { params: { id: string } }) => {
  const [isPending, setIsPending] = useState(false);
  const [isNotEditable, setIsNotEditable] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [regMiscRows, setRegMiscRows] = useState<any[]>([{ name: '', amount: '' }]);

  const { data: tfData, error: isTFError } = useTuitionFeeQueryById(params.id);
  const { data: cData, error } = useCourseQueryByCategory('College');

  useEffect(() => {
    if (error || !cData) return;
    if (isTFError || !tfData) return;
    if (cData && tfData) {
      if (cData.courses && tfData.tFee) {
        setIsPageLoading(false);
        return;
      }
    }
  }, [cData, error, tfData, isTFError]);

  const mutation = useUpdateTuitionFeeMutation();
  const form = useForm<z.infer<typeof CourseFeeValidator>>({
    resolver: zodResolver(CourseFeeValidator),
    defaultValues: {
      courseCode: '',
      year: '',
      ratePerUnit: '0.00',
      ratePerLab: '0.00',
      insuranceFee: '0.00',
      departmentalFee: '0.00',
      ssgFee: '0.00',
      cwtsOrNstpFee: '0.00',
      downPayment: `0.00`,
      ojtFee: `0.00`,
    },
  });

  useEffect(() => {
    form.setValue('courseCode', tfData?.tFee?.courseId?.courseCode);
    form.setValue('year', tfData?.tFee?.year);
    form.setValue('ratePerUnit', tfData?.tFee?.ratePerUnit);
    form.setValue('ratePerLab', tfData?.tFee?.ratePerLab);
    form.setValue('insuranceFee', tfData?.tFee?.insuranceFee);
    form.setValue('departmentalFee', tfData?.tFee?.departmentalFee);
    form.setValue('ssgFee', tfData?.tFee?.ssgFee);
    form.setValue('cwtsOrNstpFee', tfData?.tFee?.cwtsOrNstpFee);
    form.setValue('downPayment', tfData?.tFee?.downPayment);
    form.setValue('ojtFee', tfData?.tFee?.ojtFee);
  }, [form, tfData, isNotEditable]);

  useEffect(() => {
    setRegMiscRows(tfData?.tFee?.regOrMisc || []);
  }, [isNotEditable, tfData]);

  const handleEditable = async () => {
    setIsNotEditable(!isNotEditable);
    form.reset();
  };

  const onSubmit: SubmitHandler<z.infer<typeof CourseFeeValidator>> = async (data) => {
    if (regMiscRows.length === 0) return makeToastError('Please Provide Reg/Misc Fee');
    setIsPending(true);
    for (const row of regMiscRows) {
      const regex = /^\d+(\.\d{1,2})?$/;
      if (!row.name || !row.amount) {
        setIsPending(false);
        makeToastError('Please ensure to fill amount and name in Reg/Misc Fee');
        return;
      }
      if (!regex.test(row.amount)) {
        setIsPending(false);
        makeToastError('Invalid amount in Reg/Misc Fee');
        return;
      }
    }

    const dataa = {
      id: tfData?.tFee?._id,
      category: 'College',
      regMiscRows: regMiscRows,
      ...data,
    };

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            form.reset();
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
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='border-0 bg-white rounded-xl min-h-[87vh]'>
          <Card className='border-0 py-5 bg-transparent'>
            <CardHeader className='space-y-3'>
              <CardTitle className='text-lg xs:text-2xl sm:text-3xl tracking-tight w-full text-center uppercase'>Course Fee</CardTitle>
              <CardDescription className='text-xs sm:text-sm'>Department: {tfData?.tFee?.courseId?.name}</CardDescription>
              {/* <div className='text-xs sm:text-sm'>
                <div className=''>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To create a new Course Tuition Fee, this section allows you to define the tuition rates, lab fees, CWTS/NSTP fees, and any other related charges for a specific course. Providing this information will ensure
                  accurate billing and management of course fees for students.
                </div>
              </div> */}
            </CardHeader>
            <Form {...form}>
              <form method='post' className='w-full space-y-4'>
                <CardContent className='w-full'>
                  <div className='flex justify-end mb-5'>
                    <div className='bg-slate-200 hover:bg-slate-300 relative right-2 rounded-xl py-1.5 px-2 cursor-pointer flex items-center gap-1' title='Edit' onClick={handleEditable}>
                      <Icons.squarePen className='h-5 w-5 fill-white stroke-blue-600 relative' />
                      <span className='hidden sm:flex tracking-normal text-sm'>Edit</span>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <SelectInput isNotEditable={isNotEditable} name={'courseCode'} selectItems={cData.courses} form={form} label={'Course:'} placeholder={'Select Course'} tFee={tfData.tFee} />
                    <SelectInput isNotEditable={isNotEditable} name={'year'} selectItems={studentYearData} form={form} label={'Year:'} placeholder={'Select Year'} tFee={tfData.tFee} />
                    <Input name={'ratePerUnit'} type={'text'} isNotEditable={isNotEditable} form={form} label={'Rate Per Unit:'} classNameInput={'uppercase'} />
                    <Input name={'ratePerLab'} type={'text'} isNotEditable={isNotEditable} form={form} label={'Rate PerLab:'} classNameInput={'uppercase'} />
                  </div>
                  <div className='flex flex-col items-start w-full justify-center mt-10 mb-10'>
                    <h1 className='text-lg font-semibold xs:text-xl sm:text-2xl tracking-tight w-full text-start uppercase'>
                      Additional Fee <span className='text-muted-foreground text-red'>(REQUIRED)</span>
                    </h1>
                    <p className='text-sm text-muted-foreground mt-2'>
                      The Departmental Fee is required every semester, while the Insurance Fee is only required once per year. The SSG Fee is required for the first two payments within a single academic year. After the first two payments, it will no longer be
                      required for the remaining semesters.
                    </p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full'>
                      <Input name={'departmentalFee'} type={'text'} isNotEditable={isNotEditable} form={form} label={'Departmental Fee:'} classNameInput={'uppercase'} />
                      <Input name={'insuranceFee'} type={'text'} isNotEditable={isNotEditable} form={form} label={'Insurance Fee:'} classNameInput={''} />
                      <Input name={'ssgFee'} type={'text'} isNotEditable={isNotEditable} form={form} label={'SSG Fee:'} classNameInput={''} />
                    </div>
                  </div>
                </CardContent>
                <div className=''>
                  <div className='flex flex-col w-full px-7'>
                    <h1 className='text-lg font-semibold xs:text-xl sm:text-2xl tracking-tight w-full text-start uppercase '>Reg/Misc Fees</h1>
                    <p className='text-sm text-muted-foreground mt-2'>Note: Down payment is handled as a separate under Reg/Misc Fee. This allows flexibility in adjusting the down payment amount based on the student&apos;s specific requirements.</p>
                    <div className='grid grid-cols-2 my-5'>
                      <Input name={'downPayment'} type={'text'} isNotEditable={isNotEditable} form={form} label={'Down Payment:'} classNameInput={''} />
                    </div>
                  </div>
                  <RegOrMisc isNotEditable={isNotEditable} regMiscRows={regMiscRows} setRegMiscRows={setRegMiscRows} />
                </div>

                <div className=''>
                  <div className='flex flex-col items-start w-full justify-center mt-10 mb-10 px-7'>
                    <h1 className='text-lg font-semibold xs:text-xl sm:text-2xl tracking-tight w-full text-start uppercase'>Other Fees</h1>
                    <p className='text-sm text-muted-foreground mt-2'>Note: CWTS/NSTP and OJT fees are only applicable if the student is enrolled in the corresponding subject.</p>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-4'>
                      <Input name={'cwtsOrNstpFee'} type={'text'} isNotEditable={isNotEditable} form={form} label={'CWTS/NSTP Fee:'} classNameInput={'uppercase'} />
                      <Input name={'ojtFee'} type={'text'} isNotEditable={isNotEditable} form={form} label={'OJT Fee:'} classNameInput={'uppercase'} />
                    </div>
                  </div>
                </div>
                <CardFooter className=''>
                  {!isNotEditable && (
                    <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                      <Button type='submit' variant={'destructive'} disabled={isPending} onClick={form.handleSubmit(onSubmit)} className='bg-blue-500 hover:bg-blue-700 text-white font-semibold tracking-wide'>
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
