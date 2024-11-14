'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useUpdateCourseBlockScheduleMutation } from '@/lib/queries/blocks/update';

interface IProps {
  blockType: any;
  s: any;
}

const AddBlockSched = ({ blockType, s }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<{ teacherScheduleId: string }[]>([]);

  const mutation = useUpdateCourseBlockScheduleMutation();

  const handleSelect = (teacherScheduleId: string) => {
    setSelectedItems((prevSelectedItems) => {
      const itemIndex = prevSelectedItems.findIndex((item) => item.teacherScheduleId === teacherScheduleId);
      if (itemIndex > -1) {
        return prevSelectedItems.filter((item) => item.teacherScheduleId !== teacherScheduleId);
      } else {
        return [...prevSelectedItems, { teacherScheduleId }];
      }
    });
  };

  const actionFormSubmit = () => {
    setIsEnabled(true);
    if (selectedItems.length === 0) {
      makeToastError('Please select at least one schedule to submit.');
      return;
    }

    const data = {
      selectedItems,
      blockTypeId: blockType.blockType._id,
    };

    mutation.mutate(data, {
      onSuccess: (res: any) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsOpen(false);
            setSelectedItems([]);
            makeToastSucess(res.message);
            return;
          default:
            makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsEnabled(false);
      },
    });
  };

  const isSelected = (teacherScheduleId: string) => {
    return selectedItems.some((item) => item.teacherScheduleId === teacherScheduleId);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'} className={'focus-visible:ring-0 flex mb-2 bg-transparent bg-green-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'}>
          <Icons.add className='h-4 w-4' />
          <span className='flex'>Add Schedule</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-6xl w-full bg-white focus-visible:ring-0 '
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className='flex flex-col space-y-1'>
            <span>Add New BLock Schedule</span>
          </DialogTitle>
          <DialogDescription>Select some schedules to add.</DialogDescription>
        </DialogHeader>
        <div className='w-full'>
          {selectedItems.length > 0 && (
            <>
              <div className='flex justify-between w-full mb-5'>
                <div className='w-full'>Add list:</div>
                <Button type='submit' disabled={isEnabled} className='bg-blue-600 text-neutral-50' size={'sm'} onClick={() => actionFormSubmit()} variant='secondary'>
                  Save
                </Button>
              </div>
              <div className='flex w-full flex-col max-h-32 overflow-y-auto '>
                {selectedItems.map((item, index) => {
                  const selectedItem = s.find((i: any) => i._id === item.teacherScheduleId);
                  if (selectedItem) {
                    return (
                      <div key={`${selectedItem._id}`} className='text-green-500 flex gap-3 w-full justify-between'>
                        <div className='flex flex-col text-sm'>
                          <div className=''>
                            <span className='border rounded-full border-gray-600 px-1.5'>{index + 1}</span>
                          </div>{' '}
                          <span>
                            Instructor: {selectedItem.profileId.firstname} {selectedItem.profileId.middlename ?? ''} {selectedItem.profileId.lastname}
                          </span>
                          <span>Subject Code: {selectedItem.subjectId.subjectCode}</span>
                          <span>Descriptive Title: {selectedItem.subjectId.name}</span>
                          <span className=''>
                            Time:{' '}
                            <span className='uppercase'>
                              {selectedItem.startTime} - {selectedItem.endTime}
                            </span>
                          </span>
                          <span className=''>
                            Room: <span className='uppercase'>{selectedItem.roomId.roomName}</span>
                          </span>
                        </div>
                        <div className='text-red flex justify-end cursor-pointer py-1 mr-5' onClick={() => handleSelect(selectedItem._id)}>
                          <Icons.trash className='h-3 w-3' />
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </>
          )}
        </div>
        <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
          <Command className='w-full'>
            <CommandInput placeholder='Search Descriptive Title...' />
            <CommandList className='w-full'>
              <CommandEmpty>No Descriptive Title found.</CommandEmpty>
              <CommandGroup className='w-full'>
                <div className='overflow-x-auto w-full '>
                  <div className=' bg-white border border-gray-300'>
                    {s.map((s: any, index: any) => (
                      <CommandItem className='border w-full block mb-3 bg-gray-300' key={s._id} value={s.subjectId.name}>
                        <div className='grid sm:grid-cols-2 grid-cols-1 w-full'>
                          <div className='flex flex-col text-xs sm:text-sm order-2 sm:order-1'>
                            <span className=' font-semibold'>
                              Instructor: {s.profileId.firstname} {s.profileId.middlename ?? ''} {s.profileId.lastname} {s.profileId.extensionName ? s.profileId.extensionName + '.' : ''}
                            </span>
                            <span className=' font-semibold'>
                              Subject Code: <span className='uppercase'>{s.subjectId.subjectCode}</span>
                            </span>
                            <span className=' text-wrap font-semibold'>Descriptive Title: {s.subjectId.name}</span>
                            <span className=''>Pre Req.: {s.subjectId.preReq}</span>
                            <span className=''>Days: {s.days.join(', ')}</span>
                            <span className=''>Lec: {s.subjectId.lec}</span>
                            <span className=''>Lab: {s.subjectId.lab}</span>
                            <span className=''>Unit: {s.subjectId.unit}</span>
                            <span className=''>
                              Time:{' '}
                              <span className='uppercase'>
                                {s.startTime} - {s.endTime}
                              </span>
                            </span>
                            <span className=''>
                              Room: <span className='uppercase'>{s.roomId.roomName}</span>
                            </span>
                          </div>
                          <div className='justify-end sm:items-center flex items-end order-1 '>
                            {isSelected(s._id) ? (
                              <Button disabled={isEnabled} onClick={() => handleSelect(s._id)} type='button' size={'sm'} className={'focus-visible:ring-0 flex bg-transparent bg-red px-2 py-0 gap-x-0 sm:gap-x-1 justify-center  text-neutral-50 font-medium'}>
                                <Icons.trash className='h-4 w-4' />
                                <span className='sm:flex text-xs sm:text-sm'>Remove</span>
                              </Button>
                            ) : (
                              <Button
                                onClick={() => {
                                  handleSelect(s._id);
                                }}
                                type='button'
                                size={'sm'}
                                className={'focus-visible:ring-0 flex mb-7 bg-transparent bg-green-500 px-2 py-0 gap-x-0 sm:gap-x-1 justify-center  text-neutral-50 font-medium'}
                              >
                                <Icons.add className='h-4 w-4' />
                                <span className='sm:flex text-xs sm:text-sm'>Add</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    ))}
                  </div>
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddBlockSched;
