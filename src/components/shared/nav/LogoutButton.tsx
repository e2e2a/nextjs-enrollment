'use client';
import React from 'react';
import { Button } from '../../ui/button';
import { Icons } from '../Icons';
import { signOut, useSession } from 'next-auth/react';
import { updateUserLogout } from '@/services/user';

const LogoutButton = () => {
  const { data } = useSession();
  // console.log('mylogoutsession',data?.user.id)
  const handleSubmit = async () => {
    // await updateUserLogout(data?.user.id!);
    await signOut({ callbackUrl: '/sign-in' });
  };
  return (
    <Button type='button' onClick={handleSubmit} className='group select-none border-0 w-full hover:bg-slate-300 hover:bg-opacity-70 px-5 py-6 flex space-x-2 items-center gap-x-1 justify-start pl-3'>
      <Icons.logout className='h-7 w-7 group-hover:stroke-blue-500' />
      <span className='font-semibold text-sm tracking-tight'>Sign out</span>
    </Button>
  );
};

export default LogoutButton;
