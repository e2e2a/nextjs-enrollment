import { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className='w-full md:flex min-h-screen'>
      {/* <Topbar /> */}
      <section className='flex flex-1 h-full'>{children}</section>

    </div>
  );
};

export default RootLayout;
