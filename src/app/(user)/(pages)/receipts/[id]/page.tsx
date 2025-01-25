'use client';
import React, { useEffect, useState } from 'react';
import LoaderPage from '@/components/shared/LoaderPage';
import { useStudentReceiptQueryById } from '@/lib/queries/studentReceipt/get/id';
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const Page = ({ params }: { params: { id: string } }) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, error } = useStudentReceiptQueryById(params.id);

  useEffect(() => {
    if (error || !data) return;
    if (data) {
      setIsPageLoading(false);
    }
  }, [data, error]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {data?.error && data?.status === 404 && <div className=''>404</div>}
          {data?.error && data?.status > 500 && <div className=''>Something Went Wrong</div>}
          {data?.studentReceipt && !data.error && (
            <div className=''>
              <div className='flex py-4 text-black w-full justify-between px-5 sm:px-10'>
                <div className='flex flex-col'>
                  <h1 className='sm:text-3xl text-xl font-bold '>Receipt</h1>
                  <p className='text-sm text-muted-foreground'>No. {data.studentReceipt.orderID}</p>
                </div>
                <div className='flex flex-col justify-start items-start mt-2'>
                  <p className='text-sm text-muted-foreground'>Contact Us Support DCIT: (02) 8231-2988</p>
                </div>
              </div>
              <div className=' border-t my-5'>
                <div className='flex text-black w-full justify-between px-10 sm:px-10 mt-14'>
                  <div className='flex flex-col'>
                    <h1 className='sm:text-lg text-[17px] font-bold '>Date:</h1>
                    <p className='text-sm text-muted-foreground'>{new Date(data?.studentReceipt?.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className='flex flex-col'>
                    <h1 className='sm:text-lg text-[17px] font-bold '>Customer #:</h1>
                    <p className='text-sm text-muted-foreground'>{data?.studentReceipt?.payer.id}</p>
                  </div>
                </div>
                <div className='flex justify-between items-start w-full px-5 pr-10 py-10 bg-gray-100 mt-4 rounded-lg'>
                  <div className='flex flex-col text-sm mr-10 mt-4'>
                    <div className='font-semibold'>BILL TO:</div>
                    <div className=''>
                      {data?.studentReceipt?.payer.name.given_name} {data?.studentReceipt?.payer.name.surname}
                    </div>
                    <div className=''>{data?.studentReceipt?.payer.address.address_line_1}</div>
                    <div className='text-nowrap'>
                      {data?.studentReceipt?.payer.address.admin_area_2} {data?.studentReceipt?.payer.address.admin_area_1} {data?.studentReceipt?.payer.address.postal_code}
                    </div>
                    <div className=''>{data?.studentReceipt?.payer.address.country_code === 'US' && 'United State'}</div>
                    <div className=''>{data?.studentReceipt?.payer.address.country_code === 'PH' && 'Philippines'}</div>
                  </div>
                  <div className='flex w-full'>
                    <div className='flex flex-col text-sm w-full'>
                      <div className='border-b-2 mb-5'>
                        <div className=''>
                          <h1 className='font-semibold'>PAYMENT</h1>
                        </div>
                        <div className='mt-2 mb-6 flex justify-between w-full'>
                          <div className='uppercase font-semibold'>{data.studentReceipt.paymentMethod}</div>
                          <div className=' text-muted-foreground'>₱{data.studentReceipt.amount.value}</div>
                        </div>
                      </div>
                      <div className='flex flex-col gap-y-5 border-b-2 mb-5'>
                        <div className='mt-2 mb-6 flex justify-between w-full'>
                          <div className='uppercase font-semibold'>Previous Balance</div>
                          <div>₱{data.studentReceipt.amount.value}</div>
                        </div>
                        <div className='mt-2 mb-6 flex justify-between w-full'>
                          <div className='uppercase font-semibold'>Received Payment</div>
                          <div>{data?.studentReceipt?.captures?.seller_protection.dispute_categories[0] === 'RECEIVED' ? `₱${data.studentReceipt.amount.value}` : 'Item Not Received'}</div>
                        </div>
                      </div>
                      <div className='mt-2 mb-6 flex justify-between w-full'>
                        <div className='uppercase font-semibold'>Balance Due (PHP)</div>
                        <div className=' text-muted-foreground'>₱0.00</div>
                      </div>
                    </div>
                  </div>
                </div>
                <Table className='mt-6 w-full '>
                  <TableCaption>A list of your recent invoices.</TableCaption>
                  <TableHeader className='bg-none p-5'>
                    <TableRow className='text-center items-center'>
                      <TableHead className='text-center text-black font-bold' colSpan={2}>
                        Product
                      </TableHead>
                      <TableHead className='text-center font-bold text-black pr-2'>Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className='bg-gray-100'>
                    <TableRow className=''>
                      <TableCell className='font-medium uppercase text-center ' colSpan={2}>
                        {data?.studentReceipt?.type === 'DownPayment' && 'Down Payment'}
                      </TableCell>
                      <TableCell className='text-center '>{data?.studentReceipt?.taxes?.amount && `₱${data?.studentReceipt?.taxes?.amount}`}</TableCell>
                    </TableRow>
                  </TableBody>
                  <TableFooter className='bg-gray-100'>
                    <TableRow className=''>
                      <TableCell colSpan={2} className='pl-32 sm:pl-32 font-bold'>
                        SubTotal
                      </TableCell>
                      <TableCell className='text-right pr-5 sm:pr-40 '>{data?.studentReceipt?.taxes?.amount && `₱${data?.studentReceipt?.taxes?.amount}`}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} className='pl-0 sm:pl-40 font-medium'>
                        Fixed Fee
                      </TableCell>
                      <TableCell className='text-right pr-5 sm:pr-40 '>{data?.studentReceipt?.taxes?.fixed && `₱${data?.studentReceipt?.taxes?.fixed}`}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} className='pl-0 sm:pl-40 font-medium'>
                        Transaction Rate
                      </TableCell>
                      <TableCell className='text-right pr-5 sm:pr-40 '>{data?.studentReceipt?.taxes?.fee && `₱${data?.studentReceipt?.taxes?.fee}`}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={2} className='pl-32 sm:pl-32 font-bold'>
                        Total
                      </TableCell>
                      <TableCell className='text-right pl-0 sm:pr-40'>₱{data?.studentReceipt?.amount.value}</TableCell>
                    </TableRow>
                  </TableFooter>
                </Table>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
