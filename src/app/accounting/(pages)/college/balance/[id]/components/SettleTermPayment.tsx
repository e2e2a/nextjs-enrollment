'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoaderPage from '@/components/shared/LoaderPage';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useCreateStudentReceiptMutation } from '@/lib/queries/studentReceipt/create';
import { Icons } from '@/components/shared/Icons';
import { useEnrollmentSetupQuery } from '@/lib/queries/enrollmentSetup/get';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
('@/components/ui/button');

type IProps = {
  enrollment: any;
  tfData: any;
  srData: any;
  amountToPay: any;
  type: string;
  title: string;
  isScholarshipStart: boolean;
  perTermPayment: any;
  passbookPaymentBoolean?: boolean;
};

const SettleTermPayment = ({ enrollment, tfData, srData, amountToPay, type, title, isScholarshipStart, perTermPayment, passbookPaymentBoolean }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [total, setTotal] = useState(0.0);
  const [insuranceFee, setInsuranceFee] = useState(false);
  const [amountPayment, setAmountPayment] = useState(0.0);
  const [amountInput, setAmountInput] = useState(0);
  const amountInputRef = useRef(0);
  const [isPending, setIsPending] = useState(false);
  const [displayPayment, setDisplayPayment] = useState(true);

  //to be deducted amount of scholarship payment
  const isPaidByScholarship = srData?.studentReceipt
    ?.filter((r: any) => r.isPaidByScholarship)
    ?.reduce((total: number, payment: any) => {
      return total + (Number(payment?.taxes?.amount) || 0);
    }, 0);

  const balanceGrant = parseFloat((Number(enrollment?.profileId?.scholarshipId?.amount) - Number(isPaidByScholarship)).toFixed(2));
  amountInputRef.current = amountInput;

  useEffect(() => {
    if (!enrollment) return;
    if (!tfData) return;

    if (tfData) {
      const insurence = !srData.insurancePayment || srData?.insurancePaymentSemester?.toLowerCase() === enrollment?.studentSemester?.toLowerCase();
      setInsuranceFee(insurence);
      let totalAmountToPay = amountToPay;
      if (!isScholarshipStart && type === 'fullPayment') totalAmountToPay = parseFloat((amountToPay - amountToPay * 0.1).toFixed(2));
      setAmountPayment(totalAmountToPay);
      if (type.toLowerCase() === 'fullpayment')
        totalAmountToPay = totalAmountToPay + Number(tfData?.departmentalFee || 0) + Number(tfData?.ssgFee || 0) + Number(insurence ? tfData?.insuranceFee || 0 : 0) + Number(passbookPaymentBoolean ? tfData?.passbookFee || 0 : 0);
      setAmountInput(totalAmountToPay);
      setTotal(totalAmountToPay);
      if (enrollment?.profileId?.scholarshipId?.amount) {
        if (Number(balanceGrant) > 0) {
          if (Number(balanceGrant) <= Number(totalAmountToPay)) setAmountInput(balanceGrant);
        } else {
          setAmountInput(totalAmountToPay);
        }
      }
    }
  }, [srData, tfData, enrollment, amountToPay, type, isScholarshipStart, balanceGrant, passbookPaymentBoolean]);

  const mutation = useCreateStudentReceiptMutation();
  const onSubmit = async (e: any) => {
    e.preventDefault();
    if (enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) > 0 && Number(balanceGrant) < Number(amountInput)) return makeToastError('Amount exceed on the balance total of scholarship grant amount.');
    if (Number(amountInput) > Number(amountToPay)) return makeToastError('Amount exceed on the total amount to pay.');
    const receipt = {
      studentId: enrollment?.profileId?._id,
      category: 'College',
      amount: {
        currency_code: 'Php',
        value: Number(amountInput).toFixed(2),
      },
      previousBalance: srData?.previousBalance,
      perTermPaymentCurrent: perTermPayment,
      status: 'COMPLETED',
      paymentMethod: 'CASH',
      createTime: new Date(Date.now()),
      updateTime: new Date(Date.now()),
      isPaidByScholarship: enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) > 0 ? true : false,
      taxes: {
        fee: (0).toFixed(2),
        fixed: (0).toFixed(2),
        amount: Number(amountInputRef.current).toFixed(2),
      },
      type: type,
    };

    mutation.mutate(receipt, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsOpen(false);
            makeToastSucess(res.message);
            return;
          default:
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {},
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
      <AlertDialogTrigger asChild>
        <Button variant={'outline'} size={'sm'} className='select-none focus-visible:ring-0 text-[15px] bg-blue-500 hover:bg-blue-600 text-white tracking-normal font-medium font-poppins'>
          <Icons.Banknote className='h-4 w-4 mr-2' />
          {type === 'fullPayment' && 'Pay Full Payment'}
          {type !== 'fullPayment' && type !== 'ssg' && type !== 'insurance' && type !== 'departmental' && type !== 'passbook' && 'Pay This Term'}
          {(type === 'departmental' || type === 'ssg' || type === 'insurance' || type === 'passbook') && 'Make Payment'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white h-[75%] w-full overflow-y-scroll'>
        <AlertDialogHeader>
          <AlertDialogTitle className='font-semibold flex justify-between'>
            <span className=''>STUDENT PAYMENT</span>
            <Icons.close className='h-4 w-4 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
          </AlertDialogTitle>
          <div className='text-start'>
            <span className='text-sm text-left w-full flex '>
              Fullname:
              <span className='font-semibold capitalize'>
                <span className='capitalize'>
                  {enrollment?.profileId?.firstname ?? ''} {enrollment?.profileId?.middlename ?? ''} {enrollment?.profileId?.lastname ?? ''} {enrollment?.profileId?.extensionName ?? ''}
                </span>
              </span>
              ,
            </span>
            {enrollment?.profileId?.scholarshipId?.amount && Number(balanceGrant) > 0 && (
              <div className='mt-5 flex text-sm text-muted-foreground'>
                <span>
                  <span className='text-orange-500'>Note:</span> The student has a scholarship grant of <span className='text-green-500'>₱{enrollment?.profileId?.scholarshipId?.amount}</span>. If a payment is processed for the student, the corresponding amount
                  will be deducted from the total scholarship grant.
                </span>
              </div>
            )}
          </div>
          <AlertDialogDescription className=' hidden'></AlertDialogDescription>
        </AlertDialogHeader>
        <Card className=' items-center justify-center flex border-0'>
          <CardHeader className='space-y-3 hidden'>
            <CardTitle className='hidden'>Waiting for Approval!</CardTitle>
          </CardHeader>
          <CardContent className='flex w-full drop-shadow-none shadow-none justify-center flex-col items-center border-0 rounded-lg bg-neutral-50 focus-visible:ring-0 space-y-5 px-0 mx-0'>
            {displayPayment && (
              <>
                <div className='flex flex-col justify-center items-center w-full '>
                  <div className='border p-11 rounded-lg bg-neutral-50 shadow-md drop-shadow-md'>
                    <h1 className='w-full text-center text-2xl font-bold'>Summary</h1>
                    <h1 className='w-full text-center text-2xl font-bold'>{title}</h1>
                    <div className='grid grid-cols-1'>
                      <div className='flex flex-row w-full sm:gap-28 xs:gap-10'>
                        <div className='text-sm sm:mt-10 mt-5 w-full flex justify-between'>
                          <span className='font-bold text-nowrap'>Payment Amount:</span>
                        </div>
                        <div className='text-sm sm:mt-10 mt-5 w-ful flex flex-col '>
                          <span className='font-bold text-end w-full text-nowrap '>
                            <span className={`font-bold text-end w-full text-black ${type === 'fullPayment' && !isScholarshipStart && 'line-through'}`}>₱{amountToPay}</span>
                            {type === 'fullPayment' && !isScholarshipStart && <span className='text-green-500'> ₱{amountPayment}(10%)</span>}
                          </span>
                        </div>
                      </div>
                      {type.toLowerCase() === 'fullpayment' && (
                        <>
                          <div className='flex flex-row w-full sm:gap-28 xs:gap-10'>
                            <div className='text-sm mt-5 w-full flex items-start'>
                              <span className='font-bold text-nowrap'>Departmental Fee:</span>
                            </div>
                            <div className='text-sm mt-5 w-ful flex items-end'>
                              <span className='font-bold text-end w-full'>₱{tfData?.departmentalFee}</span>
                            </div>
                          </div>
                          {insuranceFee && (
                            <div className='flex flex-row w-full sm:gap-28 xs:gap-10'>
                              <div className='text-sm mt-5 w-full flex items-start'>
                                <span className='font-bold text-nowrap'>Insurance Fee:</span>
                              </div>

                              <div className='text-sm mt-5 w-ful flex items-end'>
                                <span className='font-bold text-end w-full'>₱{tfData?.insuranceFee}</span>
                              </div>
                            </div>
                          )}
                          <div className='flex flex-row w-full sm:gap-28 xs:gap-10'>
                            <div className='text-sm mt-5 w-full flex items-start'>
                              <span className='font-bold text-nowrap'>SSG Fee:</span>
                            </div>
                            <div className='text-sm mt-5 w-ful flex items-end'>
                              <span className='font-bold text-end w-full'>₱{tfData?.ssgFee}</span>
                            </div>
                          </div>
                          {passbookPaymentBoolean && (
                            <div className='flex flex-row w-full sm:gap-28 xs:gap-10'>
                              <div className='text-sm mt-5 w-full flex items-start'>
                                <span className='font-bold text-nowrap'>Passbook Fee:</span>
                              </div>

                              <div className='text-sm mt-5 w-ful flex items-end'>
                                <span className='font-bold text-end w-full'>₱{tfData?.passbookFee}</span>
                              </div>
                            </div>
                          )}
                          <div className='flex flex-row w-full sm:gap-28 xs:gap-10'>
                            <div className='text-sm mt-5 w-full flex items-start'>
                              <span className='font-bold text-nowrap'>Total Payment Amount:</span>
                            </div>
                            <div className='text-sm mt-5 w-ful flex items-end'>
                              <span className='font-bold text-end w-full'>₱{total}</span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  <div className='mt-10 w-full'>
                    {/* <form method='post' onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-4'> */}
                    <form method='post' className='w-full space-y-4'>
                      <CardContent className='w-full'>
                        <div className='grid grid-cols-1 gap-4'>
                          <div className={`relative`}>
                            <input
                              type={'text'}
                              id={'amount'}
                              className={`uppercase block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-slate-50 border border-gray-200 appearance-nonefocus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom`}
                              onDragStart={(e) => e.preventDefault()}
                              value={Number(amountInput).toFixed(2)}
                              onChange={(e) => setAmountInput(parseFloat(e.target.value) || 0)}
                              placeholder='0.00'
                            />
                            <label
                              htmlFor={'amount'}
                              className='text-black absolute cursor-text text-md select-none text-muted-foreground duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5'
                            >
                              Amount
                            </label>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter className=''>
                        <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                          <Button type='submit' onClick={(e) => onSubmit(e)} variant={'destructive'} disabled={isPending} className='bg-blue-500 hover:bg-blue-700 text-white font-semibold tracking-wide'>
                            {isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Submit'}
                          </Button>
                        </div>
                      </CardFooter>
                    </form>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
        <AlertDialogFooter className='hidden'>
          <AlertDialogCancel className='hover:bg-slate-100 focus-visible:ring-0 '>Cancel</AlertDialogCancel>
          <AlertDialogAction type='submit' className='border rounded-lg hover:bg-slate-100 focus-visible:ring-0 '>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SettleTermPayment;
