import { redirect } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';
import Nav from './components/Nav';
import { auth } from '@/auth';

const Layout = async ({ children }: { children: ReactNode }) => {
  
  const sessionData = await auth();
  if (!sessionData) {
    return redirect('/sign-in');
  }
  if (sessionData.user.role !== 'TEACHER') {
    return redirect('/sign-in');
  }

  if (sessionData && !sessionData.user.profileVerified) {
    return redirect('/profile');
  }

  return (
    <>
      <Nav>{children}</Nav>
    </>
  );
};

export default Layout;
