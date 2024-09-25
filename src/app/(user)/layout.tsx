'use client';
import Loader from '@/components/shared/Loader';
import { MainNav } from '@/components/shared/nav/MainNav';
import { MobileNav } from '@/components/shared/nav/MobileNav';
import { SidebarNav } from '@/components/shared/nav/SidebarNav';
import { dashboardConfig } from '@/constant/dashboard';
import { useProfileQuery } from '@/lib/queries';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return redirect('/sign-in');
  }
//   if (sessionData && !sessionData.user.profileVerified) {
//     return redirect('/profile');
//   }

  return <div>{children}</div>;
};

export default Layout;
