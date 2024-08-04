'use client';
import React from 'react';
import { Button } from '../../ui/button';
import { Icons } from '../Icons';
import { cn } from '@/lib/utils';
import { signOut, useSession } from 'next-auth/react';
import { updateUserLogout } from '@/services/user';

const LogoutButton = () => {
  const { data } = useSession();
  // console.log('mylogoutsession',data?.user.id)
  const handleSubmit = async () => {
    await updateUserLogout(data?.user.id!);
    await signOut({ callbackUrl: '/sign-in' });
  };
  return (
    <Button type='button' className='group select-none border-0 w-full hover:bg-slate-300 hover:bg-opacity-70 px-10 py-5 flex items-center gap-x-1 justify-start pl-3' onClick={handleSubmit}>
      <Icons.settings className='h-6 w-6' />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
