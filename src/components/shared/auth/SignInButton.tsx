'use client';
import { useRouter } from 'next/navigation';
import React, { ReactNode } from 'react';

interface SignInButtonProps {
  children: ReactNode;
  mode?: 'modal' | 'redirect'
  aschild?: boolean;
}

const SignInButton = ({
  children,
  mode = 'redirect',
  aschild,
}: SignInButtonProps) => {
  const router = useRouter()
  const onClick = () => {
    router.push('/sign-in')
  };

  if(mode === 'modal') {
    return (
      <span>hello world</span>
    )
  }
  return <span onClick={onClick} className='cursor-pointer'>{children}</span>;
};

export default SignInButton;
