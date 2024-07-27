

"use client"
import { SiteFooter } from '@/components/shared/SiteFooter';
import { dashboardConfig } from '@/constant/dashboard';
import { ReactNode } from 'react';
import { MainNav } from '@/components/shared/nav/MainNav';
import { SidebarNav } from '@/components/shared/nav/SidebarNav';
import { useSession } from 'next-auth/react';

const UserRootLayout = ({ children }: { children: ReactNode }) => {
  const {data: session} = useSession()

//   if(session && !session.user.profileVerified ) {
//     return window.location.href = "/profile"
//   }
  // const { user } = useSession()
  // console.log('userssss',user)
  return (
    // <div className='flex flex-col space-y-6'>
    <div className='flex flex-col'>
      <header className='sticky top-0 z-40 border-b bg-background'>
          <MainNav items={dashboardConfig.mainNav} session={session?.user}/>
      </header>
      {children}
    </div>
  );
};

export default UserRootLayout;
