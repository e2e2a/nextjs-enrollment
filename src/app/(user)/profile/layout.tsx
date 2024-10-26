'use client';
import { dashboardConfig } from '@/constant/dashboard';
import { ReactNode, useEffect, useState } from 'react';
import { MainNav } from '@/components/shared/nav/MainNav';
import { MobileNav } from '@/components/shared/nav/MobileNav';
import { useSession } from 'next-auth/react';
import Loader from '@/components/shared/Loader';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';

const UserRootLayout = ({ children }: { children: ReactNode }) => {
  const { data } = useSession();
  // const session = await auth();
  const [loading, setLoading] = useState(true);
  const { data: res, isLoading, error } = useProfileQueryBySessionId();

  const profile = res?.profile;
  useEffect(() => {
    if (error || !res || !res.profile) {
      return;
    }
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [isLoading, res, error]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className='flex flex-col'>
          <header className='sticky top-0 z-40 border-b bg-background'>
            {profile.isVerified && (
              <>
                <MainNav items={dashboardConfig.mainNav} session={data?.user} profile={profile} />
                <MobileNav items={dashboardConfig.mainNav} profile={profile} />
              </>
            )}
          </header>
          {/* <header className='relative top-15 z-40 border-b bg-background md:hidden w-auto'>
        <MobileNav items={dashboardConfig.mainNav} session={session?.user} />
      </header> */}
          {children}
        </div>
      )}
    </>
  );
};

export default UserRootLayout;
