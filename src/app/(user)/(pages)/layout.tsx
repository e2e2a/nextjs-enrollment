'use client';
import Loader from '@/components/shared/Loader';
import { MainNav } from '@/components/shared/nav/MainNav';
import { MobileNav } from '@/components/shared/nav/MobileNav';
import { SidebarNav } from '@/components/shared/nav/SidebarNav';
import { dashboardConfig } from '@/constant/dashboard';
import { useExampleQuery } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  if (!sessionData) {
    return redirect('/sign-in');
  }
  if (sessionData && !sessionData.user.profileVerified) {
    return redirect('/profile');
  }

  const { data: res, isLoading, error } = useExampleQuery(sessionData?.user.id as string);

  useEffect(() => {
    if (error || !res || !res.profile) {
      return;
    }
    if (res)
      setProfile(res.profile);
      setTimeout(() => {
        setLoading(false);
      }, 1500);
  }, [isLoading, res]);
  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className='flex flex-col'>
          <header className='sticky top-0 z-40 border-b bg-background'>
            <MainNav items={dashboardConfig.mainNav} session={sessionData?.user} profile={profile} />
            <MobileNav items={dashboardConfig.mainNav} session={sessionData?.user} />
          </header>
          <div className=' flex-1 flex bg-slate-100 min-h-screen'>
            <div className=' w-[290px] hidden lg:flex '>
              <SidebarNav items={dashboardConfig.sidebarNav} profile={profile} />
            </div>
            <main className='py-2 md:py-4 px-1 md:px-10 flex flex-1 flex-col overflow-hidden'>{children}</main>
          </div>
        </div>
      )}
    </>
  );
};

export default layout;
