'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useSearchParams } from 'next/navigation';
import { useVGTokenQueryByParamsToken } from '@/lib/queries/tokens/viewGrades';

const Page = () => {
  const [schedule, setSchedule] = useState([]);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const { data, isLoading, error: isEnError } = useVGTokenQueryByParamsToken(token);
  console.log('data', data);
  useEffect(() => {
    if (isEnError || !data) return;

    if (data) {
      if (data.enrollment) {
        const filteredSchedules = data.enrollment?.studentSubjects?.filter((ss: any) => ss.status === 'Approved');
        if (data.enrollment?.enrollStatus === 'Enrolled' || data.enrollment?.enrollStatus === 'Temporary Enrolled') {
          setSchedule(filteredSchedules);
        } else {
          setSchedule(data.enrollment?.studentSubjects);
        }
      }
      setIsPageLoading(false);
    }
  }, [data, isEnError]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          <div className='flex items-center py-4 text-black text-center flex-col mb-7'>
            <div className='mb-3'>
              <h1 className='text-lg sm:text-2xl font-bold uppercase'>Student&apos;s Schedules</h1>
            </div>
            <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1'>
              <div className='justify-between items-center flex w-full'>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Fullname:{' '}
                  <span className='font-normal'>
                    {data.enrollment.profileId.firstname} {data.enrollment.profileId.middlename ?? ''} {data.enrollment.profileId.lastname} {data.enrollment.profileId.extensionName ? data.enrollment.profileId.extensionName + '.' : ''}
                  </span>
                </span>
              </div>
              <div className='flex w-full justify-start sm:justify-end'>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Department: <span className='font-normal'>{data.enrollment.courseId.name}</span>
                </span>
              </div>
              <div className='flex w-full justify-start '>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Year:{' '}
                  <span className='font-normal'>
                    {data.enrollment.studentYear} - {data.enrollment.studentSemester}
                  </span>
                </span>
              </div>
              <div className='flex w-full justify-start sm:justify-end'>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Block: <span className='font-normal'>{data.enrollment?.blockTypeId?.section ? data.enrollment.blockTypeId?.section : 'N/A'}</span>
                </span>
              </div>
              <div className='flex w-full justify-start'>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Enrollment Status:
                  {data.enrollment.enrollStatus === 'Pending' && <span className='font-normal text-blue-500'>{data.enrollment.enrollStatus}</span>}
                  {data.enrollment.enrollStatus === 'Enrolled' && <span className='font-normal text-green-500'>{data.enrollment.enrollStatus}</span>}
                  {data.enrollment.enrollStatus === 'Temporary Enrolled' && <span className='font-normal text-orange-500'>{data.enrollment.enrollStatus}</span>}
                  {data.enrollment.enrollStatus === 'Rejected' && <span className='font-normal text-red'>{data.enrollment.enrollStatus}</span>}
                </span>
              </div>
            </div>
          </div>
          <DataTable columns={columns} data={schedule} />
        </div>
      )}
    </>
  );
};

export default Page;
