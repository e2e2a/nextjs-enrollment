'use client';
import React from 'react';
import { SiteFooter } from '@/components/shared/SiteFooter';
import { dashboardConfig } from '@/constant/dashboard';
import { ReactNode, useEffect, useState } from 'react';
import { MainNav } from '@/components/shared/nav/MainNav';
import {  } from 'next-auth/react';
import { redirect, usePathname } from 'next/navigation';
import { MobileNav } from '@/components/shared/nav/MobileNav';
import { SidebarNav } from './SidebarNav';
import LoaderPage from '@/components/shared/LoaderPage';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
interface IProps {
  session: any;
  children: ReactNode;
}
const Nav = ({ session, children }: IProps) => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [profile, setProfile] = useState({});
  /**
   * @todo change profile query by user roles
   */
  const { data: res, isLoading, error } = useProfileQueryBySessionId();
  const path = usePathname();
  const [hideSidebar, setHideSidebar] = useState(false);
  // useEffect(() => {
  //   // const regex = /^\/admin\/college\/curriculums\/[a-zA-Z0-9]{24}$/;
  //   const regex = /^\/admin\/college\/curriculums\/[a-zA-Z0-9]+$/;
  //   const studentRegex = /^\/admin\/college\/curriculums\/students\/[a-zA-Z0-9]+$/;
  //   if (regex.test(path)) {
  //     // Path matches: proceed as needed
  //     setHideSidebar(true);
  //     return;
  //   } else {
  //     setHideSidebar(false);
  //   }
  //   if (studentRegex.test(path)) {
  //     setHideSidebar(true);
  //     return;
  //   } else {
  //     setHideSidebar(false);
  //   }
  // }, [path]);
  useEffect(() => {
    if (error || !res) {
      return;
    }
    if (res) {
      if (res.profile) {
        setProfile(res.profile);
        setIsPageLoading(false);
      }
    }

  }, [isLoading, res, error]);
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='flex flex-col'>
          <header className='sticky top-0 z-40 border-b bg-background'>
            <MainNav items={dashboardConfig.mainNavSuperAdmin} session={session?.user} profile={profile} />
            <MobileNav items={dashboardConfig.mainNavSuperAdmin} profile={profile} />
          </header>
          <div className='flex-1 flex flex-row bg-slate-100 '>
            <div className={`${hideSidebar ? 'hidden' : 'lg:flex'} w-[290px] xl:w-[330px] hidden  `}>
              <SidebarNav items={dashboardConfig.sidebarSuperAdmin} profile={profile} />
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
