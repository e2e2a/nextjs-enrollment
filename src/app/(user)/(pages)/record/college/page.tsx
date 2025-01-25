'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useEnrollmentRecordQueryByProfileId } from '@/lib/queries/enrollmentRecord/get/profileId';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: pData, isLoading: pload, error } = useProfileQueryBySessionId();
  const { data, isLoading, error: isEnError } = useEnrollmentRecordQueryByProfileId(pData?.profile?._id as string);

  useEffect(() => {
    if (isEnError || !data) return;
    if (error || !pData) return;

    if (data && pData) {
      setIsPageLoading(false);
    }
  }, [data, isEnError, pData, error]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {((data?.error && data?.status === 404) || (pData?.error && pData?.status === 404)) && <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>404</div>}
          {((data?.error && data?.status > 500) || (pData?.error && pData?.status > 500)) && <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>Something Went Wrong</div>}
          {data?.enrollmentRecord && pData?.profile && !pData?.error && !data?.error && (
            <div className=''>
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-semibold tracking-tight '>Enrollment Records</h1>
              </div>
              <DataTable columns={columns} data={data.enrollmentRecord as any[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
