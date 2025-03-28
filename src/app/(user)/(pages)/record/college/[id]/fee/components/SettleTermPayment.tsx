'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from 'next-auth/react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'; // PayPal React SDK
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useCreateStudentReceiptMutation } from '@/lib/queries/studentReceipt/create';
import { Icons } from '@/components/shared/Icons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

type IProps = {
  enrollment: any;
  tfData: any;
  srData: any;
  amountToPay: any;
  type: string;
  title: string;
  isScholarshipStart: Boolean;
  perTermPayment: any;
  passbookPaymentBoolean?: boolean;
};

const SettleTermPayment = ({ enrollment, tfData, srData, amountToPay, type, title, isScholarshipStart, perTermPayment, passbookPaymentBoolean }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [amountPayment, setAmountPayment] = useState(0.0);
  const [insuranceFee, setInsuranceFee] = useState(false);
  const [extraPayment, setExtraPayment] = useState(0.0);
  const totalPaymentRef = useRef(0);
  const totalTransactionFee = useRef(0);
  const paymentMethod = useRef('');
  const [displayPayment, setDisplayPayment] = useState(true);

  useEffect(() => {
    if (!enrollment) return;
    if (!tfData) return;

    if (tfData) {
      const insurence = !srData.insurancePayment || srData?.insurancePaymentSemester?.toLowerCase() === enrollment?.studentSemester?.toLowerCase();
      setInsuranceFee(insurence);
      let totalAmountToPay = amountToPay;
      if (type === 'fullPayment' && !isScholarshipStart) totalAmountToPay = parseFloat((amountToPay - amountToPay * 0.1).toFixed(2));
      setAmountPayment(totalAmountToPay);
      const a = Number(tfData?.departmentalFee || 0) + Number(tfData?.ssgFee || 0) + Number(insurence ? tfData?.insuranceFee || 0 : 0) + Number(passbookPaymentBoolean ? tfData?.passbookFee || 0 : 0);
      setExtraPayment(a);
      if (type.toLowerCase() === 'fullpayment') totalAmountToPay = totalAmountToPay + a;

      const fee = Number(totalAmountToPay) * 0.039;
      totalTransactionFee.current = parseFloat(fee.toFixed(2));
      const totalPayment = Number(totalAmountToPay) + Number(fee) + 15;
      totalPaymentRef.current = parseFloat(totalPayment.toFixed(2));
    }
  }, [srData, tfData, enrollment, amountToPay, type, isScholarshipStart, passbookPaymentBoolean]);

  const formattedAmount = (amount: number) => {
    return amount ? amount.toFixed(2) : '0.00';
  };

  const createOrder = (data: any, actions: any) => {
    paymentMethod.current = data.paymentSource;
    const payment = totalPaymentRef.current;

    return actions.order.create({
      intent: 'CAPTURE',
      purchase_units: [
        {
          description: 'e2e2a order-1234',
          amount: {
            currency_code: 'PHP',
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
          enrollmentId: enrollment?._id,
          category: 'College',
          orderID: details.id,
          transactionId: details.id,
          previousBalance: srData?.previousBalance,
          perTermPaymentCurrent: perTermPayment,
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
            amount: type === 'fullPayment' && !isScholarshipStart ? parseFloat((Number(amountToPay - amountToPay * 0.1) + Number(extraPayment)).toFixed(2)) : Number(amountToPay).toFixed(2),
          },
          paymentIntent: details.intent, // Payment intent (CAPTURE)
          // payments: details.payment
          type: type,
          captureTime: new Date(details.update_time),
          request: 'record',
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
      alert('Payment could not be completed. Please try again.');
    }
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
            {displayPayment && (
              <>
                <div className='flex flex-col justify-center items-center w-full '>
                  <div className='border p-11 rounded-lg bg-neutral-50 shadow-md drop-shadow-md'>
                    <h1 className='w-full text-center text-2xl font-bold'>{title}</h1>
                    <div className='grid grid-cols-1'>
                      <div className='flex flex-row w-full sm:gap-28 xs:gap-10'>
                        <div className='text-sm sm:mt-10 mt-5 w-full flex items-start'>
                          <span className='font-bold text-nowrap'>Payment Amount:</span>
                        </div>
                        <div className='text-sm sm:mt-10 mt-5 w-ful flex flex-col items-end'>
                          {/* <span className={`font-bold text-end w-full ${type === 'fullPayment' && 'line-through'}`}>₱{amountToPay}</span> */}
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
                        </>
                      )}
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
                          <span className='font-bold text-end w-full'>₱{totalPaymentRef.current}</span>
                        </div>
                      </div>
                      {/* PayPal Button with Official SDK */}
                      <div className='mt-10 w-full'>
                        <PayPalScriptProvider
                          options={{
                            clientId: `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string}`,
                            currency: 'PHP',
                            // vault: true,
                            intent: 'capture',
                          }}
                        >
                          <PayPalButtons
                            style={{ layout: 'vertical' }}
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={(err) => {
                              // makeToastError('PayPal error');
                            }}
                            onCancel={() => {
                              makeToastError('Your transaction was cancelled.');
                            }}
                          />
                        </PayPalScriptProvider>
                      </div>
                    </div>
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
