'use client';
import { SiteFooter } from '@/components/shared/SiteFooter';
import { dashboardConfig } from '@/constant/dashboard';
import { ReactNode, useEffect, useState } from 'react';
import { MainNav } from '@/components/shared/nav/MainNav';
import { useSession } from 'next-auth/react';
import SignInPage from '../(auth)/sign-in/page';
import { redirect, usePathname } from 'next/navigation';
import { useProfileQuery } from '@/lib/queries';
import { MobileNav } from '@/components/shared/nav/MobileNav';
import { SidebarNav } from './components/SidebarNav';

const AdminRootLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  const { data: res, isLoading, error } = useProfileQuery(session?.user.id as string);
  const path = usePathname();
  const [hideSidebar, setHideSidebar] = useState(false);
  useEffect(() => {
    // const regex = /^\/admin\/college\/curriculums\/[a-zA-Z0-9]{24}$/;
    const regex = /^\/admin\/college\/curriculums\/[a-zA-Z0-9]+$/;
    const studentRegex = /^\/admin\/college\/curriculums\/students\/[a-zA-Z0-9]+$/;
    if (regex.test(path)) {
      // Path matches: proceed as needed
      setHideSidebar(true);
      return;
    } else {
      setHideSidebar(false);
      // Handle cases where the path doesn't match the desired pattern
    }
    if (studentRegex.test(path)) {
      // Path matches: proceed as needed
      setHideSidebar(true);
      return;
    } else {
      setHideSidebar(false);
      // Handle cases where the path doesn't match the desired pattern
    }
  }, [path]);
  useEffect(() => {
    if (error || !res || !res.profile) {
      return;
    }
    if (res) setProfile(res.profile);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [isLoading, res, error]);
  if (!session) {
    return redirect('/sign-in');
  }
  if (session && !session.user.profileVerified) {
    return redirect('/profile');
  }

  return (
    <>
      {session ? (
        <div className='flex flex-col'>
          {/* <div className='flex min-h-screen flex-col space-y-6'> */}
          <header className='sticky top-0 z-40 border-b bg-background'>
            <MainNav items={dashboardConfig.mainNav} session={session?.user} profile={profile} />
            <MobileNav items={dashboardConfig.mainNav} session={session?.user} />
          </header>
          <div className='flex-1 flex flex-row bg-slate-100 '>
            <div className={`${hideSidebar ? 'hidden' : 'lg:flex'} w-[290px] xl:w-[330px] hidden  `}>
              <SidebarNav items={dashboardConfig.sidebarAdmin} profile={profile} />
            </div>
            <main className='py-2 w-full md:py-4 px-1 md:px-5 xl:px-7 flex flex-1 flex-col overflow-hidden'>
              <div className='overflow-y-auto overflow-x-auto flex-1 w-full'>{children}</div>
            </main>
          </div>
        </div>
      ) : (
        <SignInPage />
      )}
    </>
  );
};

export default AdminRootLayout;
