import React from 'react';
import { Button } from '../ui/button';
import { Icons } from './Icons';
import { cn } from '@/lib/utils';
import { signOut } from 'next-auth/react';

const LogoutButton = () => {
  return (
    <Button
      onClick={() =>signOut({callbackUrl: '/sign-in'})}
      className={cn(
        'group rounded-md items-start justify-start px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground',
        'transparent'
      )}
    >
      <Icons.settings className='mr-2 h-4 w-4' />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
