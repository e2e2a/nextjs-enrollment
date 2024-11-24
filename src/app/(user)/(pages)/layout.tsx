import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';
import Nav from './components/Nav';
import { auth } from '@/auth';

const Layout = async ({ children }: { children: ReactNode }) => {
  const sessionData = await auth();

  if (!sessionData || sessionData.user.role !== 'STUDENT') {
    return redirect('/sign-in');
  }

  return <Nav session={sessionData}>{children}</Nav>;
};

export default Layout;
