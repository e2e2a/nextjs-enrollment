"use client"
import { ReactNode } from 'react';

const UserRootLayout = ({ children }: { children: ReactNode }) => {
  // this layout will be a useless
  return (
    <div className=''>
      {/* <header className='sticky top-0 z-40 border-b bg-background'>
        <MainNav items={dashboardConfig.mainNav} session={profile?.user} />
        <MobileNav items={dashboardConfig.mainNav} session={profile?.user} />
      </header> */}
      {/* <header className='relative top-15 z-40 border-b bg-background md:hidden w-auto'>
        <MobileNav items={dashboardConfig.mainNav} session={session?.user} />
      </header> */}
      {children}
    </div>
  );
};

export default UserRootLayout;
