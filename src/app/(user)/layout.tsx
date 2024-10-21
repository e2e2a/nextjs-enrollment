'use client';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

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
