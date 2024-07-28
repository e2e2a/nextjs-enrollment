'use client';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loader from './Loader';
import { useExampleQuery } from '@/lib/queries';
import { getStudentProfileByUserId } from '@/services/studentProfile';

const ProtectedLayout = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const checkProfile = useCallback(async (userId: any) => {
    const profile = await getStudentProfileByUserId(userId);
    if (!profile) return null;
    return profile;
  }, []);

  useEffect(() => {
    if (session) {
      checkProfile(session.user.id).then((profile) => {
        console.log('profile', profile);
        if (profile && !profile.isVerified) {
          router.push('/profile');}
      });
    } else {
      setIsLoading(false);
    }
  }, [session, router]);

  if (isLoading) {
    return <Loader />;
  }

  //   if (session && !session.user.profileVerified) {
  //     return null; // Optionally render a loading spinner or a message
  //   }

  return <div className=''>{children}</div>;
};

export default ProtectedLayout;
