'use client';
import React, { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailTab from './components/EmailTab';
import PasswordTab from './components/PasswordTab';
import ProfileTab from './components/ProfileTab';
import LoaderPage from '@/components/shared/LoaderPage';
import ErrorPage from './components/ErrorPage';
import { useProfileQueryByParamsUserId } from '@/lib/queries/profile/get/userId';

const ProfilePage = ({ params }: { params: { id: string } }) => {
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };

  const { data: res, isLoading, error } = useProfileQueryByParamsUserId(params.id as string);

  useEffect(() => {
    if (error || !res) return;

    if (res) {
      if (res.profile) {
        setIsPageLoading(false);
      } else if (res.error) {
        setIsError(true);
        setIsPageLoading(false);
      }
    }
  }, [error, res]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
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
                    <TabsContent value='profile' className={`w-full bg-white my-3 rounded-lg`}>
                      <ProfileTab profile={res?.profile} />
                    </TabsContent>
                    <TabsContent value='email' className='w-full bg-neutral-50 rounded-lg'>
                      <EmailTab profile={res?.profile} />
                    </TabsContent>
                    <TabsContent value='password' className='w-full bg-neutral-50  my-10 rounded-lg'>
                      <PasswordTab profile={res?.profile} />
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
