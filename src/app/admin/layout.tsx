"use client"
import { SiteFooter } from '@/components/shared/SiteFooter';
import { dashboardConfig } from '@/constant/dashboard';
import { ReactNode } from 'react';
import { MainNav } from '@/components/shared/nav/MainNav';
import { SidebarNav } from '@/components/shared/nav/SidebarNav';

const AdminRootLayout = ({ children }: { children: ReactNode }) => {
  // const {session, user} = useSession()
  // const { user } = useSession()
  // console.log('userssss',user)
  return (
    <div className='flex min-h-screen flex-col space-y-6'>
      <header className='sticky top-0 z-40 border-b bg-background'>
          <MainNav items={dashboardConfig.mainNav} />
      </header>
      <div className='container grid flex-1 gap-12 md:grid-cols-[200px_1fr]'>
        <aside className='hidden w-[200px] flex-col md:flex'>
          <SidebarNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className='flex w-full flex-1 flex-col overflow-hidden'>{children}</main>
      </div>
      <SiteFooter className='border-t' />
    </div>
  );
};

export default AdminRootLayout;
