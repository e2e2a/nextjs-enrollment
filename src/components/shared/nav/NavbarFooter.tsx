import Link from 'next/link';
import React from 'react';

const NavbarFooter = () => {
  return (
    <div className='py-2 px-3 flex flex-wrap items-center w-[300px] sm:w-[330px] text-[15px] text-muted-foreground'>
      <Link href='/about'>Privacy</Link>
      <span className=' text-[8px] flex items-center'>•</span>
      <Link href='/about'>Cookies</Link>
      <span className=' text-[8px] flex items-center'>•</span>
      <Link href='/about'>About</Link>
      <span className=' text-[8px] flex items-center'>•</span>
      <Link href='/about'>Developers</Link>
      <span className='text-sm ml-1'>&#169;</span>
      <Link href='/about'>2024</Link>
    </div>
  );
};

export default NavbarFooter;
