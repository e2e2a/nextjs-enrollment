import { ReactNode, useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import Nav from '../components/Nav';

const AdminRootLayout = async ({ children }: { children: ReactNode }) => {
  const sessionData = await auth();

  if (!sessionData || sessionData.user.role !== 'SUPER ADMIN') {
    return redirect('/sign-in');
  }

  return (
    <>
      <Nav session={sessionData}>{children}</Nav>
    </>
  );
};

export default AdminRootLayout;
