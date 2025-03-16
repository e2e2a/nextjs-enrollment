'use client';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import LoaderPage from '@/components/shared/LoaderPage';
import { Overview } from './Overview';
import { useAllUsersQuery } from '@/lib/queries/user/get/all';
import { useAllProfileQueryByUserRoles } from '@/lib/queries/profile/get/roles/admin';

const MainOverview = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [totalAccounts, setTotalAccounts] = useState<number>(0);
  const [totalActive, setTotalActive] = useState<number>(0);
  const { data: AllU, error: AllUError } = useAllUsersQuery();
  const { data: raData, error: raError } = useAllProfileQueryByUserRoles('ADMIN');
  const { data: rsData, error: rsError } = useAllProfileQueryByUserRoles('STUDENT');
  const { data: rtData, error: rtError } = useAllProfileQueryByUserRoles('TEACHER');
  const { data: rdData, error: rdError } = useAllProfileQueryByUserRoles('DEAN');
  const { data: racData, error: racError } = useAllProfileQueryByUserRoles('ACCOUNTING');

  useEffect(() => {
    if (!AllU || AllUError) return;
    if (!rsData || rsError) return;
    if (!rtData || rtError) return;
    if (!rdData || rdError) return;
    if (!raData || raError) return;
    if (!racData || racError) return;

    if (rsData && rtData && rdData && raData) {
      if (rsData.profiles && rtData.profiles && rdData.profiles && raData.profiles) {
        const total = rsData.profiles.length + rtData.profiles.length + rdData.profiles.length + raData.profiles.length + racData.profiles.length;
        setTotalAccounts(total);
        const totalActive = AllU.users.filter((u: any) => u.active === true);
        setTotalActive(totalActive.length);
        setIsPageLoading(false);
      }
      return;
    }
  }, [rsData, rsError, rtData, rtError, rdData, rdError, raData, raError, racData, racError, AllU, AllUError]);
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
                <div className='text-2xl font-bold'>{totalActive}</div>
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
                <div className='text-2xl font-bold'>{rsData?.profiles?.length}</div>
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
                <div className='text-2xl font-bold'>{rdData?.profiles?.length}</div>
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
                <div className='text-2xl font-bold'>{rtData?.profiles?.length}</div>
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
                <div className='text-2xl font-bold'>{racData?.profiles?.length}</div>
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
                <div className='text-2xl font-bold'>{raData?.profiles?.length}</div>
              </CardContent>
            </Card>
          </div>
          <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'></div>
          <Card className='col-span-4'>
            <CardHeader>
              <CardTitle>Account Created</CardTitle>
            </CardHeader>
            <CardContent className='pl-2'>
              <Overview users={AllU?.users} />
            </CardContent>
          </Card>
        </TabsContent>
      )}
    </>
  );
};

export default MainOverview;
