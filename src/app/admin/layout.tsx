'use client';
import { SiteFooter } from '@/components/shared/SiteFooter';
import { dashboardConfig } from '@/constant/dashboard';
import { ReactNode } from 'react';
import { MainNav } from '@/components/shared/nav/MainNav';
import { SidebarNav } from '@/components/shared/nav/SidebarNav';
import { useSession } from 'next-auth/react';
import SignInPage from '../(auth)/sign-in/page';

const AdminRootLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  // const { user } = useSession()
  // console.log('userssss',user)
  return (
    <>
      {session ? (
        <div className='flex flex-col space-y-6'>
          {/* <div className='flex min-h-screen flex-col space-y-6'> */}
          <header className='sticky top-0 z-40 border-b bg-background'>
            <MainNav items={dashboardConfig.mainNav} session={session?.user} />
          </header>
          <div className='flex flex-1 gap-6'>
            {/* <div className='container grid flex-1 gap-12 md:grid-cols-[200px_1fr]'> */}
            <div className='flex-shrink-0 w-[290px] hidden lg:flex '>
              <SidebarNav items={dashboardConfig.sidebarNav} />
            </div>
            <main className='flex flex-1 flex-col overflow-hidden'>{children}</main>
            {/* <main className=' ml-[200px] flex w-full flex-1 flex-col overflow-hidden'>{children}</main> */}
          </div>
          {/* <SiteFooter className='border-t' /> */}
        </div>
      ) : (
        <SignInPage />
      )}
    </>
  );
};

export default AdminRootLayout;
