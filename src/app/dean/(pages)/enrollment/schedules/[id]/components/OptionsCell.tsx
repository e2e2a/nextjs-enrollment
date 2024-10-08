import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { useRemoveStudentScheduleMutation, useUpdateStudentEnrollmentScheduleRequestStatusMutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Image from 'next/image';
// import { DialogStep1Button } from './Dialog';
type IProps = {
  user: any;
};
const OptionsCell = ({ user }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const mutation = useRemoveStudentScheduleMutation();
  const actionFormSubmit = (message: any) => {
    setIsOpen(false);
    setIsPending(true);
    const data = {
      teacherScheduleId: user.teacherScheduleId._id,
      profileId: user.profileId._id,
    };

    mutation.mutate(data, {
      onSuccess: (res: any) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // return (window.location.href = '/');
            makeToastSucess(message);
            return;
          default:
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };
  const approvalMutation = useUpdateStudentEnrollmentScheduleRequestStatusMutation();
  const actionFormSubmitApproval = (type: string, as: string) => {
    setIsOpen(false);
    let data;
    data = {
      category: 'College',
      teacherScheduleId: user.teacherScheduleId._id,
      profileId: user.profileId._id,
      type: type,
      as: as,
    };

    approvalMutation.mutate(data, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res.message);
            return;
          default:
            if (res.error) {
              makeToastError(res.error);
            }
            return;
        }
      },
      onSettled: () => {},
    });
  };
  return (
    <div className=''>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger className='' asChild>
          <div className='flex justify-center items-center w-full'>
            <Button role='combobox' size={'sm'} className={'w-auto focus-visible:ring-0 flex bg-blue-500 px-2 py-0 text-neutral-50 font-medium'}>
              Options
              <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
            </Button>
          </div>
        </PopoverTrigger>
        <PopoverContent align='center' className='w-[215px] bg-neutral-50 px-1 py-0'>
          <Command>
            <CommandList>
              <CommandGroup className=''>
                {/* <Button disabled={isPending} type='button' size={'sm'} className={'w-full group focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-0 gap-x-1 justify-start items-center hover:text-neutral-50 font-medium'}>
                  <Link
                    href={`${isPending ? '' : `/admin/college/rooms/schedules/${user._id}`}`}
                    className={'w-full h-full group/item rounded-md focus-visible:ring-0 flex text-black bg-transparent gap-x-1 justify-start items-center group-hover:hover:text-neutral-50'}
                  >
                    <Icons.eye className='h-4 w-4' />
                    Approved as Dean
                  </Link>
                </Button> */}

                {user.request && user.request !== 'suggested' && (
                  <>
                    <Button
                      disabled={isPending}
                      type='button'
                      onClick={() => {
                        actionFormSubmitApproval('Approved', 'dean');
                      }}
                      size={'sm'}
                      className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-green-500 px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                    >
                      <Icons.check className='h-4 w-4' />
                      Approved as Dean
                    </Button>
                    {/* <Button
                      disabled={isPending}
                      type='button'
                      onClick={() => {
                        actionFormSubmitApproval('Approved', 'registrar');
                      }}
                      size={'sm'}
                      className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-green-500 px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                    >
                      <Icons.check className='h-4 w-4' />
                      Approved as Registrar
                    </Button> */}
                    <Button
                      disabled={isPending}
                      type='button'
                      onClick={() => {
                        actionFormSubmitApproval('Declined', 'dean');
                      }}
                      size={'sm'}
                      className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                    >
                      <Icons.close className='h-4 w-4' />
                      Declined as Dean
                    </Button>
                    {/* <Button
                      disabled={isPending}
                      type='button'
                      onClick={() => {
                        actionFormSubmitApproval('Declined', 'registrar');
                      }}
                      size={'sm'}
                      className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                    >
                      <Icons.close className='h-4 w-4' />
                      Declined as Registrar
                    </Button> */}
                  </>
                )}
                {/* {user.request && user.request === 'drop' && (
                  <Button
                    disabled={isPending}
                    type='button'
                    onClick={() => actionFormSubmit('Subject has been removed.')}
                    size={'sm'}
                    className={'w-full focus-visible:ring-0 mb-1 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                  >
                    <Icons.close className='h-4 w-4' />
                    <span className=' text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Remove Subject'}</span>
                  </Button>
                )} */}
                {user.request && user.request === 'suggested' && (
                  <Button
                    disabled={isPending}
                    type='button'
                    onClick={() => actionFormSubmit('Suggested subject has been cancelled.')}
                    size={'sm'}
                    className={'w-full focus-visible:ring-0 mb-1 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                  >
                    <Icons.close className='h-4 w-4' />
                    <span className=' text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Cancel Suggest'}</span>
                  </Button>
                )}
                {(!user?.request || user.request !== 'Suggested') && (
                  <Button
                    disabled={isPending}
                    type='button'
                    onClick={() => actionFormSubmit('Subject has been removed.')}
                    size={'sm'}
                    className={'w-full focus-visible:ring-0 mb-1 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                  >
                    <Icons.trash className='h-4 w-4' />
                    <span className=' text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Remove Subject'}</span>
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

export default OptionsCell;
