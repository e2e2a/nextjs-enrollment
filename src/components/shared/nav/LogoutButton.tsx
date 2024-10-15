'use client';
import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Icons } from '../Icons';
import { signOut, useSession } from 'next-auth/react';
import { useLoading } from './logout/LoadingContext';
import { useSignOutMutation } from '@/lib/queries';
import { makeToastError } from '@/lib/toast/makeToast';

const LogoutButton = () => {
  const { data } = useSession();
  const { setLoading } = useLoading();
  const mutation = useSignOutMutation();
  const handleClick = () => {
    setLoading(true);
    const dataa = {
      userId: data?.user.id,
    };
    mutation.mutate(dataa, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setTimeout(() => {
              signOut({ callbackUrl: process.env.NEXT_PUBLIC_APP_URL, redirect: true });
            }, 100);
            // setIsOpen(false);
            return;
          default:
            setLoading(false);
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {},
    });
    // setLoading(false);
  };
  return (
    <Button type='button' onClick={handleClick} className='group select-none border-0 w-full hover:bg-slate-300 hover:bg-opacity-70 px-5 py-6 flex space-x-2 items-center gap-x-1 justify-start pl-3'>
      <Icons.logout className='h-7 w-7 group-hover:stroke-blue-500' />
      <span className='font-medium text-sm tracking-tight'>Sign out</span>
    </Button>
  );
};

export default LogoutButton;
