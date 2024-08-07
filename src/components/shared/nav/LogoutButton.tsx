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
    <Button type='button' className='group select-none border-0 w-full hover:bg-slate-200 hover:bg-opacity-70 px-5 py-6 flex space-x-2 items-center gap-x-1 justify-start pl-3'>
      <Icons.logout className='h-7 w-7 group-hover:stroke-blue-500' />
      <span className='text-stroke-4 text-md tracking-tight'>Sign out</span>
    </Button>
  );
};

export default LogoutButton;
