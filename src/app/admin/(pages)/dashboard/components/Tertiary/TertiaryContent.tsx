'use client';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { TertiaryDialog } from './TertiaryDialog';
import { useAllEnrollmentQuery, useEnrollmentSetupQuery } from '@/lib/queries';
import LoaderPage from '@/components/shared/LoaderPage';
import TertiaryAlertDialog from './TertiaryAlertDialog';
import TertiaryDialogEndSemester from './TertiaryDialogEndSemester';

const TertiaryContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
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
  const { data: eData, isLoading, error: eError } = useAllEnrollmentQuery('College');

  useEffect(() => {
    if (!esData || esError) return;
    if (eError || !eData) return;

    if (esData && eData) {
      if (esData.enrollmentSetup && eData.enrollment) {
        const filteredEnrolled = eData?.enrollment?.filter((enrollment: any) => enrollment.enrollStatus === 'Enrolled');
        setEnrolledStudents(filteredEnrolled);
        const filteredEnrolling = eData?.enrollment?.filter((enrollment: any) => enrollment.enrollStatus === 'Pending');
        setEnrollingStudents(filteredEnrolling);
        // setBlocks(esData.blockTypes);
        setIsPageLoading(false);
      }
      return;
    }
  }, [esData, esError, eData, eError]);
  const currentYear = new Date().getFullYear();
  if (enrolledStudents.length > 0) {
    enrolledStudents.forEach((student: any) => {
      const enrollmentDate = new Date(student.createdAt);
      const monthIndex = enrollmentDate.getMonth(); // Get month index (0-11)

      // Check if the year matches the current year
      if (enrollmentDate.getFullYear() === currentYear) {
        dataEnrolled[monthIndex].total += 1; // Increment the total for that month
      }
    });
  }
  /**
   * @todo
   * enrolledStudents
   * filtered by year
   */
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <TabsContent value='tertiary' className='space-y-4'>
          <div className='grid gap-4 grid-cols-1 md:grid-cols-2'>
            <div className=''>{!esData?.enrollmentSetup?.enrollmentTertiary || !esData?.enrollmentSetup?.enrollmentTertiary?.open ? <TertiaryDialog isPending={false} setIsOpen={setIsOpen} /> : <TertiaryAlertDialog />}</div>
            {!esData?.enrollmentSetup?.enrollmentTertiary?.open && esData?.enrollmentSetup?.enrollmentTertiary?.schoolYear && esData?.enrollmentSetup?.enrollmentTertiary?.semester && (
              <div className='w-full flex justify-start md:justify-end'>
                <TertiaryDialogEndSemester />
              </div>
            )}
          </div>
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
        </TabsContent>
      )}
    </>
  );
};

export default TertiaryContent;
