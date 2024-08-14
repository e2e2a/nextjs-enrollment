'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { SidebarNavItem, SidebarNavItemAdmin } from '@/types';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useState } from 'react';
import { ChevronsUpDown } from 'lucide-react';
import { UserAvatar } from '@/components/shared/nav/UserAvatar/UserAvatar';
import { Icons } from '@/components/shared/Icons';
import LogoutButton from '@/components/shared/nav/LogoutButton';
import NavbarFooter from '@/components/shared/nav/NavbarFooter';

interface DashboardNavProps {
  items: SidebarNavItemAdmin[];
  profile: any;
}

export function SidebarNav({ items, profile }: DashboardNavProps) {
  const path = usePathname();
  const [isOpen, setIsOpen] = useState(false);
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
            return item.href ? (
              <Link key={index} href={item.disabled ? '/' : item.href} className='flex w-full select-none'>
                <Button type='button' className='group select-none border-0 w-full hover:bg-slate-200 hover:bg-opacity-70 px-5 py-6 flex space-x-2 items-center gap-x-1 justify-start pl-3'>
                  <Icon className='h-7 w-7 group-hover:stroke-blue-500' />
                  <span className='text-stroke-4  stroke-black text-sm tracking-tight'>{item.title}</span>
                </Button>
              </Link>
            ) : (
              <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full' key={index}>
                <CollapsibleTrigger asChild>
                  <div className='flex w-full select-none'>
                    <Button type='button' className={`group select-none border-0 w-full hover:bg-slate-200 hover:bg-opacity-70 ${isOpen && 'bg-slate-200 bg-opacity-70'} px-5 py-6 flex space-x-3 items-center gap-x-1 pl-3 justify-start`}>
                      <Icon className={`h-7 w-7 group-hover:stroke-blue-500 ${isOpen && 'stroke-blue-500'}`} />
                      <div className='flex items-center w-full justify-between'>
                        <span className='text-stroke-4  stroke-black text-sm tracking-tight '>{item.title}</span>
                        <ChevronsUpDown className='h-4 w-4' />
                      </div>
                    </Button>
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className=' shadow-sm drop-shadow-sm'>
                  <div className='flex flex-col border pl-3'>
                    {item.i &&
                      item.i.map((i, e) => {
                        const Icon = Icons[i.icon || 'arrowRight'];
                        return (
                          i.title && (
                            <Link key={e} href={`${i.href}`} className='flex w-full select-none'>
                            {/* <Link key={e} href={''} className='flex w-full select-none'> */}
                              <Button type='button' className='group select-none border-0 w-full hover:bg-slate-200 hover:bg-opacity-70 px-5 py-6 flex space-x-2 items-center gap-x-1 justify-start pl-3'>
                                <Icon className='h-6 w-6 group-hover:stroke-blue-500' />
                                <span className='text-stroke-3  stroke-black text-sm tracking-tight'>{i.title}</span>
                              </Button>
                            </Link>
                          )
                        );
                      })}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
          <LogoutButton />
        </div>
        <NavbarFooter classname={'py-2 px-1 text-[14px] justify-start w-full'} />
      </nav>
    </aside>
  );
}
