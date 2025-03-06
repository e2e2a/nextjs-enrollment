'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import FilterBySelect from './FilterBySelect';
import { useUpdateStudentEnrollmentScheduleMutation } from '@/lib/queries/enrollment/update/id/schedule';
import SuggestDialog from './SuggestDialog';

interface IProps {
  student: any;
  b: any;
}

const AddStudentSched = ({ student, b }: IProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [studentCourse, setStudentCourse] = useState('');
  const [studentBlockType, setStudentBlockType] = useState('');
  const [studentYear, setStudentYear] = useState('');
  const [studentSemester, setStudentSemester] = useState('');
  const [pageLoader, setPageLoader] = useState(true);
  const [schedules, setSchedules] = useState<any>([]);

  useEffect(() => {
    if (!student) return setPageLoader(true);
    if (student) {
      setStudentCourse(student.courseId.courseCode);
      setStudentBlockType(studentBlockType || student?.blockTypeId?.section);
      setStudentYear(student.studentYear);
      setStudentSemester(student.studentSemester);
      setPageLoader(false);
    }
  }, [student, studentBlockType]);

  useEffect(() => {
    if (!Array.isArray(b) || b.length === 0) {
      setSchedules([]);
      return;
    }

    const filteredSchedules = b.filter((schedule) => schedule.courseId !== undefined && schedule.courseId !== null && schedule.year === studentYear && schedule.semester === studentSemester);

    setSchedules(filteredSchedules);
  }, [b, studentCourse, studentYear, studentSemester, studentBlockType]);
  const [isEnabled, setIsEnabled] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<{ teacherScheduleId: string }[]>([]);

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

  const handleRemove = (teacherScheduleId: string) => {
    setSelectedItems((prevSelectedItems) => {
      // Filter to keep only items where teacherScheduleId is not equal to the provided one
      return prevSelectedItems.filter((item) => item.teacherScheduleId !== teacherScheduleId);
    });
  };
  const isSelected = (teacherScheduleId: string) => {
    return selectedItems.some((item) => item.teacherScheduleId === teacherScheduleId);
  };

  const mutation = useUpdateStudentEnrollmentScheduleMutation();

  const actionFormSubmit = (request: string, teacherScheduleId?: string) => {
    setIsPending(true);

    const dataa = {
      category: 'College',
      request: request,
      selectedItems: request === 'Add' ? selectedItems : request === 'Suggested' ? [{ teacherScheduleId }] : null,
      enrollmentId: student._id,
    };

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setSelectedItems([]);
            setIsOpen(false);
            makeToastSucess(res.message);
            return;
          default:
            if (res.error) {
              makeToastError(res.error);
            }
            return;
        }
      },
      onSettled: () => {
        setIsPending(false);
      },
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size={'sm'} className={'focus-visible:ring-0 flex mb-2 bg-transparent bg-green-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'}>
          <Icons.add className='h-4 w-4' />
          <span className='flex'>Add Subjects</span>
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
            <span>Add New Student Subjects</span>
            <span className='capitalize'>Course: {student.courseId?.name}</span>
            <span className='text-sm font-bold uppercase'>
              {student.profileId.firstname} {student.profileId.middlename ?? ''} {student.profileId.lastname} {student.profileId.extensionName ? student.profileId.extensionName + '.' : ''}
            </span>
            <span className='text-sm font-bold capitalize'>Block: {student?.blockTypeId?.section ? student.blockTypeId?.section : 'N/A'}</span>
          </DialogTitle>
          <DialogDescription>Select subjects to add in the table.</DialogDescription>
        </DialogHeader>

        <FilterBySelect studentBlockType={studentBlockType} setStudentBlockType={setStudentBlockType} studentSemester={studentSemester} setStudentSemester={setStudentSemester} studentYear={studentYear} setStudentYear={setStudentYear} schedules={schedules} />

        <div className='overflow-auto w-full bg-slate-50 rounded-lg'>
          <div className=''>
            {selectedItems.length > 0 && (
              <div className='flex justify-end'>
                {/*<span className=''>
                  Add list:
                  <div className='flex flex-col'>
                    {selectedItems.map((item, index) => {
                      let selectedItem = null;
                      for (const schedule of schedules) {
                        if (Array.isArray(schedule.blockSubjects)) {
                          selectedItem = schedule.blockSubjects.find((blockSubject: any) => blockSubject.teacherScheduleId._id === item.teacherScheduleId);
                          if (selectedItem) break;
                        }
                      }
                      if (selectedItem) {
                        const teacher = selectedItem?.teacherScheduleId?.profileId
                        const dean = selectedItem?.teacherScheduleId?.deanId
                        return (
                          <div key={`${selectedItem._id}`} className='text-green-500 flex gap-3'>
                            <div className='flex flex-col text-sm'>
                              <div className=''>
                                <span className='border rounded-full border-gray-600 px-1.5'>{index + 1}</span>
                              </div>{' '}
                              <span className='uppercase'>
                                Instructor:
                                {selectedItem && teacher && `${teacher?.firstname ?? ''} ${teacher?.middlename} ${teacher?.lastname} ${teacher?.extensionName}`}
                                {selectedItem && selectedItem?.deanId && `${selectedItem?.deanId?.firstname} ${selectedItem?.deanId?.middlename} ${selectedItem?.deanId?.lastname} ${selectedItem?.profileId?.extensionName}`}
                              </span>
                              <span>Title: {selectedItem?.subjectId?.name}</span>
                              <span>Code: {selectedItem.subjectId?.subjectCode}</span>
                            </div>
                            <span className='text-red cursor-pointer py-1 mr-5' onClick={() => handleRemove(selectedItem._id)}>
                              <Icons.trash className='h-3 w-3' />
                            </span>
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div> 
                </span>*/}
                <Button type='submit' disabled={isEnabled} className='bg-blue-600 text-neutral-50' size={'sm'} onClick={() => actionFormSubmit('Add')} variant='secondary'>
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
                    <div className=' bg-white border-gray-300'>
                      {schedules.length > 0 ? (
                        schedules.map((b: any, index: any) => {
                          const blockYear = (b.year ?? '').toLowerCase();
                          const year = (studentYear ?? '').toLowerCase();
                          const blockSemester = (b.semester ?? '').toLowerCase();
                          const semester = (studentSemester ?? '').toLowerCase();
                          if (blockYear === year && blockSemester === semester) {
                            const section = (b.section ?? '').toLowerCase();
                            const studentType = (studentBlockType ?? '').toLowerCase();
                            if (section === studentType) {
                              const enrolledTeacherScheduleIds = new Set(student.studentSubjects.filter((sched: any) => sched.status !== 'suggested').map((sched: any) => sched.teacherScheduleId._id));
                              return (
                                <div className='' key={b._id}>
                                  {b.blockSubjects.length > 0 ? (
                                    b.blockSubjects
                                      .filter((s: any) => !enrolledTeacherScheduleIds.has(s.teacherScheduleId._id))
                                      .map((s: any, index: any) => (
                                        <CommandItem className='border w-full block mb-3 bg-gray-300' key={s._id} value={s?.teacherScheduleId?.subjectId?.name}>
                                          <div className='grid sm:grid-cols-2 grid-cols-1 w-full'>
                                            <div className='flex flex-col text-xs sm:text-sm order-2 sm:order-1'>
                                              <span className=' font-semibold border-1 sm:border-0'>
                                                Instructor:{' '}
                                                {s.teacherScheduleId &&
                                                  s.teacherScheduleId.profileId &&
                                                  `${s.teacherScheduleId?.profileId?.firstname} ${s.teacherScheduleId?.profileId?.middlename} ${s.teacherScheduleId?.profileId?.lastname}${' '}
                                                ${s.teacherScheduleId.profileId?.extensionName ? s.teacherScheduleId.profileId.extensionName : ''}`}
                                                {s.teacherScheduleId &&
                                                  s.teacherScheduleId.deanId &&
                                                  `${s.teacherScheduleId?.deanId?.firstname} ${s.teacherScheduleId?.deanId?.middlename} ${s.teacherScheduleId?.deanId?.lastname}${' '}
                                                ${s.teacherScheduleId.deanId?.extensionName ? s.teacherScheduleId.deanId.extensionName : ''}`}
                                              </span>
                                              <span className=' font-semibold'>
                                                Department: <span className=''>{s?.teacherScheduleId?.courseId?.name}</span>
                                              </span>
                                              <span className=' font-semibold'>
                                                Subject Code: <span className=''>{s?.teacherScheduleId?.subjectId?.subjectCode}</span>
                                              </span>
                                              <span className=' text-wrap font-medium'>Title: {s?.teacherScheduleId?.subjectId?.name}</span>
                                              <span className=''>Pre Req.: {s?.teacherScheduleId?.subjectId?.preReq ?? ''}</span>
                                              <span className=''>Days: {s?.teacherScheduleId?.days.join(', ')}</span>
                                              <span className=''>Lec: {s?.teacherScheduleId?.subjectId?.lec}</span>
                                              <span className=''>Lab: {s?.teacherScheduleId?.subjectId?.lab}</span>
                                              <span className=''>Unit: {s?.teacherScheduleId?.subjectId?.unit}</span>
                                              <span className=''>
                                                Room: <span className=''>{s?.teacherScheduleId?.roomId?.roomName}</span>
                                              </span>
                                              <span className=''>
                                                Block: <span className=''>Block {s?.teacherScheduleId?.blockTypeId?.section}</span>
                                              </span>
                                            </div>
                                            <div className='justify-end sm:items-center flex items-end order-1 '>
                                              {isSelected(s?.teacherScheduleId?._id) ? (
                                                <Button
                                                  disabled={isEnabled}
                                                  onClick={() => handleSelect(s?.teacherScheduleId?._id)}
                                                  type='button'
                                                  size={'sm'}
                                                  className={'focus-visible:ring-0 flex bg-transparent bg-red px-2 py-0 gap-x-0 sm:gap-x-1 justify-center  text-neutral-50 font-medium'}
                                                >
                                                  <Icons.trash className='h-4 w-4' />
                                                </Button>
                                              ) : (
                                                <div className='flex flex-row'>
                                                  <Button
                                                    onClick={() => {
                                                      handleSelect(s?.teacherScheduleId?._id);
                                                    }}
                                                    type='button'
                                                    size={'sm'}
                                                    className={'focus-visible:ring-0 flex bg-transparent bg-green-500 rounded-tr-none rounded-br-none px-2 py-0 gap-x-0 sm:gap-x-1 justify-center  text-neutral-50 font-medium'}
                                                  >
                                                    <Icons.add className='h-4 w-4' />
                                                    <span className='sm:flex text-xs sm:text-sm'>Add</span>
                                                  </Button>
                                                  {student.step > 3 && <SuggestDialog isPending={isPending} isOpen={isOpen} setIsOpen={setIsOpen} teacherScheduleId={s.teacherScheduleId._id} actionFormSubmit={actionFormSubmit} />}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </CommandItem>
                                      ))
                                  ) : (
                                    <CommandItem className='border-0 w-full block' key={'mykey123'} value={'valueqwe123'}>
                                      <div className='w-full text-center'>No Subjects Available in this blocks. </div>
                                    </CommandItem>
                                  )}
                                </div>
                              );
                            }
                          }
                        })
                      ) : (
                        <div className=''>No Blocks available in this course</div>
                      )}
                    </div>
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddStudentSched;
