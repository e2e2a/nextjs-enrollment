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
  profile: any;
}

export function SidebarNav({ items,profile }: DashboardNavProps) {
  const path = usePathname();
  const { data } = useSession();
  const session = data?.user;
  if (!items?.length) {
    return null;
  }

  return (
    <aside className='px-[5px] fixed top-14 left-0 flex-col overflow-auto h-[calc(100vh-3.5rem)] custom-scrollbar'>
      <nav className='flex-col w-full flex justify-between items-start p-0'>
        <div className='flex-col w-full flex gap-y-1 items-start p-0'>
          <Link href={'/profile'} className='flex items-center gap-[2px] w-full px-2 py-[5.5px] mt-4 hover:bg-slate-200 hover:bg-opacity-70 rounded-md'>
            <div className='border shadow-sm drop-shadow-sm border-gray-200 rounded-full'>
              <UserAvatar session={{ firstname: session?.firstname, imageUrl: profile?.imageUrl, asd: 'asdas1' || null }} className='h-[32px] w-[32px]' />
            </div>
            <div className='flex items-center p-2'>
              <div className='flex flex-col leading-none'>
                <p className={`text-stroke-4 text-sm capitalize`}>{session?.firstname && session?.lastname ? `${session?.firstname} ${session.lastname}` : `${session?.username}`}</p>
              </div>
            </div>
          </Link>
          {items.map((item, index) => {
            const Icon = Icons[item.icon || 'arrowRight'];
            return (
              item.href && (
                <Link key={index} href={item.disabled ? '/' : item.href} className='flex w-full select-none'>
                  <Button type='button' className='group select-none border-0 w-full hover:bg-slate-200 hover:bg-opacity-70 px-5 py-6 flex space-x-2 items-center gap-x-1 justify-start pl-3'>
                    <Icon className='h-7 w-7 group-hover:stroke-blue-500' />
                    <span className='text-stroke-4  stroke-black text-sm tracking-tight'>{item.title}</span>
                  </Button>
                </Link>
              )
            );
          })}
          <LogoutButton />
        </div>
        <NavbarFooter classname={'py-2 px-1 text-[14px] justify-start w-full'} />
      </nav>
    </aside>
  );
}
