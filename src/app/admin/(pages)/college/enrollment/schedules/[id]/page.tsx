'use client';
import { Loader } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { DataTable } from './components/DataTable';
import { columns } from './components/Columns';
import { useEnrollmentQueryById, useRoomQuery, useBlockCourseQuery, useTeacherScheduleCollegeQuery } from '@/lib/queries';
import AddStudentSched from './components/AddStudentSched';

const Page = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [schedules, setSchedules] = useState<any>([]);
  const { data, isLoading, error: isEnError } = useEnrollmentQueryById(params.id);
  // const { data: b, isLoading: bLoading, error: bError } = useBlockCourseQuery();
  const { data: b, isLoading: bLoading, error: bError } = useTeacherScheduleCollegeQuery();
  useEffect(() => {
    if (isLoading || !data) return;
    if (isEnError) console.log(isEnError.message);
  }, [data, isLoading, isEnError]);
  useEffect(() => {
    if (bLoading || !b) return;
    if (bError) console.log(bError.message);
  }, [b, bLoading, bError]);

  useEffect(() => {
    if (b && data) {
      if(b.teacherSchedules){
        const filteredSchedules = b?.teacherSchedules?.filter((schedule: any) => schedule.blockTypeId !== null || schedule.blockTypeId);
      setSchedules(filteredSchedules);
      setIsPageLoading(false);
      }
    }
  }, [b, data]);
  return (
    <>
      {isPageLoading ? (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>
          <Loader />
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
                {/* <AddInstructorSched blockType={data} s={s?.teacherSchedules} /> */}
                <AddStudentSched student={data.enrollment} b={schedules} />
              </div>
              <DataTable columns={columns} data={data?.enrollment.studentSubjects} />
              {/* <DataTable columns={columns} data={ts?.teacherSchedules} /> */}
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
