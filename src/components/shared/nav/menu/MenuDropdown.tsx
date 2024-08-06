'use client';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Icons } from '../../Icons';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import Content from './Content';
import { dashboardConfig } from '@/constant/dashboard';

export function MenuDropdown({ session }: any) {
  const isLoading = !session?.imageUrl;
  return (
    <TooltipProvider delayDuration={10}>
      <Tooltip>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger className='select-none outline-none transition-transform duration-0 active:opacity-85 rounded-full bg-slate-200 p-[6.5px]'>
            <TooltipTrigger asChild >
              <div className='active:scale-[98.5%] relative  rounded-full transition-transform duration-0 active:opacity-95 '>
                <Icons.grip className='h-7 w-7 text-muted-foreground stroke-black' />
              </div>
            </TooltipTrigger>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='center' className='bg-white px-0 lg:z-20 md:z-50 mr-5 lg:hidden flex'>
            <Content items={dashboardConfig.sidebarNav} />
          </DropdownMenuContent>
        </DropdownMenu>

        <TooltipContent className='bg-white py-1 px-2 mt-2'>
          <p className='text-sm'>Menu</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
