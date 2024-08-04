'use client';
import Link from 'next/link';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icons } from '../../Icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import DropdownContent from './dropdownContent/DropdownContent';
import { useEffect, useRef, useState } from 'react';
const notifications = [
  {
    title: 'Your call has been confirmed.',
    type: 'fresh',
    description: '1 hour ago',
  },
  {
    title: 'Your call has been confirmed.',
    type: 'fresh',
    description: '1 hour ago',
  },
  {
    title: 'Your call has been confirmed.',
    type: 'old',
    description: '1 hour ago',
  },
];
export function NotificationDropdown({ session }: any) {
  const isLoading = !session?.imageUrl;
  const [fresh, setFresh] = useState(0);
  useEffect(() => {
    const freshCount = notifications.filter((notification) => notification.type === 'fresh').length;
    setFresh(freshCount);
  }, [fresh]);

  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className='select-none outline-none transition-transform duration-0 active:opacity-85 rounded-full bg-slate-200 p-[6.5px]'>
            <TooltipTrigger asChild>
              <div className='active:scale-[98.5%] relative  rounded-full transition-transform duration-0 active:opacity-95 '>
                <Icons.bell className='h-7 w-7 fill-white animate-wiggle duration-400 transition-transform' />
                {fresh > 0 && <div className='absolute px-1 top-[-8px] right-[-4px] bg-red border-white border-opacity-40 border rounded-full text-[9px] font-bold'>{fresh}</div>}
              </div>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='center' className='bg-white px-0 z-20 mr-5'>
            {/* <UserAvatarTabs /> */}
            <DropdownContent notifications={notifications} />
          </DropdownMenuContent>
        </DropdownMenu>
        {/* <audio id='audio_tag' ref={audioRef} src={'/ring2.mp3'} /> */}
        <TooltipContent className='bg-white py-1 px-2 mt-2'>
          <p className='text-sm'>Notification</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
