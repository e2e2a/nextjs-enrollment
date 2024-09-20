import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: sessionData } = useSession();

  if (sessionData ) {
    if(!sessionData.user.profileVerified) return redirect('/profile');
    return redirect('/');
  }
  return <div className=' '>{children}</div>;
};

export default Layout;
