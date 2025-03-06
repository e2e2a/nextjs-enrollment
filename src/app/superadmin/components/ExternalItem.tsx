'use client';
import React, { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { Icons } from '@/components/shared/Icons';
import Link from 'next/link';
import { SidebarNavItemAdmin } from '@/types';
type IProps = {
  Icon: any;
  item: SidebarNavItemAdmin;
};
const ExternalItem = ({ Icon, item }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className='w-full'>
      <CollapsibleTrigger asChild>
        <div className='flex w-full select-none'>
          <Button
            type='button'
            className={`group ${isOpen ? 'rounded-none rounded-tl-lg rounded-tr-lg' : ''} select-none border-0 w-full hover:bg-slate-300 hover:bg-opacity-70 ${
              isOpen && 'bg-slate-300 bg-opacity-70'
            } px-5 py-6 pr-2 flex space-x-3 items-center gap-x-1 pl-3 justify-start`}
          >
            <Icon className={`h-7 w-7 group-hover:stroke-blue-500 ${isOpen && 'stroke-blue-500'}`} />
            <div className='flex items-center w-full justify-between'>
              <span className='font-medium stroke-black text-sm tracking-tight '>{item.title}</span>
              <ChevronsUpDown className='h-4 w-4' />
            </div>
          </Button>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className=''>
        <div className='flex flex-col  border border-gray-300 mb-2 px-1.5 py-1'>
          {item.i &&
            item.i.map((i, e) => {
              const Icon = Icons[i.icon || 'arrowRight'];
              return i.href ? (
                <Link key={e} href={`${i.href}`} className='flex w-full select-none'>
                  {/* <Link key={e} href={''} className='flex w-full select-none'> */}
                  <Button type='button' className='group select-none border-0 w-full hover:bg-slate-300 hover:bg-opacity-70 px-5 py-6 flex space-x-2 items-center gap-x-1 justify-start pl-3'>
                    <div className='flex flex-row items-center space-x-2'>
                      <Icon className='h-7 w-7 flex-none group-hover:stroke-blue-500' />
                      <span className='font-medium stroke-black text-sm tracking-tight text-left text-wrap'>{i.title}</span>
                    </div>
                  </Button>
                </Link>
              ) : (
                <div className='' key={e}>
                  <ExternalItem item={i} Icon={Icon} />
                </div>
              );
            })}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ExternalItem;
