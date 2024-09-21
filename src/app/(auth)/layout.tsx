import { auth } from '@/auth';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  // const { data: sessionData } = useSession();
  const sessionData = await auth();
  if (sessionData) {
    if (sessionData.user.role === 'ADMIN') {
      window.location.href = '/admin';
    } else if (sessionData.user.role === 'STUDENT') {
      window.location.href = '/';
    } else if (sessionData.user.role === 'TEACHER') {
      window.location.href = '/instructor';
    }
    // return redirect('/');
    return;
  }
  return <div className=' '>{children}</div>;
};

export default Layout;
