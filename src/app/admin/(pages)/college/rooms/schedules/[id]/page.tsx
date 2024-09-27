'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useRoomQueryById, useTeacherScheduleCollegeQuery } from '@/lib/queries';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [schedules, setSchedules] = useState<any>([]);
  const { data, isLoading, error: isEnError } = useRoomQueryById(params.id);
  const { data: b, isLoading: bLoading, error: bError } = useTeacherScheduleCollegeQuery();

  useEffect(() => {
    if (isEnError || !data) return;
    if (bError || !b) return;

    if (b && data) {
      if (data.room && b.teacherSchedules) {
        const filteredSchedules = b?.teacherSchedules?.filter((sched: any) => sched.roomId._id === data?.room?._id);
        setSchedules(filteredSchedules);
        setIsPageLoading(false);
      }
    }
  }, [b, bError, data, isEnError]);
  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <Loader />
        </div>
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {isError ? (
            <div className=''>404</div>
          ) : data && data.room ? (
            <>
              <div className='flex items-center py-4 text-black w-full text-center flex-col'>
                <div>
                  <h1 className='text-lg sm:text-2xl font-bold uppercase'>{data.room.roomName}</h1>
                </div>
                <div className=''>
                  <h1 className='text-sm sm:text-lg font-bold capitalize'>Type: {data.room.roomType}</h1>
                </div>
              </div>
              <DataTable columns={columns} data={schedules} />
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
