'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useEnrollmentQueryById, useBlockCourseQuery, useEnrollmentSetupQuery } from '@/lib/queries';
import AddStudentSched from './components/AddStudentSched';
import LoaderPage from '@/components/shared/LoaderPage';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [schedules, setSchedules] = useState<any>([]);
  const { data, isLoading, error: isEnError } = useEnrollmentQueryById(params.id);
  const { data: b, isLoading: bLoading, error: bError } = useBlockCourseQuery();
  const { data: ESetup, isLoading: ESetupLoading, error: ESetupError } = useEnrollmentSetupQuery();
  // const { data: b, isLoading: bLoading, error: bError } = useTeacherScheduleCollegeQuery();

  useEffect(() => {
    if (bError || !b) return;
    if (isEnError || !data) return;
    if (ESetupError || !ESetup) return;

    if (b && data && ESetup) {
      if (data.enrollment && b.blockTypes && ESetup.enrollmentSetup) {
        const filteredSchedules = b?.blockTypes?.filter((block: any) => block.courseId._id === data?.enrollment?.courseId._id);
        // const filteredSchedules = b?.teacherSchedules?.filter((schedule: any) => schedule.blockTypeId !== null || schedule.blockTypeId);
        setSchedules(filteredSchedules);
        setIsPageLoading(false);
      }
    }
  }, [b, bError, data, isEnError, ESetup, ESetupError]);
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
          ) : data && data.enrollment ? (
            <>
              <div className='flex items-center py-4 text-black w-full text-center flex-col'>
                <div>
                  <h1 className='text-lg sm:text-2xl font-bold uppercase'>Student Subjects</h1>
                </div>
                <div className=''>
                  <h1 className='text-sm sm:text-lg font-bold capitalize'>{data.enrollment.courseId.name}</h1>
                </div>
                <div className=''>
                  <h1 className='text-sm sm:text-lg font-bold capitalize'>
                    {data.enrollment.profileId.firstname} {data.enrollment.profileId.middlename} {data.enrollment.profileId.lastname} {data.enrollment.profileId.extensionName ? data.enrollment.profileId.extensionName : ''}
                  </h1>
                </div>
                <div className=''>
                  <h1 className='text-sm font-bold'>
                    {data.enrollment.studentYear} - {data.enrollment.studentSemester}
                  </h1>
                </div>
                <div className=''>
                  <h1 className='text-xs font-bold'>
                    Enrollment Status: <span className='text-blue-500'>{data.enrollment.enrollStatus}</span>
                  </h1>
                </div>
              </div>
              <div className='w-full flex justify-end items-center'>
                <AddStudentSched student={data.enrollment} b={schedules} />
              </div>
              <DataTable columns={columns} data={data?.enrollment.studentSubjects} enrollmentSetup={ESetup.enrollmentSetup}/>
            </>
          ) : (
            <div className=''>404</div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
