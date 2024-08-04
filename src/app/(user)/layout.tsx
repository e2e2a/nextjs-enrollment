import { dashboardConfig } from '@/constant/dashboard';
import { ReactNode } from 'react';
import { MainNav } from '@/components/shared/nav/MainNav';
import { auth } from '@/auth';
import { MobileNav } from '@/components/shared/nav/MobileNav';
const UserRootLayout = async({ children }: { children: ReactNode }) => {
  const session = await auth();
  return (
    <div className='flex flex-col'>
      <header className='sticky top-0 z-40 border-b bg-background'>
        <MainNav items={dashboardConfig.mainNav} session={session?.user} />
        <MobileNav items={dashboardConfig.mainNav} session={session?.user} />
      </header>
      {/* <header className='relative top-15 z-40 border-b bg-background md:hidden w-auto'>
        <MobileNav items={dashboardConfig.mainNav} session={session?.user} />
      </header> */}
      {children}
    </div>
  );
};

export default UserRootLayout;
