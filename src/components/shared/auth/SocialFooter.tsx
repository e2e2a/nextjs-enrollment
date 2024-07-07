'use client';
import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';

const SocialFooter = () => {
  const onClick = (provider: 'google') => {
    signIn(provider, {
      callbackUrl: DEFAULT_LOGIN_REDIRECT
    })
  };
  return (
    <div className='flex items-center w-full'>
      <Button
        size='lg'
        className='w-full flex gap-4'
        variant='outline'
        onClick={() => onClick('google')}
      >
        Continue with Google <FcGoogle className='h-7 w-7' />
      </Button>
    </div>
  );
};

export default SocialFooter;
