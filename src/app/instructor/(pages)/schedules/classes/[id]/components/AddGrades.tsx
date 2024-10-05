'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { useUpdateStudentEnrollmentScheduleMutation } from '@/lib/queries';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { Input } from '@/components/ui/input';
// import FilterBySelect from './FilterBySelect';

interface IProps {
  data: any;
  teacher: any;
}

const AddGrades = ({ teacher, data }: IProps) => {
  const [students, setStudent] = useState<any>([]);

  // useEffect(() => {
  //   if (!Array.isArray(data) || data.length === 0) {
  //     setStudent([]);
  //     return;
  //   }
  //   const filteredSchedules = data
  //     .map((schedule) => {
  //       // Filter studentSubjects to include only those matching the teacher._id
  //       const filteredSubjects = schedule.studentSubjects.filter((subject: any) => subject.teacherScheduleId._id === teacher._id);

  //       setStudent(filteredSubjects);
  //       // Return the schedule with only the filtered studentSubjects
  //       return {
  //         studentSubjects: filteredSubjects,
  //       };
  //     })
  //     .filter((schedule) => schedule.studentSubjects.length > 0); // Remove schedules with no matching subjects
  // }, [data, teacher]);
  // console.log('students', students);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<{ teacherScheduleId: string }[]>([]);

  const mutation = useUpdateStudentEnrollmentScheduleMutation();

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
            {/* <span className='capitalize'>Course: {student.courseId.name}</span>
            <span className='text-sm font-bold uppercase'>
              {student.profileId.firstname} {student.profileId.middlename} {student.profileId.lastname} {student.profileId.extensionName ? student.profileId.extensionName : ''}
            </span>
            <span className='text-sm font-bold capitalize'>Block: {student.blockTypeId.section}</span> */}
          </DialogTitle>
          <DialogDescription>Select subjects to add in the table.</DialogDescription>
        </DialogHeader>

        {/* <FilterBySelect studentBlockType={studentBlockType} setStudentBlockType={setStudentBlockType} studentSemester={studentSemester} setStudentSemester={setStudentSemester} studentYear={studentYear} setStudentYear={setStudentYear} schedules={schedules} /> */}
        <div className='flex justify-end w-full'>
          <Button size={'sm'} className={'focus-visible:ring-0 flex mb-2 bg-transparent bg-green-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'}>
            <Icons.add className='h-4 w-4' />
            <span className='flex'>Report Grades</span>
          </Button>
        </div>
        <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
          {/* <div className=''>
            <span>hello world</span>
          </div> */}
          <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
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
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap'>{index + 1}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {s.profileId.firstname} {s.profileId.middlename} {s.profileId.lastname}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap uppercase'>{s.teacherScheduleId.courseId.courseCode}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>{s.profileId.sex}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <Input className='w-20 text-sm text-center border-2 border-blue-400' placeholder='' value={s.grade} />
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
