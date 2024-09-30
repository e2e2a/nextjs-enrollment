'use client';
import React from 'react';
import { dashboardConfig } from '@/constant/dashboard';
import { ReactNode, useEffect, useState } from 'react';
import { MainNav } from '@/components/shared/nav/MainNav';
import { MobileNav } from '@/components/shared/nav/MobileNav';
import { SidebarNav } from '@/components/shared/nav/SidebarNav';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQuery } from '@/lib/queries';
import { useRouter } from 'next/navigation';
interface IProps {
  session: any;
  children: ReactNode;
}
const Nav = ({ session, children }: IProps) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const router = useRouter();
  const { data: res, isLoading, error } = useProfileQuery(session?.user.id as string);

  useEffect(() => {
    if (error || !res || !res.profile) {
      return;
    }
    if (res) {
      if (res.profile) {
        if (!res.profile.isVerified) return router.push('/profile');
        return setIsPageLoading(false);
      }
    }
  }, [isLoading, res, error, router]);
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='flex flex-col '>
          <header className='sticky top-0 z-40 border-b bg-background'>
            <MainNav items={dashboardConfig.mainNav} session={session?.user} profile={res?.profile} />
            <MobileNav items={dashboardConfig.mainNav} profile={res?.profile} />
          </header>
          <div className='flex-1 flex flex-row bg-slate-100 '>
            <div className=' w-[290px] xl:w-[330px] hidden lg:flex'>
              <SidebarNav items={dashboardConfig.sidebarNav} profile={res?.profile} />
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
