import { ReactNode, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Nav from '../components/Nav';

const AdminRootLayout = async ({ children }: { children: ReactNode }) => {
  const sessionData = await auth();

  if (!sessionData) {
    return redirect('/sign-in');
  }

  if (sessionData.user.role !== 'ADMIN') {
    return redirect('/sign-in');
  }

  // if (sessionData && !sessionData.user.profileVerified) {
  //   return redirect('/profile');
  // }

  return (
    <>
      <Nav session={sessionData}>{children}</Nav>
    </>
  );
};

export default AdminRootLayout;
