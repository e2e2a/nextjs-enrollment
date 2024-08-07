'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EnrollmentForms from './components/Forms';
import LoaderPage from '@/components/shared/LoaderPage';
import ErrorPage from './components/ErrorPage';

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get('courses');
  const router = useRouter();

  // Allowed course codes
  const allowedCourses = ['DPIT', 'DPTHT', 'DPWT', 'DPET', 'DPFT'];

  useEffect(() => {
    const validateSearchParam = () => {
      if (search === null) {
        // No `courses` parameter means we're on `/enrollment`, which is acceptable
        setIsError(false);
      } else if (!allowedCourses.includes(search)) {
        // `courses` parameter is invalid
        setIsError(true);
      } else {
        // `courses` parameter is valid
        setIsError(false);
      }
      setIsLoading(false); // Set loading to false after validation
    };

    validateSearchParam();
  }, [search, allowedCourses]);

  return (
    <>
      {isLoading ? (
        <LoaderPage />
      ) : (
        <div className='bg-white py-5 rounded-xl'>
          {isError ? <ErrorPage /> : <EnrollmentForms />}
        </div>
      )}
    </>
  );
};

export default Page;
