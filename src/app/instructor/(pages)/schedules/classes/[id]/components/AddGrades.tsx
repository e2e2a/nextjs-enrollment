'use client';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { useCreateGradeReportMutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
// import FilterBySelect from './FilterBySelect';

interface IProps {
  data: any;
  teacher: any;
}

const AddGrades = ({ teacher, data }: IProps) => {
  const [students, setStudent] = useState<any>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  // const [isEnabled, setIsEnabled] = React.useState(false);
  const mutation = useCreateGradeReportMutation();
  const [grades, setGrades] = useState<any>([]);

  // Step 2: Function to handle grade input changes
  const handleGradeChange = (index: any, profileId: any, value: any) => {
    const updatedGrades = [...grades];
    updatedGrades[index] = { profileId, grade: value };
    setGrades(updatedGrades);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setIsUploading(true);
    const dataa = {
      category: 'College',
      teacherScheduleId: teacher._id,
      teacherId: teacher.profileId._id,
      reportedGrade: grades,
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
        setIsAlertOpen(false);
        setIsUploading(false);
      },
    });
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'sm'} className={'focus-visible:ring-0 flex mb-2 bg-transparent bg-green-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'}>
          <Icons.add className='h-4 w-4' />
          <span className='flex'>Add Report Grades</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-6xl max-h-[75%] overflow-y-auto w-full bg-white focus-visible:ring-0 '
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className='flex flex-col space-y-1 sm:text-center'>
            <span>Add Grade Report To Admin</span>
          </DialogTitle>
          <DialogDescription className='hidden'>Select subjects to add in the table.</DialogDescription>
        </DialogHeader>

        {/* <FilterBySelect studentBlockType={studentBlockType} setStudentBlockType={setStudentBlockType} studentSemester={studentSemester} setStudentSemester={setStudentSemester} studentYear={studentYear} setStudentYear={setStudentYear} schedules={schedules} /> */}
        <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
          <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <AlertDialogTrigger asChild>
                <div className='flex justify-end w-full'>
                  <Button type='button' disabled={isUploading} variant='outline' size={'sm'} className='focus-visible:ring-0 flex mb-2 bg-transparent bg-green-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'>
                    <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Create Report'}</span>
                  </Button>
                </div>
              </AlertDialogTrigger>
              <form action='' className='p-0 m-0' method='post'>
                <AlertDialogContent className='bg-white text-black'>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Add Report Grade</AlertDialogTitle>
                    <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;This action will create a report by the given grades to your students. Please be aware that this may report automatically to the dean.</AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction type='button' className='hidden'>
                      abzxc
                    </AlertDialogAction>
                    <Button disabled={isUploading} onClick={handleSubmit} className='bg-dark-4 text-white'>
                      <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
                    </Button>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </form>
            </AlertDialog>
            {/* <div className='flex justify-end w-full'>
                <Button size={'sm'} type='submit' onClick={handleSubmit} className={'focus-visible:ring-0 flex mb-2 bg-transparent bg-green-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'}>
                  Create Report
                </Button>
              </div> */}
            <table className='min-w-full bg-white border border-gray-200 whitespace-nowrap'>
              <thead className='bg-gray-100 border-b'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>#</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Fullname</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Course Code</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Gender</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Final Grade</th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {data.map((s: any, index: any) => (
                  // if i click button i want to save every id of the s.profileId._id and grade in an array of useState
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap'>{index + 1}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {s.profileId.firstname} {s.profileId.middlename} {s.profileId.lastname}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap uppercase'>{s.teacherScheduleId.courseId.courseCode}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>{s.profileId.sex}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Input className='w-20 text-sm text-center border-2 border-blue-400' onChange={(e) => handleGradeChange(index, s.profileId._id, e.target.value)} placeholder='' value={s.grade} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddGrades;
