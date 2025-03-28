'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { Icons } from '@/components/shared/Icons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRefundStudentReceiptMutation } from '@/lib/queries/studentReceipt/refund';

type IProps = {
  enrollment: any;
  tfData: any;
  srData: any;
  amountToPay: any;
  type: string;
  title: string;
  isScholarshipStart: boolean;
};

const RefundPayment = ({ enrollment, tfData, srData, amountToPay, type, title, isScholarshipStart }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amountInput, setAmountInput] = useState(500.0);
  const amountInputRef = useRef(0);
  const [isPending, setIsPending] = useState(false);
  const [displayPayment, setDisplayPayment] = useState(true);

  //to be deducted amount of scholarship payment
  const isPaidByScholarship = srData
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
    }
  }, [srData, tfData, enrollment]);

  const mutation = useRefundStudentReceiptMutation();
  const onSubmit = async (e: any) => {
    e.preventDefault();

    setIsPending(true);
    const receipt = {
      studentId: enrollment?.profileId?._id,
      category: 'College',
      srData: srData,
      tFee: tfData,
      refundAmount: amountToPay,
    };

    mutation.mutate(receipt, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsOpen(false);
            setIsPending(false);
            makeToastSucess(res.message);
            return;
          default:
            makeToastError(res.error);
            setIsPending(false);
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
          Make Refund Payment
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
                  <span className='text-orange-500'>Note:</span> Refund is issued in cash to avoid transaction fees and tax deductions from PayPal. The refund has been recorded accordingly in the financial records.
                </span>
              </div>
            )}
          </div>
          <AlertDialogDescription className=' hidden'></AlertDialogDescription>
        </AlertDialogHeader>
        <Card className=' items-center justify-center flex border-0'>
          <CardHeader className='space-y-3 hidden'>
            <CardTitle className='hidden'>a!</CardTitle>
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
                            <span className={`font-bold text-end w-full text-black`}>₱{Number(amountToPay).toFixed(2)}</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-10 w-full'>
                    <form method='post' className='w-full space-y-4'>
                      <CardContent className='w-full'></CardContent>
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

export default RefundPayment;
