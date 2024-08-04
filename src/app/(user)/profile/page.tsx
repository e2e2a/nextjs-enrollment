'use client';
import { Icons } from '@/components/shared/Icons';
import { UserAvatar } from '@/components/shared/nav/UserAvatar/UserAvatar';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import React, { useState } from 'react';
import Note from './components/Note';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EmailTab from './components/EmailTab';
import PasswordTab from './components/PasswordTab';
import ProfileTab from './components/ProfileTab';

const ProfilePage = () => {
  const { data } = useSession();
  const [isOpen, setIsOpen] = useState(true);
  
  const [activeTab, setActiveTab] = useState('profile');
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
  };
  const session = data?.user;

  // useEffect(() => {
  //   // Reset scroll position when active tab changes
  //   console.log(activeTab)
  //   window.scrollTo(0, 0);
  // }, [activeTab]);
  return (
    <div className='flex justify-center flex-col items-center'>
      <Tabs defaultValue='profile' onValueChange={handleTabChange} className='w-full'>
        <div className='w-full justify-center items-center flex border-b-2 flex-col bg-gradient-to-t from-white from-20% via-blue-200 via-70% to-sky-300'>
          <div className='flex items-center gap-8 flex-col relative mb-4 w-full max-w-[73rem] border-b border-r border-l border-gray-200 rounded-b-xl pt-10 pb-12 px-11 bg-sky-50 shadow-xl drop-shadow-xl'>
            <div className='flex flex-col items-center flex-1 gap-5'>
              <div className='active:scale-[98%] active:drop-shadow-2xl active:select-none transition-transform duration-100 active:opacity-85 mt-1 select-none cursor-pointer'>
                <div className='flex flex-col h-[168px] w-[168px] relative select-none'>
                  <UserAvatar
                    session={{ firstname: session?.firstname, imageUrl: session?.imageUrl, asd: '' || null }}
                    className=''
                  />
                  <div className='absolute bottom-3 right-5 bg-slate-300 p-1 rounded-full'>
                    <Icons.camera className='h-6 w-6 text-muted-foreground fill-white' />
                  </div>
                </div>
              </div>
              <div className='flex flex-col flex-1 md:mt-2'>
                <div className='flex flex-col w-full'>
                  {session?.firstname && session?.lastname ? <h1 className='text-center h3-bold md:h1-semibold w-full'>{session.firstname} {session.lastname}</h1> : null}
                  <p className='small-regular md:body-medium text-light-3 text-center'>@e2e2a</p>
                </div>
              </div>
              <div className='flex justify-center'>
                <div className={``}>
                  <Button type='button' className='shad-button_primary px-8'>
                    Enroll now!
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <TabsList className='flex w-full grid-cols-2 bg-transparent '>
            <TabsTrigger
              value='profile'
              className={` font-bold ${activeTab === 'profile' ? ' text-blue-400 underline' : null}`}
              onClick={() => handleTabChange('profile')}
            >
              Profile
            </TabsTrigger>
            <TabsTrigger
              value='email'
              className={`font-bold ${activeTab === 'email' ? 'text-blue-400 underline' : null}`}
              onClick={() => handleTabChange('email')}
            >
              Email
            </TabsTrigger>
            <TabsTrigger
              value='password'
              className={`font-bold ${activeTab === 'password' ? 'text-blue-400 underline' : null}`}
              onClick={() => handleTabChange('password')}
            >
              Password
            </TabsTrigger>
          </TabsList>
        </div>
        <div className='w-full flex flex-col justify-center items-center bg-slate-100 '>
        {isOpen && (
          <div className='flex justify-center items-center mt-5'>
              <Note handleClose={handleClose} />
          </div>
        )}
          <TabsContent value='profile' className={`w-full bg-white mb-3 max-w-[69rem] rounded-lg ${isOpen ? 'mt-10' : ' mt-10'}  `}>
            <ProfileTab />
          </TabsContent>
          <TabsContent value='email' className='w-full mb-3 max-w-[69rem]'>
            <EmailTab />
          </TabsContent>
          <TabsContent value='password' className='w-full mb-3 max-w-[69rem]'>
            <PasswordTab/>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
