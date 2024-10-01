'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useEnrollmentQueryById, useRoomQuery, useBlockCourseQuery, useTeacherScheduleCollegeQuery } from '@/lib/queries';
import AddStudentSched from './AddStudentSched';
import LoaderPage from '@/components/shared/LoaderPage';
interface IProps {
  data: any;
}
const StudentSched = ({ data }: IProps) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [schedules, setSchedules] = useState<any>([]);
  //   const { data, isLoading, error: isEnError } = useEnrollmentQueryById(params.id);
  const { data: b, isLoading: bLoading, error: bError } = useBlockCourseQuery();
  // const { data: b, isLoading: bLoading, error: bError } = useTeacherScheduleCollegeQuery();
  //   useEffect(() => {
  //     if (isLoading || !data) return;
  //     if (isEnError) console.log(isEnError.message);
  //   }, [data, isLoading, isEnError]);
  useEffect(() => {
    if (bLoading || !b) return;
    if (bError) console.log(bError.message);
  }, [b, bLoading, bError]);
  useEffect(() => {
    if (b && data) {
      if (data && b.blockTypes) {
        const filteredSchedules = b?.blockTypes?.filter((block: any) => block.courseId._id === data?.courseId._id);
        // const filteredSchedules = b?.teacherSchedules?.filter((schedule: any) => schedule.blockTypeId !== null || schedule.blockTypeId);
        setSchedules(filteredSchedules);
        console.log('filteredSchedules', filteredSchedules);
        setIsPageLoading(false);
      }
    }
  }, [b, data]);
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
