'use client';
import React, { useEffect } from 'react';
import { Command, CommandGroup, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { useEnrollmentQueryByProfileId } from '@/lib/queries/enrollment/get/profileId';

type IProps = {
  user: any;
};

const ActionsCell = ({ user }: IProps) => {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);

  const hasEnrollment = user && user.enrollStatus !== null && user.enrollStatus !== undefined && user.enrollStatus !== '' && user.enrollStatus !== 'Rejected';
  const { data, isLoading, error } = useEnrollmentQueryByProfileId(user._id, !!hasEnrollment);
  useEffect(() => {
    if (!hasEnrollment) return setIsPageLoading(false);
    if (!data || error) return;
    if (data) {
      if (data.enrollment) {
        setIsPageLoading(false);
      } else {
        setIsPageLoading(false);
      }
    }
  }, [data, error, hasEnrollment, user]);

  return (
    <div className=''>
      <Popover>
        <PopoverTrigger className='' asChild>
          <div className='flex justify-center items-center w-full'>
            <Button role='combobox' size={'sm'} className={'w-auto focus-visible:ring-0 flex bg-blue-500 px-2 py-0 text-neutral-50 font-medium'}>
              Options
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent align='center' className='w-[230px] bg-neutral-50 px-1 py-0'>
          <Command>
            <CommandList>
              <CommandGroup className=''>
                <Button disabled={isPending} size={'sm'} className={'w-full group focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-0 gap-x-1 justify-start items-center hover:text-neutral-50 font-medium'}>
                  <Link
                    href={`${isPending ? '' : `/admin/users/students/${user.userId._id}`}`}
                    className={'w-full h-full group/item rounded-md focus-visible:ring-0 flex text-black bg-transparent gap-x-1 justify-start items-center group-hover:hover:text-neutral-50'}
                  >
                    <Icons.eye className='h-4 w-4' />
                    View Profile
                  </Link>
                </Button>
                {hasEnrollment && data && (
                  <Button disabled={isPending} size={'sm'} className={'w-full group focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-0 gap-x-1 justify-start items-center hover:text-neutral-50 font-medium'}>
                    <Link
                      href={`${isPending ? '' : `/admin/${user.courseId.category.toLowerCase()}/enrollment/schedules/${data?.enrollment?._id}`}`}
                      className={'w-full h-full group/item rounded-md focus-visible:ring-0 flex text-black bg-transparent gap-x-1 justify-start items-center group-hover:hover:text-neutral-50'}
                    >
                      <Icons.eye className='h-4 w-4' />
                      View Enrollment
                    </Link>
                  </Button>
                )}
                {/* <DataTableDrawer user={user} /> */}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActionsCell;
