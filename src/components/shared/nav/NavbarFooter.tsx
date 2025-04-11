import Link from 'next/link';
import React from 'react';
interface IProps {
  classname?: string;
}
const NavbarFooter = ({ classname }: IProps) => {
  return (
    <div className={`${classname} flex flex-wrap items-center text-[13px] text-muted-foreground`}>
      <Link href="/">Privacy</Link>
      <span className=" text-[8px] flex items-center">•</span>
      <Link href="/school">About</Link>
      <span className=" text-[8px] flex items-center">•</span>
      <Link href="https://portfolio-dun-five-49.vercel.app/">Developer</Link>
      <span className="ml-1 flex gap-x-[1px]">
        &#169;<Link href="/">2024</Link>
      </span>
    </div>
  );
};

export default NavbarFooter;
