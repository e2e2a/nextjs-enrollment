'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { useUpdateCourseBlockScheduleMutation } from '@/lib/queries';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
interface IProps {
  blockType: any;
  s: any;
}

const AddBlockSched = ({ blockType, s }: IProps) => {
  console.log(blockType);

  // const [selectedItems, setSelectedItems] = React.useState<any[]>([{selectedItems: {teacherScheduleId: [], subjectId: []}}]);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<{ teacherScheduleId: string }[]>([]);
  const mutation = useUpdateCourseBlockScheduleMutation();
  const handleSelect = (teacherScheduleId: string) => {
    setSelectedItems((prevSelectedItems) => {
      const itemIndex = prevSelectedItems.findIndex((item) => item.teacherScheduleId === teacherScheduleId);
      if (itemIndex > -1) {
        // Item is already selected, so remove it
        return prevSelectedItems.filter((item) => item.teacherScheduleId !== teacherScheduleId);
      } else {
        // Item is not selected, so add it
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

    console.log(data);
    mutation.mutate(data, {
      onSuccess: (res: any) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setSelectedItems([]);
            makeToastSucess(res.message);
            return;
          default:
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
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'sm'} className={'focus-visible:ring-0 flex mb-2 bg-transparent bg-blue-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'}>
          <Icons.squarePen className='h-4 w-4' />
          <span className='flex'>Edit Schedule</span>
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
          <DialogDescription>Please fill the year, semester, SY and List Order to follow.</DialogDescription>
        </DialogHeader>
        <div className=''>
          {selectedItems.length > 0 && (
            <div className='flex justify-between'>
              <span className=''>
                Add list:
                <div className='flex flex-col'>
                  {selectedItems.map((item, index) => {
                    const selectedItem = s.find((i: any) => i._id === item.teacherScheduleId);
                    if (selectedItem) {
                      return (
                        <div key={`${selectedItem._id}`} className='text-green-500 flex gap-3'>
                          <div className='flex flex-col text-sm'>
                            <div className=''>
                              <span className='border rounded-full border-gray-600 px-1.5'>{index + 1}</span>
                            </div>{' '}
                            {/* Numbering starts from 1 */}
                            <span>
                              Instructor: {selectedItem.profileId.firstname} {selectedItem.profileId.middlename} {selectedItem.profileId.lastname}
                            </span>
                            <span>Title: {selectedItem.subjectId.name}</span>
                            <span>Code: {selectedItem.subjectId.subjectCode}</span>
                          </div>
                          <span className='text-red cursor-pointer py-1 mr-5' onClick={() => handleSelect(s._id)}>
                            <Icons.trash className='h-3 w-3' />
                          </span>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </span>
              <Button type='submit' disabled={isEnabled} className='bg-blue-600 text-neutral-50' size={'sm'} onClick={() => actionFormSubmit()} variant='secondary'>
                Save
              </Button>
            </div>
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
                      <CommandItem className='border w-full block' key={s._id} value={s.subjectId.name}>
                        <div className='flex w-full'>
                          <div className='min-w-[80px] justify-center flex items-center'>
                            {isSelected(s._id) ? (
                              <Button disabled={isEnabled} onClick={() => handleSelect(s._id)} type='button' size={'sm'} className={'focus-visible:ring-0 flex mb-7 bg-transparent bg-red px-2 py-0 gap-x-0 sm:gap-x-1 justify-center  text-neutral-50 font-medium'}>
                                <Icons.trash className='h-4 w-4' />
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
                                <span className='sm:flex hidden text-xs sm:text-sm'>Add</span>
                              </Button>
                            )}
                          </div>
                          <div className='flex flex-col text-sm'>
                            <span className=' font-semibold'>
                              Instructor: {s.profileId.firstname} {s.profileId.middlename} {s.profileId.lastname}
                            </span>
                            <span className=' font-semibold'>
                              Code: <span className='uppercase'>{s.subjectId.subjectCode}</span>
                            </span>
                            <span className=' text-wrap font-medium'>Title: {s.subjectId.name}</span>
                            <span className=''>Pre Req.: EMPTY</span>
                            <span className=''>Days: {s.days.join(', ')}</span>
                            <span className=''>Lec: {s.subjectId.lec}</span>
                            <span className=''>Lab: {s.subjectId.lab}</span>
                            <span className=''>Unit: {s.subjectId.unit}</span>
                            <span className=''>
                              Room: <span className='uppercase'>{s.roomId.roomName}</span>
                            </span>
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
