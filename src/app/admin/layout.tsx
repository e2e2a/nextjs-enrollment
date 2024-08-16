'use client';
import { SiteFooter } from '@/components/shared/SiteFooter';
import { dashboardConfig } from '@/constant/dashboard';
import { ReactNode, useEffect, useState } from 'react';
import { MainNav } from '@/components/shared/nav/MainNav';
import { useSession } from 'next-auth/react';
import SignInPage from '../(auth)/sign-in/page';
import { redirect } from 'next/navigation';
import { useProfileQuery } from '@/lib/queries';
import { MobileNav } from '@/components/shared/nav/MobileNav';
import { SidebarNav } from './components/SidebarNav';

const AdminRootLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  if (!session) {
    return redirect('/sign-in');
  }
  if (session && !session.user.profileVerified) {
    return redirect('/profile');
  }

  const { data: res, isLoading, error } = useProfileQuery(session?.user.id as string);

  useEffect(() => {
    if (error || !res || !res.profile) {
      return;
    }
    if (res)
      setProfile(res.profile);
      setTimeout(() => {
        setLoading(false);
      }, 500);
  }, [isLoading, res]);
  return (
    <>
      {session ? (
        <div className='flex flex-col'>
          {/* <div className='flex min-h-screen flex-col space-y-6'> */}
          <header className='sticky top-0 z-40 border-b bg-background'>
            <MainNav items={dashboardConfig.mainNav} session={session?.user} profile={profile} />
            <MobileNav items={dashboardConfig.mainNav} session={session?.user} />
          </header>
          <div className='flex-1 flex bg-slate-100 min-h-screen'>
            <div className=' w-[290px] xl:w-[330px] hidden lg:flex '>
              <SidebarNav items={dashboardConfig.sidebarAdmin} profile={profile} />
            </div>
            <main className='flex flex-1 flex-col'>{children}</main>
          </div>
        </div>
      ) : (
        <SignInPage />
      )}
    </>
  );
};

export default AdminRootLayout;
