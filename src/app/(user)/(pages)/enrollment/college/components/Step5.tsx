'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import LoaderPage from '@/components/shared/LoaderPage';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'; // PayPal React SDK
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useStudentReceiptMutation } from '@/lib/queries/studentReceipt/create';
import { useStudentReceiptQueryByUserId } from '@/lib/queries/studentReceipt/get/userId';
import { useTuitionFeeQueryByCourseId } from '@/lib/queries/tuitionFee/get/courseId';
import { Icons } from '@/components/shared/Icons';
import { useEnrollmentSetupQuery } from '@/lib/queries/enrollmentSetup/get';

type IProps = {
  enrollment: any;
};

const Step5 = ({ enrollment }: IProps) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [downPayment, setDownPayment] = useState(0);
  const dp = useRef(0);
  const totalPaymentRef = useRef(0);
  const totalTransactionFee = useRef(0);
  const paymentMethod = useRef('');
  const [displayPayment, setDisplayPayment] = useState(true);

  const { data: s } = useSession();
  const { data: esData, isLoading: esLoading, isError: esError } = useEnrollmentSetupQuery();
  const { data: srData, isLoading: srLoading, error: srError } = useStudentReceiptQueryByUserId(s?.user.id as string, esData?.enrollmentSetup?.enrollmentTertiary?.schoolYear);
  const { data: pData, isLoading: PLoading, error: pError } = useProfileQueryBySessionId();
  const { data: tfData, isLoading: tfLoading, error: tfError } = useTuitionFeeQueryByCourseId(pData?.profile.courseId._id as string);

  useEffect(() => {
    if (!enrollment) return;
    if (!esData || esError) return;
    if (!tfData || tfError) return;
    if (srError || !srData) return;
    if (pError || !pData) return;

    if (pData && srData && pData.profile && tfData && tfData.tFee) {
      setDownPayment(tfData.tFee.downPayment);
      dp.current = tfData?.tFee?.downPayment;
      const fee = Number(tfData.tFee.downPayment) * 0.039;
      totalTransactionFee.current = parseFloat(fee.toFixed(2));
      const totalPayment = Number(tfData.tFee.downPayment) + Number(fee) + 15;
      totalPaymentRef.current = parseFloat(totalPayment.toFixed(2));
      totalPaymentRef.current = totalPayment;
      if (srData.studentReceipt && srData.studentReceipt.length > 0) {
        const a = async () => {
          const b = await srData.studentReceipt.filter((sr: any) => sr.type === 'DownPayment');
          if (b && b.length === 0) return false;

          return b;
        };
        a().then((data) => {
          if (data && data.length > 0) {
            const payment = Number(tfData.tFee.downPayment);
            let lastPayment = 0;
            for (const payment of data) {
              lastPayment += parseFloat(Number(payment.amount.value || 0).toFixed(2));
            }
            if (lastPayment >= payment) {
              setDisplayPayment(false);
              setIsPageLoading(false);
            } else {
              setDisplayPayment(true);
              setIsPageLoading(false);
            }
            return;
          }
        });
        return;
      } else {
        setDisplayPayment(true);
        setIsPageLoading(false);
        return;
      }
    }
  }, [pData, pError, srData, srError, tfData, tfError, esData, esError, enrollment]);

  // Ensure that the amount is a string with two decimal places, except for certain currencies like JPY
  const formattedAmount = (amount: number) => {
    return amount ? amount.toFixed(2) : '1.00';
  };

  const createOrder = (data: any, actions: any) => {
    paymentMethod.current = data.paymentSource;
    const payment = totalPaymentRef.current;
    return actions.order.create({
      intent: 'CAPTURE', // Add intent: 'CAPTURE'
      purchase_units: [
        {
          // reference_id: 'e2e2a_1234',
          description: 'e2e2a order-1234',
          amount: {
            currency_code: 'USD', // Add the currency code
            value: formattedAmount(payment), // The formatted amount
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

  const mutation = useStudentReceiptMutation();
  const onApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      if (details.status === 'COMPLETED' || details.status === 'ON_HOLD' || details.status === 'PENDING') {
        const receipt = {
          captureId: details.purchase_units[0].payments.captures[0].id,
          studentId: pData?.profile._id,
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
            id: details.payer.payer_id, // Payer ID
            name: details.payer.name, // Payer name (given_name, surname)
            email: details.payer.email_address, // Payer email
            // address: details.purchase_units[0].address
          },
          taxes: {
            fee: totalTransactionFee.current,
            fixed: 15,
            amount: dp.current,
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
      // console.error('Error capturing order:', error);
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
                <div className=' mt-3'>
                  <h1 className='text-center text-xl sm:text-3xl font-semibold text-black'>STUDENT PAYMENT</h1>
                </div>
                <div className='w-full flex justify-center items-center md:mt-4 md:mb-0'>
                  <Icons.hourglass className='md:h-14 fill-gray-100 md:w-14 h-10 w-10 my-3 stroke-green-400 animate-spin' style={{ animationDuration: '6s' }} />
                </div>
                {/* <h1 className='text-center text-xl sm:text-3xl font-bold font-poppins text-green-400'>Student Payment!</h1> */}
                <span className='text-sm text-left sm:mt-10 mt-5 w-full px-5 sm:px-10'>
                  Dear{' '}
                  <span className='font-semibold capitalize'>
                    <span className='capitalize'>{enrollment?.profileId?.firstname ?? ''}</span> <span className='capitalize'>{enrollment?.profileId?.lastname ?? ''}</span>
                  </span>
                  ,
                </span>
                {displayPayment ? (
                  <span className='text-sm mt-4 px-5 sm:px-10 w-full text-justify leading-relaxed'>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To proceed with your payment, you can use PayPal, a credit card, or a debit card. If you don&apos;t have access to these options, we kindly ask you to visit the school cashier&apos;s office at DCIT. Our
                    friendly staff will assist you with the payment process and ensure you receive any necessary documentation. For additional guidance or questions, please refer to our documentation, which can be accessed via{' '}
                    <a href='/documentation' className='text-blue-600 underline hover:text-blue-800'>
                      this link
                    </a>
                    .
                  </span>
                ) : (
                  <span className='text-sm mt-4 px-5 sm:px-10 w-full text-justify leading-relaxed'>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We are pleased to inform you that your payment has been successfully received. Thank you for completing this step. If you have any further questions or need assistance, feel free to reach out to our
                    support team or visit the school cashier&apos;s office.
                  </span>
                )}
              </>
            )}
          </div>
          {displayPayment && (
            <>
              <div className='px-5 w-full sm:px-1 sm:w-1/2 flex justify-center flex-col'>
                <h1 className=''>
                  <span className='text-[16px] font-bold text-orange-400'>Note</span>
                </h1>
                <span className='text-sm text-justify'>Please be aware that the transaction fee applied to this payment is determined by PayPal. This fee is only applicable to online payments processed through PayPal.</span>
              </div>
              <div className='flex flex-col justify-center items-center w-full '>
                <div className='border p-11 rounded-lg bg-neutral-50 shadow-md drop-shadow-md'>
                  <h1 className='w-full text-center text-2xl font-bold'>Down Payment</h1>
                  <div className='grid grid-cols-1'>
                    <div className='flex flex-row w-full gap-28'>
                      <div className='text-sm sm:mt-10 mt-5 w-full flex items-start'>
                        <span className='font-bold text-nowrap'>Payment Amount:</span>
                      </div>
                      <div className='text-sm sm:mt-10 mt-5 w-ful flex items-end'>
                        <span className='font-bold text-end w-full'>₱{downPayment}</span>
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
                        <span className='font-bold text-end w-full'>₱{totalPaymentRef.current}</span>
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
            </>
          )}

          <div className='flex flex-col w-full mt-20'>
            <span className='text-left sm:text-center w-full px-5 sm:px-10 mt-5 sm:mt-10 text-sm text-muted-foreground'>
              <span className=' relative sm:hidden'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
              This action cannot be cancelled while its being on process, this will only be undone by the administrator. For further information, please visit our support team at{' '}
              <a href='/support' className='text-blue-600 underline'>
                this link
              </a>
              , or check out our FAQ section for common inquiries, if you want to stop enrolling please contact us{' '}
              <Link href={''} className='hover:underline hover:text-blue-600 text-blue-500'>
                e2e2a@mondrey.dev{' '}
              </Link>
              or visit our office for assistance.
            </span>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Step5;
