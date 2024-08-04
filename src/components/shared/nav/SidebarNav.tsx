'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarNavItem } from '@/types';
import { Icons } from '../Icons';
import LogoutButton from './LogoutButton';
import { Button } from '@/components/ui/button';
import NavbarFooter from './NavbarFooter';
import { UserAvatar } from './UserAvatar/UserAvatar';
import { useSession } from 'next-auth/react';

interface DashboardNavProps {
  items: SidebarNavItem[];
}

export function SidebarNav({ items }: DashboardNavProps) {
  const path = usePathname();
  const { data } = useSession();
  const session = data?.user;
  if (!items?.length) {
    return null;
  }

  return (
    <aside className='px-[5px] min-h-screen fixed top-14 flex-col'>
      <nav className='flex-col w-full flex justify-between items-start p-0'>
          <Link href={'/asdw'} className='flex items-center w-full px-2 py-[8px] mt-2 hover:bg-slate-300 rounded-md'>
            <div className=''>
              <UserAvatar session={{ firstname: session?.firstname, imageUrl: session?.imageUrl, asd: 'asdas1' || null }} className='h-[36px] w-[36px]' />
            </div>
            <div className='flex items-center p-1'>
              <div className='flex flex-col leading-none'>
                <p className={`text-sm font-medium capitalize`}>{session?.firstname && session?.lastname ? `${session?.firstname} ${session.lastname}` : `${session?.username}`}</p>
              </div>
            </div>
          </Link>
        <div className='flex-col w-full flex gap-y-1 items-start p-0'>

          {items.map((item, index) => {
            const Icon = Icons[item.icon || 'arrowRight'];
            return (
              item.href && (
                <Link key={index} href={item.disabled ? '/' : item.href} className='flex w-full select-none'>
                  <Button type='button' className='group select-none border-0 w-full hover:bg-slate-300 hover:bg-opacity-70 px-10 py-6 flex items-center gap-x-1 justify-start pl-3'>
                    <Icon className='h-8 w-8' />
                    <span>{item.title}</span>
                  </Button>
                </Link>
              )
            );
          })}
          <div className='flex w-full select-none'>
            <LogoutButton />
          </div>
        </div>
        <NavbarFooter classname={'py-2 px-1 text-[14px] justify-start w-full'} />
      </nav>
    </aside>
  );
}
