'use client';
import { Button } from '@/components/ui/button';
import { signIn } from 'next-auth/react';
import React from 'react';
import { FcGoogle } from 'react-icons/fc';

interface IProps {
  isPending: boolean;
  setIsPending: React.Dispatch<React.SetStateAction<boolean>>;
}
const SocialFooter = ({ isPending, setIsPending }: IProps) => {
  return (
    <div className='flex items-center w-full'>
      <Button
        size='lg'
        className='w-full flex gap-4'
        variant='outline'
        onClick={() => {
          setIsPending(true);
          signIn('google');
        }}
        disabled={isPending}
        type='submit'
      >
        Continue with Google <FcGoogle className='h-7 w-7' />
      </Button>
    </div>
  );
};

export default SocialFooter;
