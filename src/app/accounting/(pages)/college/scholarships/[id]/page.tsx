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
import { TuitionFeeValidator } from '@/lib/validators/tuitionFee/create';
import { useTuitionFeeQueryById } from '@/lib/queries/courseFee/get/id';
import { Icons } from '@/components/shared/Icons';
import { useUpdateTuitionFeeMutation } from '@/lib/queries/courseFee/update';

const Page = ({ params }: { params: { id: string } }) => {
  const [isPending, setIsPending] = useState(false);
  const [isNotEditable, setIsNotEditable] = useState(true);
  const [total, setTotal] = useState(0);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [regMiscRows, setRegMiscRows] = useState<any[]>([{ type: '', name: '', amount: '' }]);

  const { data: tfData, isLoading: load, error: isTFError } = useTuitionFeeQueryById(params.id);
  const { data: cData, isLoading, error } = useCourseQueryByCategory('College');

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
  const form = useForm<z.infer<typeof TuitionFeeValidator>>({
    resolver: zodResolver(TuitionFeeValidator),
    defaultValues: {
      courseCode: '',
      ratePerUnit: '',
      ratePerLab: '',
      cwtsOrNstpFee: '',
      downPayment: ``,
    },
  });

  useEffect(() => {
    // Initialize a to calculate non-iterable fees
    const a = Number(tfData?.tFee?.ratePerUnit || 0) + Number(tfData?.tFee?.ratePerLab || 0) + Number(tfData?.tFee?.cwtsOrNstpFee || 0) + Number(tfData?.tFee?.downPayment || 0);

    let b = 0;
    if (Array.isArray(tfData?.tFee?.regOrMisc) && tfData?.tFee?.regOrMisc.length > 0) {
      for (const reg of tfData.tFee.regOrMisc) {
        b += Number(reg.amount || 0);
      }
    }
    const c = (a + b).toFixed(2);
    setTotal(Number(c));

    form.setValue('courseCode', tfData?.tFee?.courseId?.courseCode);
    form.setValue('ratePerUnit', tfData?.tFee?.ratePerUnit);
    form.setValue('ratePerLab', tfData?.tFee?.ratePerLab);
    form.setValue('cwtsOrNstpFee', tfData?.tFee?.cwtsOrNstpFee);
    form.setValue('downPayment', tfData?.tFee?.downPayment);
  }, [form, tfData, isNotEditable]);

  useEffect(() => {
    setRegMiscRows(tfData?.tFee?.regOrMisc || []);
  }, [isNotEditable, tfData]);

  const handleEditable = async () => {
    setIsNotEditable(!isNotEditable);
    form.reset();
  };

  const onSubmit: SubmitHandler<z.infer<typeof TuitionFeeValidator>> = async (data) => {
    setIsPending(true);
    if (regMiscRows.length === 0) return makeToastError('Please Provide Reg/Misc Fee');
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
              <CardTitle className='text-lg xs:text-2xl sm:text-3xl tracking-tight w-full text-center uppercase'>Add a New Room</CardTitle>
              <CardDescription className='text-xs sm:text-sm hidden'></CardDescription>
              <div className='text-xs sm:text-sm'>
                <div className=''>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To create a new Course Tuition Fee, this section allows you to define the tuition rates, lab fees, CWTS/NSTP fees, and any other related charges for a specific course. Providing this information will ensure
                  accurate billing and management of course fees for students.
                </div>
              </div>
            </CardHeader>
            <Form {...form}>
              <form method='post' onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-4'>
                <CardContent className='w-full'>
                  <div className='flex justify-end mb-5'>
                    <div className='bg-slate-200 hover:bg-slate-300 relative right-2 rounded-xl py-1.5 px-2 cursor-pointer flex items-center gap-1' title='Edit' onClick={handleEditable}>
                      <Icons.squarePen className='h-5 w-5 fill-white stroke-blue-600 relative' />
                      <span className='hidden sm:flex tracking-normal text-sm'>Edit</span>
                    </div>
                  </div>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                    <SelectInput isNotEditable={isNotEditable} name={'courseCode'} selectItems={cData.courses} form={form} label={'Course:'} placeholder={'Select Course'} tFee={tfData.tFee} />
                    <Input name={'ratePerUnit'} type={'text'} isNotEditable={isNotEditable} form={form} label={'Rate Per Unit:'} classNameInput={'uppercase'} />
                    <Input name={'ratePerLab'} type={'text'} isNotEditable={isNotEditable} form={form} label={'Rate PerLab:'} classNameInput={'uppercase'} />
                    <Input name={'cwtsOrNstpFee'} type={'text'} isNotEditable={isNotEditable} form={form} label={'CWTS/NSTP Fee:'} classNameInput={'uppercase'} />
                    <Input name={'downPayment'} type={'text'} isNotEditable={isNotEditable} form={form} label={'Down Payment:'} classNameInput={''} />
                  </div>
                </CardContent>

                <RegOrMisc isNotEditable={isNotEditable} regMiscRows={regMiscRows} setRegMiscRows={setRegMiscRows} />
                <CardFooter className=''>
                  {isNotEditable ? (
                    <div className=''>
                      <span className='font-bold'>Total Payment:</span>
                      <span>₱ {total.toFixed(2)}</span>
                    </div>
                  ) : (
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
