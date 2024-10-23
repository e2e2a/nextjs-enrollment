'use client';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

const Home = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: s } = useSession();
  const { data: pData, isLoading, error } = useProfileQueryBySessionId();

  useEffect(() => {
    if (error || !pData) {
      return;
    }
    if (pData) {
      if (pData.profile) {
        setIsPageLoading(false);
      }
    }
  }, [pData, error]);
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='bg-white py-5 px-5 rounded-xl mb-7'>
          <div className='flex w-full items-center text-black py-3'>
            <div className='flex flex-col gap-5'>
              <h1 className='text-[15px] xs:text-lg sm:text-2xl font-semibold capitalize'>
                Welcome,{' '}
                <span className=''>
                  {pData?.profile?.firstname} {pData?.profile?.lastname}
                </span>
              </h1>
              <p className='text-sm sm:text-[15px] font-normal text-muted-foreground'>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;We&apos;re excited to have you join us. We look forward to your growth, learning, and the contributions you&apos;ll make to our vibrant school community.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
