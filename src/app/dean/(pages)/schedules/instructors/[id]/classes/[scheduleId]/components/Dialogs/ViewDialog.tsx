'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { Input } from '@/components/ui/input';
import AlertDialogPage from '../alert/AlertDialogPage';

interface IProps {
  data: any;
  teacher: any;
  type: string;
  reportGrades: any;
}

const ViewDialog = ({ teacher, data, type, reportGrades }: IProps) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [grades, setGrades] = useState<any>([]);

  useEffect(() => {
    const initialGrades = reportGrades.reportedGrade.map((s: any) => ({
      profileId: s.profileId._id,
      grade: s.grade,
    }));
    setGrades(initialGrades);
  }, [reportGrades]);

  const handleGradeChange = (index: any, profileId: any, value: any) => {
    const updatedGrades = [...grades];
    updatedGrades[index] = { profileId, grade: value };
    setGrades(updatedGrades);
  };

  return (
    <Dialog open={isOpen} modal={true} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'} className={`focus-visible:ring-0 flex mb-2 bg-transparent bg-blue-500  px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium`}>
          <Icons.eye className='h-4 w-4' />
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
              View Grade Report in {''}
              {type === 'firstGrade' && 'Prelim'}
              {type === 'secondGrade' && 'Midterm'}
              {type === 'thirdGrade' && 'Semi-final'}
              {type === 'fourthGrade' && 'Final'}
            </span>
          </DialogTitle>
          <DialogDescription className='hidden'>Select subjects to add in the table.</DialogDescription>
        </DialogHeader>

        <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
          <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
            <div className='grid sm:grid-cols-2 grid-cols-1 items-start w-full gap-y-1 mb-7'>
              <div className='flex w-full justify-start'>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Type:
                  <span className='font-normal'>
                    {' '}
                    {reportGrades?.type === 'firstGrade' && 'Prelim'}
                    {reportGrades?.type === 'secondGrade' && 'Midterm'}
                    {reportGrades?.type === 'thirdGrade' && 'Semi-final'}
                    {reportGrades?.type === 'fourthGrade' && 'Final'}
                    {''} Grade
                  </span>
                </span>
              </div>
              <div className='flex w-full justify-start sm:justify-end'>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Status:
                  <span className='font-normal text-sm text-green-500 uppercase'> {reportGrades?.statusInDean}</span>
                </span>
              </div>
              <div className='flex w-full justify-start'>
                <span className='text-sm sm:text-[17px] font-bold capitalize'>
                  Evaluated:
                  <span className='font-normal text-sm uppercase'> {reportGrades?.evaluated ? <span className=' text-green-500'>True</span> : <span className=' text-blue-500'>False</span>}</span>
                </span>
              </div>
            </div>
            {reportGrades.statusInDean === 'Approved' && !reportGrades.evaluated && (
              <div className='flex justify-end w-full'>
                <AlertDialogPage user={reportGrades} isPending={isUploading} setIsPending={setIsUploading} />
              </div>
            )}

            <table className='min-w-full bg-white border border-gray-200 whitespace-nowrap'>
              <thead className='bg-gray-100 border-b'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>#</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Fullname</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Course Code</th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Gender</th>
                  <th className='px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider text-center'>
                    {type === 'firstGrade' && 'Prelim'}
                    {type === 'secondGrade' && 'Midterm'}
                    {type === 'thirdGrade' && 'Semi-final'}
                    {type === 'fourthGrade' && 'Final'}
                    {''} Grade
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {reportGrades.reportedGrade.map((s: any, index: any) => {
                  return (
                    <tr key={index}>
                      <td className='px-6 py-4 whitespace-nowrap'>{index + 1}</td>
                      <td className='px-6 py-4 whitespace-nowrap capitalize'>
                        {s?.profileId?.firstname ?? ''} {s?.profileId?.middlename ?? ''} {s?.profileId?.lastname ?? ''} {s?.profileId?.extensionName ? s.profileId?.extensionName + '.' : ''}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>{reportGrades.teacherScheduleId?.courseId?.courseCode}</td>
                      <td className='px-6 py-4 whitespace-nowrap'>{s.profileId?.sex}</td>
                      <td className='px-6 py-4 whitespace-nowrap text-center'>
                        {isDisabled ? s.grade : <Input className='w-20 text-sm text-center border-2 border-blue-400' onChange={(e) => handleGradeChange(index, s.profileId._id, e.target.value)} placeholder='' value={grades[index]?.grade} />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewDialog;
