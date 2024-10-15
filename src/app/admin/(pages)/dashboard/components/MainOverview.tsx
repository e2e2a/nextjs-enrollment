'use client';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoaderPage from '@/components/shared/LoaderPage';
import { Overview } from './Overview';
import { useAllUsersQuery, useUserRolesAdminQuery, useUserRolesDeansQuery, useUserRolesStudentQuery, useUserRolesTeacherQuery } from '@/lib/queries';

const MainOverview = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const { data: AllU, error: AllUError } = useAllUsersQuery();
  const { data: rsData, error: rsError } = useUserRolesStudentQuery();
  const { data: rtData, error: rtError } = useUserRolesTeacherQuery();
  const { data: rdData, error: rdError } = useUserRolesDeansQuery();
  const { data: raData, error: raError } = useUserRolesAdminQuery();
  useEffect(() => {
    if (!AllU || AllUError) return;
    if (!rsData || rsError) return;
    if (!rtData || rtError) return;
    if (!rdData || rdError) return;
    if (!raData || raError) return;

    if (rsData && rtData && rdData && raData) {
      if (rsData.students && rtData.teachers && rdData.deans && raData.admins) {
        const total = rsData.students.length + rtData.teachers.length + rdData.deans.length + raData.admins.length;
        setTotalAccounts(total);
        setIsPageLoading(false);
      }
      return;
    }
  }, [rsData, rsError, rtData, rtError, rdData, rdError, raData, raError, AllU, AllUError]);
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <TabsContent value='overview' className='space-y-4'>
          <div className='grid gap-4 md:grid-cols-2 '>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Total Accounts</CardTitle>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                  <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{totalAccounts}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Active Now</CardTitle>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                  <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>+573</div>
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Students</CardTitle>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                  <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{rsData?.students?.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Deans</CardTitle>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                  <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{rdData?.deans?.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Instructors</CardTitle>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                  <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{rtData?.teachers?.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Accounting</CardTitle>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                  <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>0</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                <CardTitle className='text-sm font-medium'>Admins</CardTitle>
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
                  <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
                </svg>
              </CardHeader>
              <CardContent>
                <div className='text-2xl font-bold'>{raData?.admins?.length}</div>
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'></div>
          <Card className='col-span-4'>
            <CardHeader>
              <CardTitle>Account Created</CardTitle>
            </CardHeader>
            <CardContent className='pl-2'>
              <Overview users={AllU.users}/>
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </>
  );
};

export default MainOverview;
