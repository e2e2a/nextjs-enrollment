import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';
import { auth } from '@/auth';

const Layout = async ({ children }: { children: ReactNode }) => {
  const sessionData = await auth();

  if (!sessionData) {
    return redirect('/sign-in');
  }

  return <div>{children}</div>;
};

export default Layout;
