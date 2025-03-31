import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

const AdminRootLayout = async ({ children }: { children: ReactNode }) => {
  const sessionData = await auth();

  if (!sessionData) {
    return redirect('/sign-in');
  }

  if (sessionData?.user?.role !== 'SUPER ADMIN') {
    return redirect('/sign-in');
  }

  // if (sessionData && !sessionData.user?.profileVerified) {
  //   return redirect('/profile');
  // }

  return <div>{children}</div>;
};

export default AdminRootLayout;
