'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LoaderPage from '@/components/shared/LoaderPage';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'; // PayPal React SDK
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useCreateStudentReceiptMutation } from '@/lib/queries/studentReceipt/create';
import { useStudentReceiptQueryByUserId } from '@/lib/queries/studentReceipt/get/userId';
import { useCourseFeeQueryByCourseIdAndYear } from '@/lib/queries/courseFee/get/courseId';
import { Icons } from '@/components/shared/Icons';
import { useEnrollmentSetupQuery } from '@/lib/queries/enrollmentSetup/get';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Image from 'next/image';
import { useEnrollmentQueryBySessionId } from '@/lib/queries/enrollment/get/session';

type IProps = {
  enrollment: any;
};

const Step5 = ({ enrollment }: IProps) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [type, setType] = useState('downPayment');
  const [amountToPay, setAmountToPay] = useState(0);
  const [amountDiscountedToPay, setAmountDiscountedToPay] = useState(0);
  const payment = useRef(0);
  const totalPaymentRef = useRef(0);
  const totalTransactionFee = useRef(0);
  const paymentMethod = useRef('');
  const [displayPayment, setDisplayPayment] = useState(true);

  const { data: s } = useSession();
  const { data: esData, isError: esError } = useEnrollmentSetupQuery();
  const { data: srData, error: srError } = useStudentReceiptQueryByUserId(s?.user.id as string, esData?.enrollmentSetup?.enrollmentTertiary?.schoolYear);
  const { data: eData, error: eError } = useEnrollmentQueryBySessionId(s?.user?.id as string); // change this to enrollment not a profile query
  const { data: tfData, error: tfError } = useCourseFeeQueryByCourseIdAndYear(eData?.enrollment?.studentYear || 'e2e2a', (eData?.enrollment?.courseId?._id as string) || 'e2e2a');

  useEffect(() => {
    if (!enrollment) return;
    if (!esData || esError) return;
    if (!tfData || tfError) return;
    if (srError || !srData) return;
    if (eError || !eData) return;
    setAmountToPay(0);
    if (eData && srData && tfData) {
      setAmountToPay(tfData?.tFee?.downPayment);
      if (type.toLowerCase() === 'downpayment') {
        payment.current = tfData?.tFee?.downPayment;
        const fee = Number(tfData?.tFee?.downPayment) * 0.039;
        totalTransactionFee.current = parseFloat(fee.toFixed(2));
        const totalPayment = Number(tfData?.tFee?.downPayment) + Number(fee) + 15;
        totalPaymentRef.current = parseFloat(totalPayment.toFixed(2));
      }
      if (type.toLowerCase() === 'fullpayment') {
        const lab = enrollment.studentSubjects.reduce((acc: number, subjects: any) => acc + Number(subjects?.teacherScheduleId?.subjectId?.lab), 0);
        const lec = enrollment.studentSubjects.reduce((acc: number, subjects: any) => acc + Number(subjects?.teacherScheduleId?.subjectId?.lec), 0);
        let addcwtsOrNstpFee = false;
        const cwtsOrNstpFee = Number(tfData?.tFee?.cwtsOrNstpFee) || 0;
        const aFormatted = parseFloat((lab * tfData?.tFee?.ratePerLab).toFixed(2));
        const bFormatted = parseFloat((lec * tfData?.tFee?.ratePerUnit).toFixed(2));
        const cFormatted = parseFloat(tfData?.tFee?.regOrMisc.reduce((acc: number, tFee: any) => acc + Number(tFee.amount), 0).toFixed(2));
        const dFormatted = Number(tfData?.tFee?.downPayment || 0);
        const a = bFormatted + dFormatted;
        const d = enrollment.studentSubjects.find((sub: any) => {
          if (
            sub?.teacherScheduleId?.subjectId.subjectCode.trim().toLowerCase() === 'cwts' ||
            sub?.teacherScheduleId?.subjectId.subjectCode.trim().toLowerCase() === 'nstp' ||
            sub?.teacherScheduleId?.subjectId.subjectCode.trim().toLowerCase() === 'nstp1' ||
            sub?.teacherScheduleId?.subjectId.subjectCode.trim().toLowerCase() === 'nstp2' ||
            sub?.teacherScheduleId?.subjectId.subjectCode.trim().toLowerCase() === 'cwts1' ||
            sub?.teacherScheduleId?.subjectId.subjectCode.trim().toLowerCase() === 'cwts2'
          ) {
            addcwtsOrNstpFee = true;
            return true;
          }
          return false;
        });
        const totalAmount = addcwtsOrNstpFee ? aFormatted + a + cFormatted + cwtsOrNstpFee : aFormatted + a + cFormatted;
        setAmountToPay(parseFloat(totalAmount.toFixed(2)));
        const formattedTotal = parseFloat((totalAmount - totalAmount * 0.1).toFixed(2)); // Final formatting
        payment.current = formattedTotal;
        setAmountDiscountedToPay(formattedTotal);
        const fee = Number(formattedTotal) * 0.039;
        totalTransactionFee.current = parseFloat(fee.toFixed(2));
        const totalPayment = Number(formattedTotal) + Number(fee) + 15;
        totalPaymentRef.current = parseFloat(totalPayment.toFixed(2));
      }
      if (srData?.studentReceipt && srData?.studentReceipt.length > 0) {
        const a = srData.studentReceipt.filter((sr: any) => sr.type.toLowerCase() === 'downpayment');
        const b = srData.studentReceipt.filter((sr: any) => sr.type.toLowerCase() === 'fullpayment');
        if ((b && b.length > 0) || (a && a.length > 0)) setDisplayPayment(false);
      } else {
        setDisplayPayment(true);
      }
      setIsPageLoading(false);
      return;
    }
  }, [eData, eError, srData, srError, tfData, tfError, esData, esError, enrollment, type]);

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
          // reference_id: 'e2e2a_1234',
          description: 'e2e2a order-1234',
          amount: {
            currency_code: 'USD',
            value: formattedAmount(payment),
          },
        },
      ],
      // payment_source: {
      //   paypal: {},
      // },
      application_context: {
        // locale: 'en-US',
        // brand_name: 'asd',
        // landing_page: 'billing',
        // user_action: 'continue',
        // supplementary_data: [
        //   { name: 'risk_correlation_id', value: '9N8554567F903282T' },
        //   { name: 'buyer_ipaddress', value: '109.20.212.116' },
        //   { name: 'external_channel', value: 'WEB' },
        // ],
      },
    });
  };

  const mutation = useCreateStudentReceiptMutation();
  const onApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      if (details.status === 'COMPLETED' || details.status === 'ON_HOLD' || details.status === 'PENDING') {
        const receipt = {
          captureId: details.purchase_units[0].payments.captures[0].id,
          studentId: eData?.enrollment?.profileId?._id,
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
            amount: payment.current,
          },
          paymentIntent: details.intent, // Payment intent (CAPTURE)
          // payments: details.payment
          type: 'DownPayment',
          captureTime: new Date(details.update_time),
        };

        mutation.mutate(receipt, {
          onSuccess: (res: any) => {
            switch (res.status) {
              case 200:
              case 201:
              case 203:
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
      alert('Payment could not be completed. Please try again.');
    }
  };

  return (
    <TabsContent value='5' className='p-5 focus-visible:ring-0 border-0'>
      <Card className='min-h-[35vh] shadow-none drop-shadow-none items-center justify-center flex border-0'>
        <CardHeader className='space-y-3 hidden'>
          <CardTitle className='hidden'>Waiting for Approval!</CardTitle>
        </CardHeader>
        <CardContent className='flex w-full justify-center flex-col items-center border-[0.5px] rounded-lg shadow-sm bg-white focus-visible:ring-0 space-y-5 px-0 mx-0'>
          <div className='w-full flex flex-col items-center justify-center h-full'>
            {isPageLoading ? (
              <LoaderPage />
            ) : (
              <>
                {!tfData?.tFee && (
                  <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
                    <Card className={`min-h-[35vh] my-[10%] shadow-none drop-shadow-none items-center justify-center flex border-0`}>
                      <CardHeader className='space-y-3 hidden'>
                        <CardTitle className=''>
                          <div className='flex flex-col justify-center gap-y-1 items-center'>
                            <div className=''>
                              <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={65} height={65} alt='nothing to say' />
                            </div>
                            <div className='text-center lg:text-left font-poppins'>No Payment Recorded Yet.</div>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className='flex w-full justify-center py-5 flex-col rounded-lg shadow-sm bg-white items-center border focus-visible:ring-0 space-y-5 px-0 mt-7'>
                        <div className='flex flex-col justify-center gap-y-1 items-center'>
                          <div className=''>
                            <Image src={'/images/logo1.png'} className='w-auto rounded-full' priority width={100} height={100} alt='nothing to say' />
                          </div>
                          <div className='text-center text-xl sm:text-2xl font-semibold tracking-tight'>No Payment Recorded Yet.</div>
                        </div>
                        <span className='text-left sm:text-center w-full px-5 text-[16px]'>
                          The payment for this course has not been processed yet. The cashier is currently handling your transaction, and it will be updated soon. Please be patient, as this process does not take long.
                        </span>
                      </CardContent>
                    </Card>
                  </div>
                )}
                {tfData.tFee && (
                  <>
                    <div className=' mt-3'>
                      <h1 className='text-center text-xl sm:text-3xl font-semibold text-black'>STUDENT PAYMENT</h1>
                    </div>
                    <div className='w-full flex justify-center items-center md:mt-4 md:mb-0'>
                      <Icons.hourglass className='md:h-14 fill-gray-100 md:w-14 h-10 w-10 my-3 stroke-green-400 animate-spin' style={{ animationDuration: '6s' }} />
                    </div>
                    <span className='text-sm text-left sm:mt-10 mt-5 w-full px-5 sm:px-10'>
                      Dear{' '}
                      <span className='font-semibold capitalize'>
                        <span className='capitalize'>{enrollment?.profileId?.firstname ?? ''}</span> <span className='capitalize'>{enrollment?.profileId?.lastname ?? ''}</span>
                      </span>
                      ,
                    </span>
                    {displayPayment ? (
                      <>
                        <span className='text-sm mt-4 px-5 sm:px-10 w-full text-justify leading-relaxed'>
                          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To proceed with your payment, you can use PayPal, a credit card, or a debit card. If you don&apos;t have access to these options, we kindly ask you to visit the school cashier&apos;s office at DCIT.
                          Our friendly staff will assist you with the payment process and ensure you receive any necessary documentation. For additional guidance or questions, please refer to our documentation, which can be accessed via{' '}
                          <a href='/documentation' className='text-blue-600 underline hover:text-blue-800'>
                            this link
                          </a>
                          .
                        </span>
                        <div className='px-5 w-full sm:px-1 sm:w-1/2 flex justify-center flex-col mt-10'>
                          <h1 className=''>
                            <span className='text-[16px] font-bold text-orange-400'>Note</span>
                          </h1>
                          <span className='text-sm text-justify'>Please be aware that the transaction fee applied to this payment is determined by PayPal. This fee is only applicable to online payments processed through PayPal.</span>
                        </div>
                        <div className='flex flex-col justify-center items-center w-full '>
                          <div className='border p-11 rounded-lg bg-neutral-50 shadow-md drop-shadow-md'>
                            <h1 className='w-full text-center text-2xl font-bold'>Payment</h1>
                            <div className='grid grid-cols-1'>
                              <div className='text-sm sm:mt-10 mt-5 w-full flex items-start'>
                                <div className='w-full flex justify-center items-center'>
                                  <div className='relative bg-slate-50 rounded-lg w-full'>
                                    <Select onValueChange={(e) => setType(e)} value={type}>
                                      <SelectTrigger id={'type'} className='w-full pt-10 pb-4  capitalize text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 '>
                                        <SelectValue placeholder={'Select Type of Payment'} />
                                      </SelectTrigger>
                                      <SelectContent className='bg-white border-gray-300'>
                                        <SelectGroup>
                                          <SelectItem value={'downPayment'} className='capitalize'>
                                            Down Payment
                                          </SelectItem>
                                          <SelectItem value={'fullPayment'} className='capitalize'>
                                            Full Payment
                                          </SelectItem>
                                        </SelectGroup>
                                      </SelectContent>
                                    </Select>
                                    <label
                                      htmlFor='type'
                                      className={`pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
                                    >
                                      Type of Payment
                                    </label>
                                  </div>
                                </div>
                              </div>
                              <div className='flex flex-row w-full gap-28'>
                                <div className='text-sm sm:mt-10 mt-5 w-full flex items-start'>
                                  <span className='font-bold text-nowrap'>Payment Amount:</span>
                                </div>
                                <div className='text-sm sm:mt-10 mt-5 w-ful flex items-end gap-2'>
                                  <span className={`font-bold text-end w-full text-black ${type === 'fullPayment' && 'line-through'}`}>₱{amountToPay} </span>
                                  {type === 'fullPayment' && <span className='text-green-500'> ₱{amountDiscountedToPay}(10%)</span>}
                                </div>
                              </div>
                              <div className='flex flex-row w-full gap-28'>
                                <div className='text-sm mt-5 w-full flex items-start'>
                                  <span className='font-bold text-nowrap'>Fixed Fee:</span>
                                </div>
                                <div className='text-sm mt-5 w-ful flex items-end'>
                                  <span className='font-bold text-end w-full'>₱15.00</span>
                                </div>
                              </div>
                              <div className='flex flex-row w-full gap-28'>
                                <div className='text-sm mt-5 w-full flex items-start'>
                                  <span className='font-bold text-nowrap'>
                                    Transaction Rate <span className='text-xs'>(3.9%)</span>:
                                  </span>
                                </div>
                                <div className='text-sm mt-5 w-ful flex items-end'>
                                  <span className='font-bold text-end w-full'>₱{totalTransactionFee.current}</span>
                                </div>
                              </div>
                              <div className='flex flex-row w-full gap-28'>
                                <div className='text-sm mt-5 w-full flex items-start'>
                                  <span className='font-bold text-nowrap'>Total Payment Amount:</span>
                                </div>
                                <div className='text-sm mt-5 w-ful flex items-end'>
                                  <span className='font-bold text-end w-full'>₱{totalPaymentRef.current.toFixed(2)}</span>
                                </div>
                              </div>
                              {/* PayPal Button with Official SDK */}
                              <div className='mt-10 w-full'>
                                <PayPalScriptProvider
                                  options={{
                                    clientId: `${process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID as string}`,
                                    currency: 'USD', // Ensure the currency is set here
                                    // vault: true,
                                    intent: 'capture', // Add the intent
                                  }}
                                >
                                  <PayPalButtons
                                    style={{ layout: 'vertical' }}
                                    createOrder={createOrder}
                                    onApprove={onApprove}
                                    onError={(err) => {
                                      // console.error('PayPal error:', err);
                                      makeToastError('PayPal error');
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
                        <div className='flex flex-col w-full mt-10'>
                          <span className='text-left sm:text-center w-full px-5 sm:px-10 mt-5 sm:mt-10 text-sm text-muted-foreground'>
                            <span className=' relative sm:hidden'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                            This action cannot be cancelled while its being on process, this will only be undone by the administrator. For further information, please visit our support team at{' '}
                            <a href='/support' className='text-blue-600 underline'>
                              this link
                            </a>
                            , or check out our FAQ section for common inquiries, if you want to stop enrolling please contact us{' '}
                            <Link href={''} className='hover:underline hover:text-blue-600 text-blue-500'>
                              e2e2a@mondrey.dev
                            </Link>
                            or visit our office for assistance.
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className='text-sm mt-4 px-5 sm:px-10 w-full text-justify leading-relaxed'>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We are pleased to inform you that your payment has been successfully received. Thank you for completing this step. If you have any further questions or need assistance, feel free to reach out to our
                        support team or visit the school cashier&apos;s office.
                      </span>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Step5;
