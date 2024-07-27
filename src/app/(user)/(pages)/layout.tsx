import { SidebarNav } from '@/components/shared/nav/SidebarNav';
import ProtectedLayout from '@/components/shared/ProtectLayout';
import { dashboardConfig } from '@/constant/dashboard';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    // <ProtectedLayout>
      <div className=' flex-1 gap-12'>
        <aside className='hidden px-[2%] min-h-screen fixed top-16 w-[250px] flex-col md:flex border'>
          <SidebarNav items={dashboardConfig.sidebarNav} />
        </aside>
        <main className='ml-[250px] flex flex-1 flex-col overflow-hidden'>
          {children}
          {/* {children} */}
        </main>
      </div>
    // </ProtectedLayout>
  );
};

export default layout;
