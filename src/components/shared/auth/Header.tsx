import { cn, fontPoppins } from '@/lib/utils';
import React from 'react';

interface HeaderProps {
  label: string;
  header: string;
}

const Header = ({ label, header }: HeaderProps) => {
  return (
    <div className='w-full flex flex-col gap-y-4 items-center justify-center'>
      <h1 className={cn('text-3xl font-semibold', fontPoppins.className)}>{header}</h1>
      <p className='text-muted-foreground text-sm'>{label}</p>
    </div>
  );
};

export default Header;
