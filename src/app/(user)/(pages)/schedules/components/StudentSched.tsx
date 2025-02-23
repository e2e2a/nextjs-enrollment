'use client';
import React, { useEffect, useState } from 'react';
import AddStudentSched from './AddStudentSched';
import LoaderPage from '@/components/shared/LoaderPage';
import { useBlockCourseQueryByCategory } from '@/lib/queries/blocks/get/category';
interface IProps {
  data: any;
}
const StudentSched = ({ data }: IProps) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [schedules, setSchedules] = useState<any>([]);
  const { data: b, isLoading: bLoading, error: bError } = useBlockCourseQueryByCategory('College');

  useEffect(() => {
    if (bError || !b) return;
    if (b && data) {
      if (data && b.blockTypes) {
        const filteredSchedules = b?.blockTypes?.filter((block: any) => block?.courseId?._id === data?.courseId?._id);
        setSchedules(filteredSchedules);
        setIsPageLoading(false);
      }
    }
  }, [b, bError, data]);

  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <LoaderPage />
        </div>
      ) : (
        <div className=''>{isError ? <div className=''>404</div> : data && <AddStudentSched student={data} b={schedules} />}</div>
      )}
    </>
  );
};

export default StudentSched;
