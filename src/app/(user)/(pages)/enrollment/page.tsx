'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EnrollmentForms from './components/Forms';
import LoaderPage from '@/components/shared/LoaderPage';
import ErrorPage from './components/ErrorPage';
import { getEnrollmentByUserId } from '@/services/enrollment';
import { useSession } from 'next-auth/react';

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get('courses');
  const router = useRouter();

  // Allowed course codes
  const allowedCourses = ['DPIT', 'DPTTH', 'DPWT', 'DPET', 'DPFT'];
  
  const {data: d} = useSession()
  const session = d!.user
  useEffect(() => {
    const checkEnrollment = async() => {
      const enrollment = await getEnrollmentByUserId(session!.id as string);
      // console.log(enrollment)
      return enrollment
    }
    checkEnrollment()
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
          {isError ? <ErrorPage /> : <EnrollmentForms search={search} />}
        </div>
      )}
    </>
  );
};

export default Page;
