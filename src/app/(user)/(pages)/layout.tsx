'use client'
import { SidebarNav } from '@/components/shared/nav/SidebarNav';
import { dashboardConfig } from '@/constant/dashboard';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  const {data:sessionData} =  useSession();

  if (!sessionData) {
    return redirect('/sign-in');
  }
  if (sessionData && !sessionData.user.profileVerified) {
    return redirect('/profile');
  }

  return (
      <div className=' flex-1 gap-12'>
        <aside className='hidden px-[2%] min-h-screen fixed top-16 w-[250px] flex-col md:flex border'>
          <SidebarNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className='ml-[250px] flex flex-1 flex-col overflow-hidden'>
          {children}
        </main>
      </div>
  );
};

export default layout;
