'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { useSession } from 'next-auth/react';
import { useUserRolesTeacherQuery, useCreateCourseBlockMutation, useCreateCourseMutation, useSubjectCollegeQuery, useRoomQuery, useCreateTeacherScheduleCollegeMutation, useCourseQueryByCategory } from '@/lib/queries';
import { makeToastError } from '@/lib/toast/makeToast';
import { studentSemesterData, studentYearData } from '@/constant/enrollment';
import { Combobox } from './components/Combobox';
import Input from './components/Input';
import LoaderPage from '@/components/shared/LoaderPage';
import { SelectInput } from './components/SelectInput';
import Link from 'next/link';
import { ComboboxDays } from './components/ComboboxDays';
import { TeacherScheduleCollegeValidator } from '@/lib/validators/AdminValidator';
import { ComboboxRoom } from './components/ComboboxRoom';
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
  const [isNotEditable, setIsNotEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rooms, setRooms] = useState([{}]);
  // This roomId and teacherId is passed in the inputs
  const [courseCategory, setCourseCategory] = useState('');
  const [courseId, setCourseId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [roomId, setRoomId] = useState('');
  const [teachers, setTeachers] = useState<any[]>([]);
  const { data: tData, isLoading, isError } = useUserRolesTeacherQuery();
  const { data: sData, isLoading: sLoading, isError: sError } = useSubjectCollegeQuery();
  const { data: rData, isLoading: rLoading, error: rError } = useRoomQuery();
  useEffect(() => {
    if (!tData || !tData.teachers || isError) return;
    if (!sData || !sData.subjects || sError) return;
    
    if (tData && sData) {
      setLoading(false);
      setTeachers(tData.teachers);
      return;
    }
  }, [tData, sData, sError, sLoading, isLoading, isError]);
  useEffect(() => {
    if (!rData || !rData.rooms || rError) return;
    
    if (rData) {
      const filteredRooms = rData.rooms.filter((room: any) => room.educationLevel === 'tertiary');
      setRooms(filteredRooms);
      return;
    }
  }, [rData, rLoading, rError]);
  
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
    data.roomId = roomId;
    data.teacherId = teacherId;
    const dataa = {
      ...data,
      category: 'College',
    };
    console.log('data', dataa);
    mutation.mutate(dataa, {
      onSuccess: (res) => {
        console.log(res);
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            // form.reset();
            return;
          default:
            if (res.error) {
              makeToastError(res.error);
            }

            return;
        }
      },
      onError: (error) => {
        console.error(error.message);
      },
      onSettled: () => {},
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
              <CardTitle className='text-left text-lg xs:text-2xl sm:text-3xl font-poppins'>Register a New Teacher Schedule!</CardTitle>
              <CardDescription className='text-xs sm:text-sm hidden'></CardDescription>
              <div className='text-xs sm:text-sm'>
                To register a new teacher schedule, start by selecting the course from the list provided. This list is populated with courses created and managed by the administrator. Next, specify the academic year and semester for the block to ensure it is
                correctly aligned with the course schedule. Providing this information will help synchronize the block with the appropriate course and academic period.
                <div className='flex flex-col mt-2'>
                  <span className='text-orange-300 font-medium'>Note:</span>
                  <span>• Newly Registered teacher must have been registered in blocks/sections schedule to display this in student. </span>
                  <div className='pl-3 flex flex-col'>
                    <span className='font-medium'>Features to consider:</span>
                    <span className=''>- Adding/Droping Subjects with schedule</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <Form {...formCollege}>
              <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
                <CardContent className='w-full '>
                  <div className='flex flex-col gap-4'>
                    <Combobox name={'teacherId'} selectItems={teachers} form={formCollege} label={'Select Instructor:'} placeholder={'Select Instructor'} setTeacherId={setTeacherId} />
                    <SelectInput name={'subjectId'} selectItems={sData!.subjects} form={formCollege} label={'Select Subject:'} placeholder={'Select Subject'} />
                    <ComboboxRoom name={'roomId'} selectItems={rooms} form={formCollege} label={'Select Room:'} placeholder={'Select Room'} setRoomId={setRoomId} />
                    <ComboboxDays name={'days'} selectItems={daysOfWeek} form={formCollege} label={'Select Day/s:'} placeholder={'Select Day/s'} />
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
