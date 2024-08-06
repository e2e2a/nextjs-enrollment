'use client';
import { SidebarNav } from '@/components/shared/nav/SidebarNav';
import { dashboardConfig } from '@/constant/dashboard';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return redirect('/sign-in');
  }
  if (sessionData && !sessionData.user.profileVerified) {
    return redirect('/profile');
  }

  return (
    <div className='gap-6 flex-1 flex bg-slate-100 min-h-[100vh]'>
      <div className='flex-shrink-0 w-[290px] hidden lg:flex '>
        <SidebarNav items={dashboardConfig.sidebarNav} />
      </div>
      <main className='flex flex-1 flex-col overflow-hidden'>{children}</main>
    </div>
  );
};

export default layout;
