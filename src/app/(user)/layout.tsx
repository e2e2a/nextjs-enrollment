"use client"
import { dashboardConfig } from '@/constant/dashboard';
import { ReactNode, useEffect, useState } from 'react';
import { MainNav } from '@/components/shared/nav/MainNav';
import { auth } from '@/auth';
import { MobileNav } from '@/components/shared/nav/MobileNav';
import { useExampleQuery } from '@/lib/queries';
import { useSession } from 'next-auth/react';

const UserRootLayout = ({ children }: { children: ReactNode }) => {
  // this layout will be a useless
  return (
    <div className=''>
      {/* <header className='sticky top-0 z-40 border-b bg-background'>
        <MainNav items={dashboardConfig.mainNav} session={profile?.user} />
        <MobileNav items={dashboardConfig.mainNav} session={profile?.user} />
      </header> */}
      {/* <header className='relative top-15 z-40 border-b bg-background md:hidden w-auto'>
        <MobileNav items={dashboardConfig.mainNav} session={session?.user} />
      </header> */}
      {children}
    </div>
  );
};

export default UserRootLayout;
