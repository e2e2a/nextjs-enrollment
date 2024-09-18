'use client';
import Loader from '@/components/shared/Loader';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import React, { ReactNode, useEffect, useState } from 'react';
import Nav from './(pages)/components/Nav';

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: sessionData } = useSession();
  const [loading, setLoading] = useState(true);
  if (!sessionData) {
    return redirect('/sign-in');
  }
  if (sessionData.user.role !== 'TEACHER') {
    return redirect('/sign-in');
  }

  if (!sessionData) {
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
