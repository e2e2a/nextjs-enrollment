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
import Nav from './components/Nav';

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: sessionData } = useSession();

  if (!sessionData) {
    return redirect('/sign-in');
  }
  // if (sessionData && !res?.profile.isVerified) {
  //   return redirect('/profile');
  // }

  return <Nav session={sessionData}>{children}</Nav>;
};

export default Layout;