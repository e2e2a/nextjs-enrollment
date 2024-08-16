import Link from 'next/link';
import React from 'react';
interface IProps {
  classname?:string
}
const NavbarFooter = ({classname}: IProps) => {
  return (
    <div className={`${classname} flex flex-wrap items-center text-[13px] text-muted-foreground`}>
      <Link href='/about'>Privacy</Link>
      <span className=' text-[8px] flex items-center'>•</span>
      <Link href='/about'>Cookies</Link>
      <span className=' text-[8px] flex items-center'>•</span>
      <Link href='/about'>About</Link>
      <span className=' text-[8px] flex items-center'>•</span>
      <Link href='/about'>Developers</Link>
      <span className='ml-1 flex gap-x-[1px]'>&#169;<Link href='/about'>2024</Link></span>
      
    </div>
  );
};

export default NavbarFooter;
