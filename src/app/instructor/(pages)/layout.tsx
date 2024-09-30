import { redirect } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';
import { auth } from '@/auth';
import Nav from '../components/Nav';

const Layout = async ({ children }: { children: ReactNode }) => {
  const sessionData = await auth();

  if (!sessionData) {
    return redirect('/sign-in');
  }
  // if (sessionData && !sessionData.user.profileVerified) {
  //   return redirect('/instructor/profile');
  // }
  if (sessionData.user.role === 'STUDENT') {
    return redirect('/');
  } else if (sessionData.user.role === 'ADMIN') {
    return redirect('/admin');
  }

  return (
    <>
      <Nav>{children}</Nav>
    </>
  );
};

export default Layout;
