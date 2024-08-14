'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

const AdminRootLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState({});
  if (!session) {
    return redirect('/sign-in');
  }
  if (session && !session.user.profileVerified) {
    return redirect('/profile');
  }

  return <div className='py-2 md:py-4 px-1 md:px-10 flex flex-1 flex-col'>{children}</div>;
};

export default AdminRootLayout;
