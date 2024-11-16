'use client';
import React, { useEffect, useState } from 'react';
import { TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { TertiaryDialog } from './TertiaryDialog';
import { useEnrollmentSetupQuery } from '@/lib/queries/enrollmentSetup/get';
import LoaderPage from '@/components/shared/LoaderPage';
import TertiaryAlertDialog from './TertiaryAlertDialog';
import TertiaryDialogEndSemester from './TertiaryDialogEndSemester';
import { useEnrollmentQueryByCategory } from '@/lib/queries/enrollment/get/category';
import MainGrade from './grades/MainGrade';
import { useBlockCourseQueryByCategory } from '@/lib/queries/blocks/get/all';
import { useCourseQueryByCategory } from '@/lib/queries/courses/get/category';
import StudentsByCourses from './studentsByCourses/StudentsByCourses';

const TertiaryContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [temporaryEnrolledStudents, setTemporaryEnrolledStudents] = useState<any>([]);
  const [enrolledStudents, setEnrolledStudents] = useState<any>([]);
  const [enrollingStudents, setEnrollingStudents] = useState<any>([]);

  const dataEnrolled = [
    { name: 'Jan', total: 0 },
    { name: 'Feb', total: 0 },
    { name: 'Mar', total: 0 },
    { name: 'Apr', total: 0 },
    { name: 'May', total: 0 },
    { name: 'Jun', total: 0 },
    { name: 'Jul', total: 0 },
    { name: 'Aug', total: 0 },
    { name: 'Sep', total: 0 },
    { name: 'Oct', total: 0 },
    { name: 'Nov', total: 0 },
    { name: 'Dec', total: 0 },
  ];
  const { data: esData, isLoading: esLoading, isError: esError } = useEnrollmentSetupQuery();
  const { data: eData, isLoading, error: eError } = useEnrollmentQueryByCategory('College');
  const { data: bData, isLoading: bLoading, error: bError } = useBlockCourseQueryByCategory('College');
  const { data: cData, isLoading: cLoading, error: cError } = useCourseQueryByCategory('College');

  useEffect(() => {
    if (!esData || esError) return;
    if (eError || !eData) return;
    if (bError || !bData) return;
    if (cError || !cData) return;

    if (esData && eData) {
      if (esData.enrollmentSetup && eData.enrollment) {
        const filteredTemporaryEnrolled = eData?.enrollment?.filter((enrollment: any) => enrollment.enrollStatus === 'Temporary Enrolled');
        setTemporaryEnrolledStudents(filteredTemporaryEnrolled);
        const filteredEnrolled = eData?.enrollment?.filter((enrollment: any) => enrollment.enrollStatus === 'Enrolled');
        setEnrolledStudents(filteredEnrolled);
        const filteredEnrolling = eData?.enrollment?.filter((enrollment: any) => enrollment.enrollStatus === 'Pending');
        setEnrollingStudents(filteredEnrolling);

        setIsPageLoading(false);
      }
      return;
    }
  }, [esData, esError, eData, eError, bData, bError, cData, cError]);

  const currentYear = new Date().getFullYear();
  if (enrolledStudents.length > 0) {
    enrolledStudents.forEach((student: any) => {
      const enrollmentDate = new Date(student.createdAt);
      const monthIndex = enrollmentDate.getMonth();

      // Check if the year matches the current year
      if (enrollmentDate.getFullYear() === currentYear) {
        dataEnrolled[monthIndex].total += 1;
      }
    });
  }

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <TabsContent value='tertiary' className='space-y-4'>
          <h1 className='font-semibold tracking-tight text-[18px] xs:text-xl text-center my-5'>Start/Close/End Enrollment</h1>
          <div className='grid gap-4 grid-cols-1 sm:grid-cols-2'>
            <div className=''>
              {!esData?.enrollmentSetup?.enrollmentTertiary || !esData?.enrollmentSetup?.enrollmentTertiary?.open ? <TertiaryDialog isPending={false} setIsOpen={setIsOpen} enrollmentSetup={esData.enrollmentSetup} /> : <TertiaryAlertDialog />}
            </div>
            {!esData?.enrollmentSetup?.enrollmentTertiary?.open && esData?.enrollmentSetup?.enrollmentTertiary?.schoolYear && esData?.enrollmentSetup?.enrollmentTertiary?.semester && (
              <div className='w-full flex justify-start md:justify-end'>
                <TertiaryDialogEndSemester />
              </div>
            )}
          </div>

          {esData?.enrollmentSetup?.enrollmentTertiary?.schoolYear && esData?.enrollmentSetup?.enrollmentTertiary?.semester && <MainGrade setup={esData?.enrollmentSetup?.enrollmentTertiary} />}

          <div className='w-full'>
            <h1 className='font-semibold tracking-tight text-[18px] xs:text-xl text-center mt-10 mb-5'>Overall Students</h1>
            <div className='grid gap-4 md:grid-cols-2'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Enrolling Student</CardTitle>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{enrollingStudents.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Enrolled Student</CardTitle>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{enrolledStudents.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Temporary Enrolled Student</CardTitle>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                    <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{temporaryEnrolledStudents.length}</div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'></div>
          <Card className='col-span-4'>
            <CardHeader>
              <CardTitle>Enrolled Students</CardTitle>
            </CardHeader>
            <CardContent className='pl-2'>
              <ResponsiveContainer width='100%' height={350}>
                <BarChart data={dataEnrolled}>
                  <XAxis dataKey='name' stroke='#888888' fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke='#888888' fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                  <Bar dataKey='total' fill='currentColor' radius={[4, 4, 0, 0]} className='fill-black' />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <div className='grid gap-4 md:grid-cols-1'>
            <StudentsByCourses enrollments={eData.enrollment} courses={cData?.courses} blockTypes={bData?.blockTypes} />
          </div>
        </TabsContent>
      )}
    </>
  );
};

export default TertiaryContent;
