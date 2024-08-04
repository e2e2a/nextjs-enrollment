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
    <div className=' flex-1 gap-12'>
      <SidebarNav items={dashboardConfig.sidebarNav} />
      <main className='ml-[250px] flex flex-1 flex-col overflow-hidden'>{children}</main>
    </div>
  );
};

export default layout;
