'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { Form } from '@/components/ui/form';
import { CardContent, CardFooter } from '@/components/ui/card';
import { ComboboxSubjects } from '../../add/components/ComboboxSubjects';
import { ComboboxRoom } from '../../add/components/ComboboxRoom';
import { ComboboxDays } from '../../add/components/ComboboxDays';
import Input from '../../add/components/Input';
import { z } from 'zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { TeacherScheduleCollegeValidator } from '@/lib/validators/teacherSchedule/create/college';
import { useCreateTeacherScheduleByCategoryMutation } from '@/lib/queries/teacherSchedule/create';

interface IProps {
  teacher: any;
  r: any;
  s: any;
}
const daysOfWeek = [
  { label: 'Monday', value: 'M' },
  { label: 'Tuesday', value: 'T' },
  { label: 'Wednesday', value: 'W' },
  { label: 'Thursday', value: 'Th' },
  { label: 'Friday', value: 'F' },
  { label: 'Saturday', value: 'Sa' },
  { label: 'Sunday', value: 'Su' },
];

const AddInstructorSched = ({ teacher, r, s }: IProps) => {
  const [roomId, setRoomId] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [instructorLink, setInstructorLink] = useState('');
  const [roomLink, setRoomLink] = useState('');
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const mutation = useCreateTeacherScheduleByCategoryMutation();

  const form = useForm<z.infer<typeof TeacherScheduleCollegeValidator>>({
    resolver: zodResolver(TeacherScheduleCollegeValidator),
    defaultValues: {
      teacherId: teacher._id,
      subjectId: '',
      roomId: '',
      days: [],
      startTime: '',
      endTime: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof TeacherScheduleCollegeValidator>> = async (data) => {
    setShowLink(false);
    setRoomLink('');
    setInstructorLink('');
    data.roomId = roomId;
    const dataa = {
      ...data,
      category: 'College',
    };
    data.roomId = roomId;
    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setShowLink(false);
            setRoomLink('');
            setInstructorLink('');
            setSelectedItems([]);
            form.reset();
            makeToastSucess(res.message);
            return;
          default:
            if (res.error) {
              makeToastError(res.error);
              setShowLink(true);
            }
            if (res.errorRoomLink) setRoomLink(res.errorRoomLink);
            if (res.errorInsLink) setInstructorLink(res.errorInsLink);

            return;
        }
      },
      onSettled: () => {},
    });
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
            <span>Add New Instructor Schedule</span>
            <span className='text-sm font-bold capitalize'>
              {teacher?.firstname ?? ''} {teacher?.middlename ?? ''} {teacher?.lastname ?? ''} {teacher.extensionName ? teacher.extensionName + '.' : ''}
            </span>
          </DialogTitle>
          <DialogDescription>Please fill the all the required fields.</DialogDescription>
        </DialogHeader>
        <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
          {showLink && (
            <div className='px-3 mb-5'>
              <div className='border px-2 rounded-lg shadow-sm drop-shadow-sm bg-white'>
                <div className='flex flex-col py-5 w-full sm:flex-row gap-5 items-center'>
                  <span className='text-red'>Schedule Conflict</span>
                  {instructorLink && (
                    <Link href={`/admin/college/schedules/instructors/${instructorLink}`} className='text-sm text-blue-500 hover:underline' target='_blank' rel='noopener noreferrer'>
                      See Professor Schedule
                    </Link>
                  )}
                  {roomLink && (
                    <Link href={`/admin/college/rooms/schedules/${roomLink}`} className='text-sm text-blue-500 hover:underline' target='_blank' rel='noopener noreferrer'>
                      See Room Schedule
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
          <Form {...form}>
            <form method='post' onSubmit={form.handleSubmit(onSubmit)} className='w-full space-y-4'>
              <CardContent className='w-full '>
                <div className='flex flex-col gap-4'>
                  <ComboboxSubjects name={'subjectId'} selectItems={s} form={form} label={'Select Subject:'} placeholder={'Select Subject'} />
                  <ComboboxRoom name={'roomId'} selectItems={r} form={form} label={'Select Room:'} placeholder={'Select Room'} setRoomId={setRoomId} />
                  <ComboboxDays name={'days'} selectItems={daysOfWeek} form={form} label={'Select Day/s:'} placeholder={'Select Day/s'} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                  <Input name={'startTime'} type={'time'} form={form} label={'Start Time:'} classNameInput={''} />
                  <Input name={'endTime'} type={'time'} form={form} label={'End Time:'} classNameInput={''} />
                </div>
              </CardContent>
              <CardFooter>
                <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                  <Button type='submit' variant={'destructive'} className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>
                    Register now!
                  </Button>
                </div>
              </CardFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddInstructorSched;
