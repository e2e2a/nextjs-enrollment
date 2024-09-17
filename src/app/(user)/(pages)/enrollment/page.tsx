'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EnrollmentForms from './components/Forms';
import ErrorPage from './components/ErrorPage';
import { getEnrollmentByUserId } from '@/services/enrollment';
import { useSession } from 'next-auth/react';
import { useCourseQuery, useEnrollmentQuery } from '@/lib/queries';
import Loader from '@/components/shared/Loader';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get('courses');
  const router = useRouter();
  const [allowedCourses, setAllowedCourses] = useState<any>([]);
  const [en, setEn] = useState<any>(null);
  const { data: res, isLoading: isCoursesLoading, error: isCoursesError } = useCourseQuery();
  useEffect(() => {
    // if (isCoursesError || !res || !res.courses) {
    if (isCoursesError || !res) {
      return setIsError(true);
    }
    if (res) {
      const courseTitles = res?.courses?.map((course) => course.courseCode.toLowerCase());
      setAllowedCourses(courseTitles);
    }
  }, [res, isCoursesLoading, isCoursesError]);

  // Allowed course codes
  const { data: d } = useSession();
  const session = d!.user;
  const { data: resE, isLoading: isResELoading, error: isResError } = useEnrollmentQuery(session.id);
  useEffect(() => {
    if (isResError || !resE) {
      setEn(null);
      return;
    }
    if (resE) {
      if (resE.enrollment) {
        setEn(resE.enrollment);
        const courseTitles = res?.courses?.map((course) => course.courseCode.toLowerCase());
        setAllowedCourses(courseTitles);
      }
      setIsPageLoading(false);
    }
  }, [resE, isResELoading, isResError, res]);
  useEffect(() => {
    const validateSearchParam = () => {
      if (search === null) {
        setIsError(false);
      } else if (!allowedCourses.includes(search.toLowerCase())) {
        setIsError(true);
      } else {
        setIsError(false);
      }
      // setIsLoading(false);
    };

    validateSearchParam();
  }, [search, allowedCourses]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <Loader />
        </div>
      ) : (
        resE && <div className=' bg-neutral-50 shadow-lg drop-shadow-none filter-none min-h-[86vh] py-5 rounded-xl'>{isError ? <ErrorPage /> : <EnrollmentForms search={search} enrollment={resE.enrollment} />}</div>
      )}
    </>
  );
};

export default Page;
