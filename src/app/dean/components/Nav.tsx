'use client';
import React, { ReactNode, useEffect, useState } from 'react';
import { dashboardConfig } from '@/constant/dashboard';
import { useSession } from 'next-auth/react';
import { useDeanProfileQuery, useProfileQuery } from '@/lib/queries';
import Loader from '@/components/shared/Loader';
import { SidebarNav } from './SidebarNav';
import { MainNav } from '@/components/shared/nav/MainNav';
import { MobileNav } from '@/components/shared/nav/MobileNav';
import { useRouter } from 'next/navigation';
const Nav = ({ children }: { children: ReactNode }) => {
  const { data: sessionData } = useSession();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: res, isLoading, error } = useDeanProfileQuery(sessionData?.user.id as string);
  useEffect(() => {
    if (error || !res) {
      return;
    }
    if (res) {
      if (res.profile) {
        if (!res.profile.isVerified) return router.push('/dean/profile');
        setProfile(res.profile);
        setLoading(false);
        return;
      }
    }
  }, [isLoading, res, error, router]);

  return (
    <>
      {loading && <Loader />}
      {!loading && (
        <div className='flex flex-col '>
          <header className='sticky top-0 z-40 border-b bg-background'>
            <MainNav items={dashboardConfig.mainNavDean} session={sessionData?.user} profile={profile} />
            <MobileNav items={dashboardConfig.mainNavDean} profile={profile} />
          </header>
          {/* <div className={` flex-1 flex flex-row bg-slate-100 ${loading ? '' : ''} `}> */}
          <div className='flex-1 flex flex-row bg-slate-100 '>
            <div className=' w-[290px] xl:w-[330px] hidden lg:flex'>
              <SidebarNav items={dashboardConfig.sidebarDean} profile={profile} />
            </div>
            <main className='py-2 w-full md:py-4 px-1 md:px-5 xl:px-7 flex flex-1 flex-col overflow-hidden'>
              <div className='overflow-y-auto overflow-x-auto flex-1 w-full'>{children}</div>
            </main>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
