"use client"
import { SiteFooter } from '@/components/shared/SiteFooter';
import { dashboardConfig } from '@/constant/dashboard';
import { ReactNode } from 'react';
import { MainNav } from '@/components/shared/nav/MainNav';
import { SidebarNav } from '@/components/shared/nav/SidebarNav';
import { useSession } from 'next-auth/react';

const AdminRootLayout = ({ children }: { children: ReactNode }) => {
  const {data: session} = useSession()
  // const { user } = useSession()
  // console.log('userssss',user)
  return (
    <div className='flex flex-col space-y-6'>
    {/* <div className='flex min-h-screen flex-col space-y-6'> */}
      <header className='sticky top-0 z-40 border-b bg-background'>
          <MainNav items={dashboardConfig.mainNav} session={session?.user}/>
      </header>
      <div className=' flex-1 gap-12'>
      {/* <div className='container grid flex-1 gap-12 md:grid-cols-[200px_1fr]'> */}
        <aside className='hidden px-[2%] min-h-screen fixed top-16 w-[250px] flex-col md:flex border'>
          <SidebarNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className='ml-[250px] flex flex-1 flex-col overflow-hidden'>{children}</main>
        {/* <main className=' ml-[200px] flex w-full flex-1 flex-col overflow-hidden'>{children}</main> */}
      </div>
      {/* <SiteFooter className='border-t' /> */}
    </div>
  );
};

export default AdminRootLayout;
