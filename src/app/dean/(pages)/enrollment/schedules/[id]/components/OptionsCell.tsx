import React from 'react';
import { Command, CommandGroup, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import { useRemoveStudentScheduleMutation, useUpdateStudentEnrollmentScheduleRequestStatusMutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import Image from 'next/image';
import { useUpdateStudentEnrollmentScheduleMutation } from '@/lib/queries/enrollment/update/id/schedule';
// import { DialogStep1Button } from './Dialog';

type IProps = {
  user: any;
};

const OptionsCell = ({ user }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const mutation = useRemoveStudentScheduleMutation();
  const actionRemove = (message: any) => {
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

  const approvalMutation = useUpdateStudentEnrollmentScheduleMutation();
  const actionFormSubmit = (type: string) => {
    setIsOpen(false);
    let data;
    data = {
      category: 'College',
      enrollmentId: user.profileId._id,
      request: user.request === 'add' ? 'Add' : user.request === 'drop' ? 'Drop' : null,
      teacherScheduleId: user.teacherScheduleId._id,
      type,
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
                {user.request && user.request !== 'suggested' && (
                  <>
                    {/* <Button
                      disabled={isPending}
                      type='button'
                      onClick={() => {
                        actionFormSubmitApproval('Approved', 'Drop');
                      }}
                      size={'sm'}
                      className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-green-500 px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                    >
                      <Icons.check className='h-4 w-4' />
                      Approved as Dean
                    </Button> */}
                    <Button
                      disabled={isPending}
                      type='button'
                      onClick={() => {
                        actionFormSubmit('Approved');
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
                        actionFormSubmitApproval('Declined', 'dean');
                      }}
                      size={'sm'}
                      className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                    >
                      <Icons.close className='h-4 w-4' />
                      Declined as Dean
                    </Button> */}
                    <Button
                      disabled={isPending}
                      type='button'
                      onClick={() => {
                        actionFormSubmit('Declined');
                      }}
                      size={'sm'}
                      className={'w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'}
                    >
                      <Icons.close className='h-4 w-4' />
                      Declined as Dean
                    </Button>
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
                    onClick={() => actionRemove('Suggested subject has been cancelled.')}
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
                    onClick={() => actionRemove('Subject has been removed.')}
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
