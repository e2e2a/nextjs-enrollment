"use client"
import { ReactNode } from 'react';

const UserRootLayout = ({ children }: { children: ReactNode }) => {
  // this layout will be a useless
  return (
    <div className=''>
      {children}
    </div>
  );
};

export default UserRootLayout;
