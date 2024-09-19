'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Nav from './components/Nav';

const AdminRootLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();

  if (!session) {
    return redirect('/sign-in');
  }

  // if (session.user.role !== 'ADMIN') {
  //   return redirect('/sign-in');
  // }

  if (session && !session.user.profileVerified) {
    return redirect('/profile');
  }

  return (
    <>
      <Nav session={session}>{children}</Nav>
    </>
  );
};

export default AdminRootLayout;
