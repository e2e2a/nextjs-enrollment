'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useEnrollmentSetupQuery } from '@/lib/queries/enrollmentSetup/get';
import AddStudentSched from './components/AddStudentSched';
import LoaderPage from '@/components/shared/LoaderPage';
import { useBlockCourseQueryByCategory } from '@/lib/queries/blocks/get/category';
import { useEnrollmentQueryById } from '@/lib/queries/enrollment/get/id';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/Icons';
import { exportToPDF } from './components/ExportUtils';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [schedules, setSchedules] = useState<any>([]);
  const { data, isLoading, error: isEnError } = useEnrollmentQueryById(params.id || 'e2e2a');
  const { data: b, isLoading: bLoading, error: bError } = useBlockCourseQueryByCategory('College');
  const { data: ESetup, isLoading: ESetupLoading, error: ESetupError } = useEnrollmentSetupQuery();

  useEffect(() => {
    if (bError || !b) return;
    if (isEnError || !data) return;
    if (ESetupError || !ESetup) return;

    if (b && data && ESetup) {
      if (data.enrollment && b.blockTypes && ESetup.enrollmentSetup) {
        const filteredSchedules = b?.blockTypes?.filter((block: any) => block.courseId?._id === data?.enrollment?.courseId?._id);
        setSchedules(filteredSchedules);
        setIsPageLoading(false);
      }
    }
  }, [b, bError, data, isEnError, ESetup, ESetupError]);
  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {isError ? (
            <div className=''>404</div>
          ) : data && data.enrollment ? (
            <>
              <div className='flex items-end justify-end pt-1 text-black w-full text-center'>
                <Button
                  type='button'
                  onClick={() => exportToPDF(data?.enrollment, data?.enrollment?.studentSubjects, 'schedule')}
                  className='select-none focus-visible:ring-0 text-[15px] bg-none hover:bg-blue-500 text-black hover:text-neutral-100 tracking-normal font-medium font-poppins flex items-center justify-center'
                >
                  {' '}
                  <Icons.download className='h-4 w-4 mr-1' /> Download
                </Button>
              </div>
              <div className='flex items-center py-4 text-black w-full text-center flex-col'>
                <div className='mb-3'>
                  <h1 className='text-lg sm:text-2xl font-bold uppercase'>Student Subjects</h1>
                </div>
                <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
                  <div className='justify-between items-center flex w-full'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Fullname:{' '}
                      <span className='font-normal'>
                        {data?.enrollment?.profileId?.firstname ?? ''} {data?.enrollment?.profileId?.middlename ?? ''} {data?.enrollment?.profileId?.lastname ?? ''}{' '}
                        {data?.enrollment?.profileId?.extensionName ? data?.enrollment?.profileId?.extensionName + '.' : ''}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold '>
                      Department: <span className='font-normal'>{data?.enrollment?.courseId?.name}</span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start '>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Year:{' '}
                      <span className='font-normal'>
                        {data?.enrollment?.studentYear} - {data?.enrollment?.studentSemester}
                      </span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold'>
                      Block: <span className='font-normal'>{data?.enrollment?.blockTypeId?.section ? data?.enrollment?.blockTypeId?.section : 'N/A'}</span>
                    </span>
                  </div>
                  <div className='flex w-full justify-start'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Enrollment Status:
                      {data?.enrollment?.enrollStatus === 'Pending' && <span className='font-normal text-blue-500'>{data?.enrollment?.enrollStatus}</span>}
                      {data?.enrollment?.enrollStatus === 'Enrolled' && <span className='font-normal text-green-500'>{data?.enrollment?.enrollStatus}</span>}
                      {data?.enrollment?.enrollStatus === 'Temporary Enrolled' && <span className='font-normal text-orange-500'>{data.enrollment?.enrollStatus}</span>}
                      {data?.enrollment?.enrollStatus === 'Rejected' && <span className='font-normal text-red'>{data.enrollment?.enrollStatus}</span>}
                    </span>
                  </div>
                  <div className='flex w-full justify-start sm:justify-end'>
                    <span className='text-sm sm:text-[17px] font-bold capitalize'>
                      Student Type: <span className='font-normal'>{data?.enrollment?.studentType ? data?.enrollment?.studentType : 'N/A'}</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className='w-full flex justify-end items-center'>
                <AddStudentSched student={data.enrollment} b={schedules} />
              </div>
              <DataTable columns={columns} data={data?.enrollment?.studentSubjects} enrollmentSetup={ESetup?.enrollmentSetup} enrollment={data?.enrollment} />
            </>
          ) : (
            <div className=''>404</div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
