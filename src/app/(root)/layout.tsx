import Topbar from '@/components/shared/Topbar';
import { ReactNode } from 'react';
import Bottombar from '@/components/shared/Bottombar';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full md:flex min-h-screen'>
      <Topbar />
      <section className='flex flex-1 h-full'>{children}</section>

      <Bottombar />
    </div>
  );
};

export default RootLayout;
