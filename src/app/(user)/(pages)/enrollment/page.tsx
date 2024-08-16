'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EnrollmentForms from './components/Forms';
import LoaderPage from '@/components/shared/LoaderPage';
import ErrorPage from './components/ErrorPage';
import { getEnrollmentByUserId } from '@/services/enrollment';
import { useSession } from 'next-auth/react';
import { useCourseQuery, useEnrollmentQuery } from '@/lib/queries';
import Loader from '@/components/shared/Loader';

const Page = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get('courses');
  const router = useRouter();
  const [allowedCourses, setAllowedCourses] = useState<any>([]);
  const [en, setEn] = useState<any>(null);
  const { data: res, isLoading: isCoursesLoading, error: isCoursesError } = useCourseQuery();
  useEffect(() => {
    if (isCoursesError || !res || !res.courses) {
      return;
    }
    if (res) {
      console.log('courses logs:', res.courses);
      
      const courseTitles = res?.courses?.map((course) => course.courseCode.toLowerCase());
      setAllowedCourses(courseTitles);
    }
  }, [res, isCoursesLoading, isCoursesError]);
  
  // Allowed course codes
  const { data: d } = useSession();
  const session = d!.user;
  const { data: resE, isLoading: isResELoading, error: isResError } = useEnrollmentQuery(session.id);
  useEffect(() => {
    if (isResError || !resE || !resE.enrollment) {
      setEn(null)
      return;
    }
    if (resE) {
      setEn(resE.enrollment)
      const courseTitles = res?.courses?.map((course) => course.courseCode.toLowerCase());
      setAllowedCourses(courseTitles);
    }
  }, [resE, isResELoading, isResError]);
  useEffect(() => {
    // const checkEnrollment = async () => {
    //   const enrollment = await getEnrollmentByUserId(session!.id as string);
    //   // console.log(enrollment)
    //   return enrollment;
    // };
    // checkEnrollment().then(ee => setEn(ee));
    const validateSearchParam = () => {
      if (search === null) {
        // No `courses` parameter means we're on `/enrollment`, which is acceptable
        setIsError(false);
      } else if (!allowedCourses.includes(search.toLowerCase())) {
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

  return <>{isLoading ? <Loader /> : <div className='bg-white min-h-[86vh] py-5 rounded-xl'>{isError ? <ErrorPage /> : <EnrollmentForms search={search} enrollment={en} />}</div>}</>;
};

export default Page;
