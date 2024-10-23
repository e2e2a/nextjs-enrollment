'use client';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import Note from './components/Note';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailTab from './components/EmailTab';
import PasswordTab from './components/PasswordTab';
import ProfileTab from './components/ProfileTab';
import ProfileDialog from './components/ProfileDialog';
import LoaderPage from '@/components/shared/LoaderPage';
import ErrorPage from './components/ErrorPage';
import { decryptData } from '@/lib/encryption';
import { useProfileQueryBySessionId } from '@/lib/queries/profile';

const ProfilePage = () => {
  const { data } = useSession();
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('profile');
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };
  const session = data?.user;
  const { data: res, isLoading, error } = useProfileQueryBySessionId();

  useEffect(() => {
    if (error || !res) {
      return;
    }
    if (res && res.profile) {
      // const decrypt = decryptData(res.profile, 'mysecret7777')
      // setProfile(JSON.parse(decrypt))
      setProfile(res.profile)
      setLoading(false);
      return 
    }
  }, [error, res, profile]);
  return (
    <>
      {loading ? (
        <LoaderPage />
      ) : profile && (
        <div className='flex justify-center flex-col items-center'>
          <Tabs defaultValue='profile' onValueChange={handleTabChange} className='w-full'>
            <div className='w-full justify-center items-center flex border-b-2 flex-col bg-gradient-to-t from-white from-20% via-blue-200 via-70% to-sky-300'>
              <ProfileDialog session={session} profile={profile} />
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
              {profile.isVerified
                ? null
                : isOpen && (
                    <div className='flex justify-center items-center mt-5'>
                      <Note handleClose={handleClose} profile={profile} />
                    </div>
                  )}
              <TabsContent value='profile' className={`w-full bg-neutral-50  my-10 max-w-[69rem] rounded-lg`}>
                <ProfileTab session={session} profile={profile} />
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
      )}
      ;
    </>
  );
};

export default ProfilePage;
