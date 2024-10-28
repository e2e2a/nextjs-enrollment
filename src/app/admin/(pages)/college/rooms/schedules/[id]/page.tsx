'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useRoomQueryById } from '@/lib/queries/rooms/get/id';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data, isLoading, error: isEnError } = useRoomQueryById(params.id);

  useEffect(() => {
    if (isEnError || !data) return;
    if (data) {
      if (data.room) {
        setIsPageLoading(false);
      } else if (data.error) {
        setIsError(true);
        setIsPageLoading(false);
      }
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
          {data.error && isError && <div className=''>404</div>}
          {data && data.room && (
            <>
              <div className='flex items-center py-4 text-black w-full text-center flex-col'>
                <div>
                  <h1 className='text-lg sm:text-2xl font-bold uppercase'>{data.room.roomName}</h1>
                </div>
                <div className=''>
                  <h1 className='text-sm sm:text-lg font-bold capitalize'>Type: {data.room.roomType}</h1>
                </div>
              </div>
              <DataTable columns={columns} data={data.room.schedules} />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
