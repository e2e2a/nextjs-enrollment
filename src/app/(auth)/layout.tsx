import { auth } from '@/auth';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const Layout = async ({ children }: { children: ReactNode }) => {
  // const { data: sessionData } = useSession();
  const sessionData = await auth();
  if (sessionData) {
    if (!sessionData.user.profileVerified) return redirect('/profile');
    return redirect('/');
  }
  return <div className=' '>{children}</div>;
};

export default Layout;
