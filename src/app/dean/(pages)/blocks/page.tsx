'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { IBlockType } from '@/types';
import LoaderPage from '@/components/shared/LoaderPage';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useBlockCourseQueryByCategory } from '@/lib/queries/blocks/get/category';
import OptionsExport from './components/OptionsExport';


const Page = () => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [blocks, setBlocks] = useState<any>([]);
  const { data, isLoading, error } = useBlockCourseQueryByCategory('College');
  const { data: pData, isLoading: pload, error: pError } = useProfileQueryBySessionId();

  useEffect(() => {
    if (error || !data) return;
    if (pError || !pData) return;

    if (data && pData.profile) {
      if (data.blockTypes) {
        const filteredBlocks = data?.blockTypes.filter((b: any) => b?.courseId?._id === pData?.profile?.courseId?._id);
        setBlocks(filteredBlocks);
      }
      setIsPageLoading(false);
    }
  }, [data, error, pData, pError]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {((data?.error && data?.status === 404) || (pData?.error && pData?.status === 404)) && <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>404</div>}
          {((data?.error && data?.status > 500) || (pData?.error && pData?.status > 500)) && <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>Something Went Wrong</div>}

          {data?.blockTypes && pData?.profile && !pData?.error && !data?.error && (
            <div className=''>
              <OptionsExport data={blocks || []} />
              <div className='flex flex-col items-center justify-center py-4 text-black'>
                <h1 className='text-lg sm:text-3xl font-bold capitalize'>{pData?.profile?.courseId.name}</h1>
                <h1 className='text-lg sm:text-3xl font-semibold'>Blocks Management</h1>
              </div>
              <div className='flex items-center w-full justify-center py-4 text-black'>
                <Link href={'/dean/blocks/add'}>
                  <Button size={'sm'} className='focus:ring-0 bg-green-500 text-white flex gap-2'>
                    <Icons.add className='h-4 w-4' />
                    <span className='flex text-xs sm:text-sm'>Add New Block</span>
                  </Button>
                </Link>
              </div>
              <DataTable columns={columns} data={blocks as IBlockType[]} />
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
