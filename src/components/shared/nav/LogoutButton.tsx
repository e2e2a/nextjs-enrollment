
import React from 'react';
import { Button } from '../../ui/button';
import { Icons } from '../Icons';
import { signOut } from 'next-auth/react';
import { updateUserLogout } from '@/services/user';

const LogoutButton = () => {
  return (
    <Button type='button' onClick={() => signOut({callbackUrl: process.env.NEXT_PUBLIC_APP_URL})} className='group select-none border-0 w-full hover:bg-slate-300 hover:bg-opacity-70 px-5 py-6 flex space-x-2 items-center gap-x-1 justify-start pl-3'>
      <Icons.logout className='h-7 w-7 group-hover:stroke-blue-500' />
      <span className='font-semibold text-sm tracking-tight'>Sign out</span>
    </Button>
  );
};

export default LogoutButton;
