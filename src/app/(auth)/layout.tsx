import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  const sessionData = await auth();
  if (sessionData) {
    if (sessionData.user.role === 'ADMIN') {
      redirect('/admin');
      // window.location.href = '/admin';
    } else if (sessionData.user.role === 'STUDENT') {
      redirect('/');
      // window.location.href = '/';
    } else if (sessionData.user.role === 'TEACHER') {
      redirect('/instructor');
      // window.location.href = '/instructor';
    }
    // return redirect('/');
    return;
  }
  return <div className=' '>{children}</div>;
};

export default Layout;
