"use client"
import { Button } from '@/components/ui/button';
import { DEFAULT_LOGIN_REDIRECT } from '@/routes';
import { signIn, useSession } from 'next-auth/react';
import React from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';

const SocialFooter = () => {
  // const onClick = async (provider: 'google') => {
  //   await signIn(provider)
  // };
  const { data: session } = useSession();
  return (
    <div className='flex items-center w-full'>
      <Button
        size='lg'
        className='w-full flex gap-4'
        variant='outline'
        onClick={() => signIn("google")}
        type='submit'
      >
        Continue with Google <FcGoogle className='h-7 w-7' />
      </Button>
    </div>
  );
};

export default SocialFooter;
