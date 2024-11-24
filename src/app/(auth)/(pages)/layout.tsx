import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  const sessionData = await auth();
  if (sessionData) {
    if (sessionData.user?.role === 'ADMIN') {
      return redirect('/admin');
    } else if (sessionData.user.role === 'STUDENT') {
      return redirect('/');
    } else if (sessionData.user.role === 'TEACHER') {
      return redirect('/instructor');
    } else if (sessionData.user.role === 'DEAN') {
      return redirect('/dean');
    } else if (sessionData.user.role === 'ACCOUNTING') {
      return redirect('/accounting');
    }
    // return redirect('/');
    return;
  }
  return <div className=' '>{children}</div>;
};

export default Layout;
