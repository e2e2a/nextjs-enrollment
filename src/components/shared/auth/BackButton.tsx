import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React from 'react';
interface BackButtonProps {
  label: string;
  href?: string;
  onResendCode?: () => void;
}
const BackButton = ({ label, href, onResendCode }: BackButtonProps) => {
  return (
    <Button
      variant='link'
      className='font-normal w-full text-indigo-500 text-center'
      size='sm'
      onClick={onResendCode}
      asChild
    >
      {href ? <Link href={href}>{label}</Link> :<p className='cursor-pointer'>{label}</p>}
    </Button>
  );
};

export default BackButton;
