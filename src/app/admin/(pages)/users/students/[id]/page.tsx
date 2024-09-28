'use client';
import { Icons } from '@/components/shared/Icons';
import { UserAvatar } from '@/components/shared/nav/UserAvatar/UserAvatar';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailTab from './components/EmailTab';
import PasswordTab from './components/PasswordTab';
import ProfileTab from './components/ProfileTab';
import { useProfileQuery } from '@/lib/queries';
import LoaderPage from '@/components/shared/LoaderPage';
import { useParams, usePathname } from 'next/navigation';
import Loader from '@/components/shared/Loader';
import ErrorPage from './components/ErrorPage';
import ProfileTabEnrollCollege from './components/ProfileTabEnrollCollege';

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const { data } = useSession();
  const [isError, setIsError] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };
  const session = data?.user;
  const { data: res, isLoading, error } = useProfileQuery(params.id as string);

  useEffect(() => {
    if (error || !res) {
      // setIsError(true);
      return;
    }

    if (res) {
      if (res.profile) {
        setLoading(false);
      }
    }
  }, [error, res, session, loading]);
  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          {isError ? (
            <ErrorPage />
          ) : (
            res?.profile && (
              <div className='flex justify-center flex-col items-center'>
                <Tabs defaultValue='profile' onValueChange={handleTabChange} className='w-full'>
                  <div className='w-full justify-center items-center flex border-b-2 flex-col bg-gradient-to-t from-white from-10% via-sky-10 via-70% to-blue-100 rounded-md'>
                    <TabsList className='flex w-full grid-cols-2 bg-transparent '>
                      <TabsTrigger value='profile' className={` font-bold ${activeTab === 'profile' ? ' text-blue-400 underline' : null}`} onClick={() => handleTabChange('profile')}>
                        Profile
                      </TabsTrigger>
                      <TabsTrigger value='email' className={`font-bold ${activeTab === 'email' ? 'text-blue-400 underline' : null}`} onClick={() => handleTabChange('email')}>
                        Email
                      </TabsTrigger>
                      <TabsTrigger value='password' className={`font-bold ${activeTab === 'password' ? 'text-blue-400 underline' : null}`} onClick={() => handleTabChange('password')}>
                        Password
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  <div className='w-full flex flex-col justify-center items-center bg-slate-100 '>
                    <TabsContent value='profile' className={`w-full bg-white my-3 max-w-[69rem] rounded-lg`}>
                      {res.profile.enrollStatus === 'Pending' || res.profile.enrollStatus === 'Enrolled' ? (
                        /**
                         * @todo
                         * now we can specify here what the student is enrolling and what to display by there enrolling category data
                         */
                        res.profile.courseId && res.profile.courseId.category.toLowerCase() === 'college' ? (
                          <ProfileTabEnrollCollege profile={res?.profile} />
                        ) : (
                          <ProfileTab profile={res?.profile} />
                        )
                      ) : (
                        <ProfileTab profile={res?.profile} />
                      )}
                    </TabsContent>
                    <TabsContent value='email' className='w-full mb-3 max-w-[69rem]'>
                      <EmailTab />
                    </TabsContent>
                    <TabsContent value='password' className='w-full mb-3 max-w-[69rem]'>
                      <PasswordTab />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            )
          )}
        </>
      )}
    </>
  );
};

export default ProfilePage;
