'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import LoaderPage from '@/components/shared/LoaderPage';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'; // PayPal React SDK
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useCreateStudentReceiptMutation } from '@/lib/queries/studentReceipt/create';
import { Icons } from '@/components/shared/Icons';
import { useEnrollmentSetupQuery } from '@/lib/queries/enrollmentSetup/get';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import InputAmount from './InputAmount';

type IProps = {
  enrollment: any;
  tfData: any;
  srData: any;
  //   amountToPay: any;
  type: string;
  title: string;
  isScholarshipStart: Boolean;
};

const DownPayment = ({ enrollment, tfData, srData, type, title, isScholarshipStart }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [amountInput, setAmountInput] = useState(1000.0);
  const totalPaymentRef = useRef(0);
  const totalTransactionFee = useRef(0);
  const paymentMethod = useRef('');

  useEffect(() => {
    if (!enrollment) return;
    if (!tfData) return;

    if (tfData) {
      let totalAmountToPay = amountInput;
      const fee = Number(totalAmountToPay) * 0.039;
      totalTransactionFee.current = parseFloat(fee.toFixed(2));
      const totalPayment = Number(totalAmountToPay) + Number(fee) + 15;
      totalPaymentRef.current = parseFloat(totalPayment.toFixed(2));
    }
  }, [srData, tfData, enrollment, amountInput, type, isScholarshipStart]);

  const formattedAmount = (amount: number) => {
    return amount ? amount.toFixed(2) : '0.00';
  };

  const createOrder = (data: any, actions: any) => {
    if (Number(amountInput) < Number(tfData.downPayment)) return makeToastError(`Down payment should atleast greater than ${tfData.downPayment}.`);
    setIsPending(true);
    paymentMethod.current = data.paymentSource;
    const payment = totalPaymentRef.current;

    return actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: 'e2e2a order-1234',
          amount: {
            currency_code: 'USD',
            value: formattedAmount(payment),
          },
        },
      ],
      application_context: {},
    });
  };

  const mutation = useCreateStudentReceiptMutation();
  const onApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      if (details.status === 'COMPLETED' || details.status === 'ON_HOLD' || details.status === 'PENDING') {
        const receipt = {
          captureId: details.purchase_units[0].payments.captures[0].id,
          studentId: enrollment?.profileId?._id,
          category: 'College',
          orderID: details.id,
          transactionId: details.id,
          amount: {
            currency_code: details.purchase_units[0].amount.currency_code,
            value: parseFloat(details.purchase_units[0].amount.value),
          },
          status: details.status, // Transaction status (COMPLETED)
          paymentMethod: paymentMethod.current,
          createTime: new Date(details.create_time),
          updateTime: new Date(details.update_time),
          payer: {
            id: details.payer.payer_id,
            name: details.payer.name,
            email: details.payer.email_address,
            // address: details.purchase_units[0].address
          },
          taxes: {
            fee: totalTransactionFee.current,
            fixed: 15,
            amount: amountInput,
          },
          paymentIntent: details.intent, // Payment intent (CAPTURE)
          // payments: details.payment
          type: type,
          captureTime: new Date(details.update_time),
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
      }
    } catch (error) {
      console.log('error: ', error);
      setIsPending(false);
      alert('Payment could not be completed. Please try again.');
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={(e) => setIsOpen(e)}>
      <AlertDialogTrigger asChild>
        <Button variant={'outline'} size={'sm'} className='select-none focus-visible:ring-0 text-[15px] bg-blue-500 hover:bg-blue-600 text-white tracking-normal font-medium font-poppins'>
          <Icons.Banknote className='h-4 w-4 mr-2' />
          Pay Down Payment
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className='bg-white h-[75%] w-full overflow-y-scroll'>
        <AlertDialogHeader>
          <AlertDialogTitle className='font-semibold flex justify-between'>
            <span className=''>STUDENT PAYMENT</span>
            <Icons.close className='h-4 w-4 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
          </AlertDialogTitle>
          <div className='text-start'>
            <span className='text-sm text-left sm:mt-10 mt-5 w-full '>
              Dear{' '}
              <span className='font-semibold capitalize'>
                <span className='capitalize'>{enrollment?.profileId?.firstname ?? ''}</span> <span className='capitalize'>{enrollment?.profileId?.lastname ?? ''}</span>
              </span>
              ,
            </span>
          </div>
          <div className=''>
            <span className='text-sm mt-4 px-5 sm:px-10 w-full text-justify leading-relaxed'>
              To proceed with your payment, you can use PayPal, a credit card, or a debit card. If you don&apos;t have access to these options, we kindly ask you to visit the school cashier&apos;s office at DCIT. Our friendly staff will assist you with the
              payment process and ensure you receive any necessary documentation. For additional guidance or questions, please refer to our documentation, which can be accessed via{' '}
              <a href='/documentation' className='text-blue-600 underline hover:text-blue-800'>
                this link
              </a>
              .
            </span>
            <div className='px-5 w-full sm:px-1 flex justify-center flex-col mt-5'>
              <span className='text-[16px] font-bold text-orange-400'>Note</span>
              <span className='text-sm text-justify'>Please be aware that the transaction fee applied to this payment is determined by PayPal. This fee is only applicable to online payments processed through PayPal.</span>
            </div>
          </div>
          <AlertDialogDescription></AlertDialogDescription>
        </AlertDialogHeader>
        <Card className=' items-center justify-center flex border-0'>
          <CardHeader className='space-y-3 hidden'>
            <CardTitle className='hidden'>Waiting for Approval!</CardTitle>
          </CardHeader>
          <CardContent className='flex w-full drop-shadow-none shadow-none justify-center flex-col items-center border-0 rounded-lg bg-neutral-50 focus-visible:ring-0 space-y-5 px-0 mx-0'>
            <InputAmount amountInput={amountInput} setAmountInput={setAmountInput} />
            {amountInput >= 1000 ? (
              <div className='flex flex-col justify-center items-center w-full '>
                <div className='border p-11 rounded-lg bg-neutral-50 shadow-md drop-shadow-md'>
                  <h1 className='w-full text-center text-2xl font-bold'>{title}</h1>
                  <div className='grid grid-cols-1'>
                    <div className='flex flex-row w-full sm:gap-28 xs:gap-10'>
                      <div className='text-sm sm:mt-10 mt-5 w-full flex items-start'>
                        <span className='font-bold text-nowrap'>Payment Amount:</span>
                      </div>
                      <div className='text-sm sm:mt-10 mt-5 w-ful flex flex-col items-end'>
                        <span className='font-bold text-end w-full text-nowrap '>
                          <span className={`font-bold text-end w-full text-black `}>₱{amountInput}</span>
                        </span>
                      </div>
                    </div>
                    <div className='flex flex-row w-full sm:gap-28 xs:gap-10'>
                      <div className='text-sm mt-5 w-full flex items-start'>
                        <span className='font-bold text-nowrap'>Fixed Fee:</span>
                      </div>
                      <div className='text-sm mt-5 w-ful flex items-end'>
                        <span className='font-bold text-end w-full'>₱15.00</span>
                      </div>
                    </div>
                    <div className='flex flex-row w-full sm:gap-28 xs:gap-10'>
                      <div className='text-sm mt-5 w-full flex items-start'>
                        <span className='font-bold text-nowrap'>
                          Transaction Rate <span className='text-xs'>(3.9%)</span>:
                        </span>
                      </div>
                      <div className='text-sm mt-5 w-ful flex items-end'>
                        <span className='font-bold text-end w-full'>₱{totalTransactionFee.current.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className='flex flex-row w-full sm:gap-28 xs:gap-10'>
                      <div className='text-sm mt-5 w-full flex items-start'>
                        <span className='font-bold text-nowrap'>Total Payment Amount:</span>
                      </div>
                      <div className='text-sm mt-5 w-ful flex items-end'>
                        <span className='font-bold text-end w-full'>₱{totalPaymentRef.current.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className='mt-10 w-full'>
                      <PayPalScriptProvider
                        options={{
                          clientId: `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string}`,
                          currency: 'USD',
                          // vault: true,
                          intent: 'capture',
                        }}
                      >
                        <PayPalButtons
                          style={{ layout: 'vertical' }}
                          createOrder={createOrder}
                          onApprove={onApprove}
                          disabled={isPending}
                          onError={(err) => {
                            // makeToastError('PayPal error');
                          }}
                          onCancel={() => {
                            setIsPending(false);
                            makeToastError('Your transaction was cancelled.');
                          }}
                        />
                      </PayPalScriptProvider>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className=''>
                <span className=''>Down payment only accept when the amount is greater than 1000 or please go to the accounting office in DCIT.</span>
              </div>
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

export default DownPayment;
