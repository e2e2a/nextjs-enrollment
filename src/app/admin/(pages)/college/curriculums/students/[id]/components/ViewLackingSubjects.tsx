'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import ViewMissingGrades from './ViewMissingGrades';

interface IProps {
  c: any;
  sData: any;
}

const ViewLackingSubjects = ({ c, sData }: IProps) => {
  const [missingSubjects, setMissingSubjects] = useState<Record<string, any[]>>({});
  const [missingGradeSubjects, setMissingGradeSubjects] = useState<Record<string, any[]>>({});

  useEffect(() => {
    if (sData?.length > 0 && sData) {
      const missingSubjectsObj: Record<string, any[]> = {};
      const missingSubjectsGradeObj: Record<string, any[]> = {};

      c.curriculum.forEach((studentCurr: any) => {
        const yearKey = `${studentCurr.year} - ${studentCurr.semester}`;
        const curriculumByYearAndSemester = sData.find((s: any) => studentCurr.year.toLowerCase() === s.year.toLowerCase() && studentCurr.semester.toLowerCase() === s.semester.toLowerCase());

        // If there's a matching curriculum, compare subjects
        if (curriculumByYearAndSemester) {
          const requiredSubjects = curriculumByYearAndSemester.subjectsFormat;

          const studentSub = studentCurr.subjectsFormat.map((subject: any) => subject.subjectId._id.toString()); // Extract student subject IDs
          const studentSubjects = studentCurr.subjectsFormat.filter((subject: any) => !subject.grade || (subject.grade && subject.grade.toLowerCase() === 'inc')).map((s: any) => s);
          missingSubjectsGradeObj[yearKey] = studentSubjects;

          // Find missing subjects
          const notTakenSubjects = requiredSubjects.filter((currSubject: any) => !studentSub.includes(currSubject.subjectId._id)).map((currSubject: any) => currSubject);
          missingSubjectsObj[yearKey] = notTakenSubjects;
        }
      });

      setMissingGradeSubjects(missingSubjectsGradeObj);
      setMissingSubjects(missingSubjectsObj);
    }
  }, [sData, c]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'sm'} className={'focus-visible:ring-0 flex mb-0 sm:mb-7 bg-transparent bg-red px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'}>
          <Icons.eye className='h-4 w-4' />
          <span className='flex'>View Lacking Subjects</span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-6xl w-full bg-white focus-visible:ring-0 max-h-[75vh] overflow-y-auto' onOpenAutoFocus={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className='flex flex-col space-y-1'>
            <span>Lacking Subjects</span>
          </DialogTitle>
          <DialogDescription className='hidden'>Please fill the year, semester and List Order to follow.</DialogDescription>
        </DialogHeader>
        <div className=''>
          {Object.keys(missingSubjects).length > 0 ? (
            <div className='w-full'>
              {Object.entries(missingSubjects).map(([yearSem, subjects], index) => (
                <div className='w-full mb-10' key={index}>
                  {Object.keys(missingGradeSubjects).length > 0 && <ViewMissingGrades s={missingGradeSubjects} yearSem={yearSem} />}
                  <h2 className='text-red'>Missing Subjects: {yearSem}</h2>
                  <div className='lg:flex hidden'>
                    <table className='min-w-full bg-white border '>
                      <thead>
                        <tr className='bg-gray-200 text-black'>
                          <th className='px-4 py-2 border'>Subject Code</th>
                          <th className='px-4 py-2 border'>Descriptive Name</th>
                          <th className='px-4 py-2 border'>Pre. Req.</th>
                          <th className='px-4 py-2 border'>Lec Unit/s</th>
                          <th className='px-4 py-2 border'>Lab Unit/s</th>
                          <th className='px-4 py-2 border'>Total Unit/s</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((subject: any, index) => (
                          <tr key={index}>
                            <td className='px-4 py-2 border text-center'>{subject.subjectId.subjectCode}</td>
                            <td className='px-4 py-2 border text-center'>{subject.subjectId.name}</td>
                            <td className='px-4 py-2 border text-center'>{subject.subjectId.preReq}</td>
                            <td className='px-4 py-2 border text-center'>{subject.subjectId.lec}</td>
                            <td className='px-4 py-2 border text-center'>{subject.subjectId.lab}</td>
                            <td className='px-4 py-2 border text-center'>{subject.subjectId.unit}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className='flex flex-col gap-y-6 lg:hidden'>
                    {subjects.map((subject: any, index) => (
                      <div className='flex flex-col w-full' key={index}>
                        {/* <div className='flex items-center justify-end bg-gray-200'>
                          <Button size={'sm'} className='text-xs p-1 bg-green-600 text-white'>
                            <Icons.add className='w-4 h-4' /> Add
                          </Button>
                        </div> */}

                        <div className='bg-gray-200 border border-neutral-50 pl-3'>Subject Code: {subject.subjectId.subjectCode}</div>
                        <div className='bg-gray-200 border border-neutral-50 pl-3'>Descriptive Title: {subject.subjectId.name}</div>
                        <div className='bg-gray-200 border border-neutral-50 pl-3'>Pre Req.: {subject.subjectId.preReq}</div>
                        <div className='bg-gray-200 border border-neutral-50 pl-3'>lec: {subject.subjectId.lec}</div>
                        <div className='bg-gray-200 border border-neutral-50 pl-3'>lab: {subject.subjectId.lab}</div>
                        <div className='bg-gray-200 border border-neutral-50 pl-3'>unit: {subject.subjectId.lab}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div>No missing subjects found.</div>
          )}
        </div>

        <DialogFooter className='justify-end flex flex-row'>
          <DialogClose asChild>
            <Button type='button' variant='secondary'>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ViewLackingSubjects;
