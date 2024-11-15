'use client';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import EnrollmentForms from './components/Forms';
import ErrorPage from './components/ErrorPage';
import { useSession } from 'next-auth/react';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useCourseQueryByCategory } from '@/lib/queries/courses/get/category';
import { useEnrollmentQueryBySessionId } from '@/lib/queries/enrollment/get/session';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get('courses');

  const { data: d } = useSession();
  const session = d!.user;

  const { data: res, isLoading: load, error: cError } = useCourseQueryByCategory('College');
  const { data: resP, isLoading: PLoading, error: PError } = useProfileQueryBySessionId();
  const { data: resE, isLoading: ELoading, error: EError } = useEnrollmentQueryBySessionId(session.id!);

  useEffect(() => {
    if (EError || !resE) return;
    if (PError || !resP) return;
    if (cError || !res) return;

    if (res && resE && resP) {
      if (resP.profile && res.courses) {
        if (search) {
          const courseTitles = res?.courses?.map((course: any) => course.courseCode.toLowerCase());
          if (!courseTitles.includes(search.toLowerCase())) return setIsError(true);
        }

        if (resP.profile.enrollStatus && resP.profile.enrollStatus === 'Pending') {
          if (resE.enrollment) {
            setIsError(false);
            setIsPageLoading(false);
            return;
          } else {
            setIsError(true);
            setIsPageLoading(false);
            return;
          }
        } else {
          setIsError(false);
          setIsPageLoading(false);
          return;
        }
      }
    }
  }, [resE, EError, resP, PError, res, cError, search]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : (
        resE && <div className='bg-white shadow-lg drop-shadow-none filter-none min-h-[86vh] py-5 rounded-xl'>{isError ? <ErrorPage /> : <EnrollmentForms search={search} enrollment={resE.enrollment} profile={resP?.profile} courses={res.courses} />}</div>
      )}
    </>
  );
};

export default Page;
