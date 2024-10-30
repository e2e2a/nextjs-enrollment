'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { IRoom } from '@/types';
import { useAllRoomQueryByEduLevel } from '@/lib/queries/rooms/get/all';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [rooms, setRooms] = useState({});
  // Query data based on the validated step parameter
  const { data, isLoading, error: isEnError } = useAllRoomQueryByEduLevel('tertiary');

  useEffect(() => {
    if (isLoading || !data || !data.rooms) return;
    if (isEnError) console.log(isEnError.message);
    if (data) {
      if (data.rooms) {
        const filteredRooms = data?.rooms.filter((room: IRoom) => room.educationLevel === 'tertiary');
        setRooms(filteredRooms);
      }
      setIsPageLoading(false);
    }
  }, [data, isLoading, isEnError]);

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
          ) : (
            <div className=''>
              <div className='flex items-center py-4 text-black w-full justify-center'>
                <h1 className='sm:text-3xl text-xl font-bold '>Rooms Management</h1>
              </div>
              <DataTable columns={columns} data={rooms as IRoom[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
