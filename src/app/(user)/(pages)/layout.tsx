import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';
import Nav from './components/Nav';
import { auth } from '@/auth';

const Layout = async ({ children }: { children: ReactNode }) => {
  const sessionData = await auth();

  if (!sessionData) {
    return redirect('/sign-in');
  }
  if (sessionData && sessionData.user.role === 'ADMIN') {
    return redirect('/admin');
  }
  if (sessionData && sessionData.user.role === 'TEACHER') {
    return redirect('/instructor');
  }
  if (sessionData && sessionData.user.role === 'DEAN') {
    return redirect('/dean');
  }
  // if (sessionData && sessionData.user.role === 'DEAN') {
  //   return redirect('/instructor');
  // }
  // if (sessionData && !res?.profile.isVerified) {
  //   return redirect('/profile');
  // }

  return <Nav session={sessionData}>{children}</Nav>;
};

export default Layout;