'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loader from './Loader';

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') {
      // Session is being fetched, show the loader
      setIsLoading(true);
    } else if (session && !session.user.profileVerified) {
      // User is not verified, redirect to profile page
      router.push('/profile');
    } else {
      // User is verified or session is not available, stop loading
      setIsLoading(false);
    }
  }, [session, status, router]);

  if (isLoading) {
    return <Loader />;
  }

  //   if (session && !session.user.profileVerified) {
  //     return null; // Optionally render a loading spinner or a message
  //   }

  return <div className=''>{children}</div>;
};

export default ProtectedLayout;
