'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useSession } from 'next-auth/react';
import { useSubjectCollegeQuery, useRoomQuery, useCreateTeacherScheduleCollegeMutation, useCourseQueryByCategory } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { studentSemesterData, studentYearData } from '@/constant/enrollment';
import { Combobox } from './components/Combobox';
import Input from './components/Input';
import LoaderPage from '@/components/shared/LoaderPage';
import Link from 'next/link';
import { ComboboxDays } from './components/ComboboxDays';
import { TeacherScheduleCollegeValidator } from '@/lib/validators/AdminValidator';
import { ComboboxRoom } from './components/ComboboxRoom';
import { ComboboxSubjects } from './components/ComboboxSubjects';
import { useAllProfileQueryByUserRoles } from '@/lib/queries/profile/get/roles/admin';
const daysOfWeek = [
  { label: 'Monday', value: 'M' },
  { label: 'Tuesday', value: 'T' },
  { label: 'Wednesday', value: 'W' },
  { label: 'Thursday', value: 'Th' },
  { label: 'Friday', value: 'F' },
  { label: 'Saturday', value: 'Sa' },
  { label: 'Sunday', value: 'Su' },
];
const Page = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([{}]);
  const [teacherId, setTeacherId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [instructorLink, setInstructorLink] = useState('');
  const [roomLink, setRoomLink] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const { data: tData, isLoading, isError } = useAllProfileQueryByUserRoles('TEACHER');
  const { data: sData, isLoading: sLoading, isError: sError } = useSubjectCollegeQuery();
  const { data: rData, isLoading: rLoading, error: rError } = useRoomQuery();
  
  useEffect(() => {
    if (sError || isError || rError) return; //500
  }, [sError, isError, rError]);

  useEffect(() => {
    if (!tData || !rData || !sData) return; //500
    if (rData && tData && sData) {
      if (rData.rooms) {
        const filteredRooms = rData.rooms.filter((room: any) => room.educationLevel === 'tertiary');
        setRooms(filteredRooms);
      }
      if (tData.teachers) {
        setTeachers(tData.teachers);
      }
      if (sData.subjects) {
      }
      setLoading(false);
      return;
    }
  }, [rData, tData, sData]);

  const mutation = useCreateTeacherScheduleCollegeMutation();
  const { data } = useSession();
  const session = data?.user;
  const formCollege = useForm<z.infer<typeof TeacherScheduleCollegeValidator>>({
    resolver: zodResolver(TeacherScheduleCollegeValidator),
    defaultValues: {
      teacherId: '',
      subjectId: '',
      roomId: '',
      days: [],
      startTime: '',
      endTime: '',
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof TeacherScheduleCollegeValidator>> = async (data) => {
    setIsDisabled(true);
    setShowLink(false);
    setRoomLink('');
    setInstructorLink('');
    data.roomId = roomId;
    data.teacherId = teacherId;
    const dataa = {
      ...data,
      category: 'College',
    };
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
            formCollege.reset();
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
      onSettled: () => {
        setIsDisabled(false);
      },
    });
  };
  return (
    <div className='border py-5 bg-white rounded-xl min-h-[87vh]'>
      <Card className='border-0 bg-transparent'>
        {loading ? (
          <LoaderPage />
        ) : (
          <>
            <CardHeader className='space-y-3'>
              <CardTitle className='text-left text-lg xs:text-2xl sm:text-3xl font-poppins'>Register a New Instructor Schedule!</CardTitle>
              <CardDescription className='text-xs sm:text-sm hidden'></CardDescription>
              <div className='text-xs sm:text-sm'>
                <p className='text-sm sm:text-[15px] font-normal text-muted-foreground'>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;To register a new instructor, please fill out the necessary details, including personal information, qualifications, and assigned courses. This form ensures accurate scheduling and smooth onboarding of
                  instructors into the system.
                </p>
                {/* <div className='flex flex-col mt-2'>
                  <span className='text-orange-300 font-medium'>Note:</span>
                  <span>• Newly Registered teacher must have been registered in blocks/sections schedule to display this in student. </span>
                  <div className='pl-3 flex flex-col'>
                    <span className='font-medium'>Features to consider:</span>
                    <span className=''>- Adding/Droping Subjects with schedule</span>
                  </div>
                </div> */}
              </div>
            </CardHeader>
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
            <Form {...formCollege}>
              <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
                <CardContent className='w-full '>
                  <div className='flex flex-col gap-4'>
                    <Combobox name={'teacherId'} selectItems={teachers} form={formCollege} label={'Select Instructor:'} placeholder={'Select Instructor'} setTeacherId={setTeacherId} />
                    <ComboboxSubjects name={'subjectId'} selectItems={sData!.subjects} form={formCollege} label={'Select Subject:'} placeholder={'Select Subject'} />
                    <ComboboxRoom name={'roomId'} selectItems={rooms} form={formCollege} label={'Select Room:'} placeholder={'Select Room'} setRoomId={setRoomId} />
                    <ComboboxDays name={'days'} selectItems={daysOfWeek} form={formCollege} label={'Select Day/s:'} placeholder={'Select Day/s'} selectedItems={selectedItems} setSelectedItems={setSelectedItems} />
                    <Input name={'startTime'} type={'time'} form={formCollege} label={'Start Time:'} classNameInput={''} />
                    <Input name={'endTime'} type={'time'} form={formCollege} label={'End Time:'} classNameInput={''} />
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
          </>
        )}
      </Card>
    </div>
  );
};

export default Page;
