import React from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Icons } from '@/components/shared/Icons';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { useChangeStatusGradeReportMutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
// import { DialogStep1Button } from './Dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
type IProps = {
  user: any;
};
const ActionsCell = ({ user }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isAlertApprovedOpen, setIsAlertApprovedOpen] = useState<boolean>(false);
  const [isAlertDeclinedOpen, setIsAlertDeclinedOpen] = useState<boolean>(false);
  /**
   * @todo
   */
  const mutation = useChangeStatusGradeReportMutation();
  const handleSubmit = (status: any) => {
    // e.preventDefault();
    setIsPending(true);
    const dataa = {
      // category: 'College',
      reportGradeId: user._id,
      statusInDean: status,
    };
    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            makeToastSucess(res?.message);
            return;
          default:
            if (res.error) {
              makeToastError(res.error);
            }
            return;
        }
      },
      onSettled: () => {
        setIsAlertDeclinedOpen(false);
        setIsAlertApprovedOpen(false);
        setIsPending(false);
      },
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
                <Button disabled={isPending} type='button' size={'sm'} className={'w-full group focus-visible:ring-0 flex mb-2 text-black bg-transparent hover:bg-blue-600 px-2 py-0 gap-x-1 justify-start items-center hover:text-neutral-50 font-medium'}>
                  <Link href={`${isPending ? '' : `/dean/report/grade/${user._id}`}`} className={'w-full h-full group/item rounded-md focus-visible:ring-0 flex text-black bg-transparent gap-x-1 justify-start items-center group-hover:hover:text-neutral-50'}>
                    <Icons.eye className='h-4 w-4' />
                    View Grade Report
                  </Link>
                </Button>
                <AlertDialog open={isAlertApprovedOpen} onOpenChange={setIsAlertApprovedOpen}>
                  <AlertDialogTrigger asChild>
                    <div className='flex justify-end w-full'>
                      <Button type='button' disabled={isPending} size={'sm'} className='w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-green-500 px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'>
                        <Icons.check className='h-4 w-4' />
                        <span className=' text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Approved Report'}</span>
                      </Button>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='bg-white text-black'>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Approved Report Grade</AlertDialogTitle>
                      <AlertDialogDescription className=' py-5'>&nbsp;&nbsp;&nbsp;&nbsp;Are you sure you want to approve this report?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction type='button' className='hidden'>
                        abzxc
                      </AlertDialogAction>
                      <Button disabled={isPending} onClick={() => handleSubmit('Approved')} className='bg-dark-4 text-white'>
                        <span className=' text-white text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog open={isAlertDeclinedOpen} onOpenChange={setIsAlertDeclinedOpen}>
                  <AlertDialogTrigger asChild>
                    <div className='flex justify-end w-full'>
                      <Button type='button' disabled={isPending} size={'sm'} className='w-full focus-visible:ring-0 mb-2 text-black bg-transparent flex justify-start hover:bg-red px-2 py-0 gap-x-1 hover:text-neutral-50 font-medium'>
                        <Icons.close className='h-4 w-4' />
                        <span className=' text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Declined Report'}</span>
                      </Button>
                    </div>
                  </AlertDialogTrigger>
                  <AlertDialogContent className='bg-white text-black'>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Declined Report Grade</AlertDialogTitle>
                      <AlertDialogDescription className=' py-5'>&nbsp;&nbsp;&nbsp;&nbsp;Are you sure you want to decline this report?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction type='button' className='hidden'>
                        abzxc
                      </AlertDialogAction>
                      <Button disabled={isPending} onClick={() => handleSubmit('Declined')} className='bg-dark-4 text-white'>
                        <span className=' text-white text-[15px] font-medium'>{isPending ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* <DataTableDrawer user={user} />*/}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ActionsCell;
