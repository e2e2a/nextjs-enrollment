'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { Input } from '@/components/ui/input';
import { useCreateGradeReportMutation } from '@/lib/queries/reportGrade/create';
import CreateAlert from '../Alerts/CreateAlert';

interface IProps {
  data: any;
  teacher: any;
  type: string;
}

const CreateDialog = ({ teacher, data, type }: IProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);

  const mutation = useCreateGradeReportMutation();

  const [grades, setGrades] = useState<any>([]);

  useEffect(() => {
    const initialGrades = data.map((s: any) => ({
      profileId: s.profileId._id,
      grade: s.grade,
      error: false, // for error messages
    }));
    setGrades(initialGrades);
  }, [data]);

  const handleGradeChange = (index: any, profileId: any, value: any) => {
    value = value.trim();
    let error = false;
    if (isNaN(value) && String(value).toLowerCase() !== 'inc') error = true;

    const updatedGrades = [...grades];
    updatedGrades[index] = { profileId, grade: value, error };
    setGrades(updatedGrades);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsUploading(true);
    const g = await grades.filter((g: any) => isNaN(g.grade) && String(g.grade).toLowerCase() !== 'inc');
    if (g.length > 0) {
      makeToastError('Only Number/INC are allowed');
      setIsAlertOpen(false);
      setIsUploading(false);
      return;
    }
    const dataa = {
      category: 'College',
      teacherScheduleId: teacher._id,
      type: type,
      reportedGrade: grades,
    };

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsOpen(false);
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
    <Dialog open={isOpen} modal={true} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'} className={`focus-visible:ring-0 flex mb-2 bg-transparent bg-green-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium`}>
          <Icons.add className='h-4 w-4' />
          <span className='flex'>
            Report Grades in {''}
            {type === 'firstGrade' && 'Prelim'}
            {type === 'secondGrade' && 'Midterm'}
            {type === 'thirdGrade' && 'Semi-final'}
            {type === 'fourthGrade' && 'Final'}
          </span>
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
            <span>
              Create Grade Report in {''}
              {type === 'firstGrade' && 'Prelim'}
              {type === 'secondGrade' && 'Midterm'}
              {type === 'thirdGrade' && 'Semi-final'}
              {type === 'fourthGrade' && 'Final'}
            </span>
          </DialogTitle>
          <DialogDescription className='' asChild>
            <div className=''>
              <div className='text-orange-500'>Reminder:</div>
              <div className=''>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Empty grades consider as <span className='text-red'>5.0</span>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
          <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
            <CreateAlert isUploading={isUploading} isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen} handleSubmit={handleSubmit} />

            <table className='min-w-full bg-white border border-gray-200 whitespace-nowrap'>
              <thead className='bg-gray-100 border-b'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>#</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Fullname</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Course Code</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Gender</th>
                  <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    {type === 'firstGrade' && 'Prelim'}
                    {type === 'secondGrade' && 'Midterm'}
                    {type === 'thirdGrade' && 'Semi-final'}
                    {type === 'fourthGrade' && 'Final'}
                    {''} Grade
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {data.map((s: any, index: any) => (
                  <tr key={index}>
                    <td className='px-6 py-4 whitespace-nowrap'>{index + 1}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      {s?.profileId?.firstname ?? ''} {s?.profileId?.middlename ?? ''} {s?.profileId?.lastname ?? ''} {s?.profileId?.extensionName ? s.profileId.extensionName + '.' : ''}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>{s?.teacherScheduleId?.courseId?.courseCode}</td>
                    <td className='px-6 py-4 whitespace-nowrap'>{s.profileId.sex}</td>
                    <td className='px-6 py-4 whitespace-nowrap flex flex-col justify-center items-center w-full'>
                      <Input className='w-20 text-sm text-center border-2 border-blue-400' onChange={(e) => handleGradeChange(index, s.profileId._id, e.target.value)} placeholder='' value={s?.grades} />
                      <div className=''>{grades && grades[index]?.error && <p className='text-xs text-red'>Only Number/INC are allowed</p>}</div>
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

export default CreateDialog;
