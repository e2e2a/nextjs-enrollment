import { redirect } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';
import { auth } from '@/auth';
import Nav from '../components/Nav';

const Layout = async ({ children }: { children: ReactNode }) => {
  const sessionData = await auth();

  if (!sessionData || sessionData.user?.role !== 'DEAN') {
    return redirect('/sign-in');
  }

  return (
    <>
      <Nav>{children}</Nav>
    </>
  );
};

export default Layout;
