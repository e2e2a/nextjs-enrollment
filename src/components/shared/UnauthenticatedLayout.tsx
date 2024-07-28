'use client';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loader from './Loader';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { useExampleQuery } from '@/lib/queries';

const UnauthenticatedLayout = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { data: res, error } = useExampleQuery(session?.user?.id);
  useEffect(() => {
    if (status === 'loading') {
      // Session is being fetched, show the loader
      setIsLoading(true);
    // } else if (session && !session.user.profileVerified) {
    } else if (session ) {
      // User is not verified, redirect to profile page
      // router.push('/profile');
    } else {
      // User is verified or session is not available, stop loading
      setIsLoading(false);
    }
  }, [session, status, router]);
  console.log(session?.user.id)
  if(session?.user.id){

    
    console.log(res)
  }
  if (isLoading) {
    return <Loader />;
  }

  //   if (session && !session.user.profileVerified) {
  //     return null; // Optionally render a loading spinner or a message
  //   }

  return <div className=''>{children}</div>;
};

export default UnauthenticatedLayout;
