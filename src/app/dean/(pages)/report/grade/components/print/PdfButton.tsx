'use client';
import React, { useState } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import Image from 'next/image';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { gradeTypeData, studentSemesterData, studentYearData } from '@/constant/enrollment';

interface IProps {
  data: any[];
}

const PdfButton = ({ data }: IProps) => {
  const [schoolYear, setSchoolYear] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [type, setType] = useState('');
  const [showSchoolYearError, setShowSchoolYearError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const handleDownloadPDF = () => {
    let filteredData = [];
    if (schoolYear) filteredData = data.filter((data) => data.schoolYear === schoolYear);
    if (year) filteredData = data.filter((data) => data.teacherScheduleId?.blockTypeId?.year === year);
    if (semester) filteredData = data.filter((data) => data.teacherScheduleId?.blockTypeId?.semester === semester);
    if (type) filteredData = data.filter((data) => data.type === type);
    console.log('filtered data', filteredData);
    try {
      setIsUploading(true);
      const doc = new jsPDF();

      const pageWidth = doc.internal.pageSize.getWidth();
      // Add a title
      const courseName = filteredData[0]?.teacherScheduleId?.courseId?.name;
      const capitalizedCourseName = courseName
        ? courseName
            .toLowerCase() // Ensure all letters are lowercase first
            .split(' ') // Split by spaces
            .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter
            .join(' ') // Join the words back together
        : '';
      doc.setFontSize(16);
      doc.text(capitalizedCourseName, pageWidth / 2, 10, { align: 'center' });
      doc.setFontSize(14);
      doc.text('Student Grades Report', pageWidth / 2, 20, { align: 'center' });

      // Add a subtitle
      // doc.setFontSize(12);
      // doc.text('Generated on: ' + new Date().toLocaleDateString(), 10, 20);

      // Add a table
      const tableColumns = ['Instructor Name', 'Course', 'Block', 'Subject Code', 'Descriptive Title', 'Year', 'Semester', 'Type'];
      const tableRows = filteredData.map((row) => {
        const instructorName = row.teacherId
          ? `${row.teacherId.firstname} ${row.teacherId.middlename ?? ''} ${row.teacherId.lastname} ${row.teacherId.extensionName ? row.teacherId.extensionName + '.' : ''}`
          : row.deanId
          ? `${row.deanId.firstname} ${row.deanId.middlename ?? ''} ${row.deanId.lastname} ${row.deanId.extensionName ? row.deanId.extensionName + '.' : ''}`
          : '';

        const courseCode = row.teacherScheduleId?.courseId?.courseCode || '';
        const block = row.teacherScheduleId?.blockTypeId?.section ? `BLOCK ${row.teacherScheduleId.blockTypeId.section}` : '';
        const subjectCode = row.teacherScheduleId?.subjectId?.subjectCode || '';
        const descriptiveTitle = row.teacherScheduleId?.subjectId?.name || '';
        const year = row.teacherScheduleId?.blockTypeId?.year || '';
        const semester = row.teacherScheduleId?.blockTypeId?.semester || '';
        const type = row.type === 'firstGrade' ? 'Prelim' : row.type === 'secondGrade' ? 'Midterm' : row.type === 'thirdGrade' ? 'Semi-final' : row.type === 'fourthGrade' ? 'Final' : '';

        return [instructorName, courseCode, block, subjectCode, descriptiveTitle, year, semester, type];
      });

      autoTable(doc, {
        head: [tableColumns],
        body: tableRows,
        startY: 30,
      });

      // Download the PDF
      doc.save('report.pdf');
      return;
    } catch (error) {
      console.log('error', error);
      return false;
    } finally {
      setIsUploading(false);
      return;
    }
  };

  return (
    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <div className='flex justify-center '>
        <AlertDialogTrigger asChild>
          {/* <DropdownMenuCheckboxItem className='capitalize'> */}
          <Button disabled={isUploading} variant='outline' size={'sm'} className='focus-visible:ring-0 flex border-0 text-black font-medium'>
            Export as PDF
          </Button>
          {/* </DropdownMenuCheckboxItem> */}
          {/* <Button type='button'  className='focus-visible:ring-0 flex mb-2 bg-transparent bg-blue-500 px-2 py-0 gap-x-1 justify-center text-neutral-50 font-medium'>
          <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Save'}</span>
        </Button> */}
        </AlertDialogTrigger>
      </div>
      <form action='' className='p-0 m-0' method='post'>
        <AlertDialogContent className='bg-white text-black'>
          <AlertDialogHeader>
            <AlertDialogTitle>Print Report Grade</AlertDialogTitle>
            <AlertDialogDescription className=''>&nbsp;&nbsp;&nbsp;&nbsp;Please fill up the field what you want to print and report.</AlertDialogDescription>
          </AlertDialogHeader>
          <div className='flex flex-col gap-0'>
            {showSchoolYearError && <span className='text-red text-xs text-muted-foreground'>FORMAT: SY2021-2022</span>}
            <div className={`relative`}>
              <input
                type={'text'}
                id={'Year'}
                className={`block rounded-xl px-5 pb-2 pt-7 w-full text-sm bg-slate-50 border border-gray-200 appearance-nonefocus:outline-none focus:ring-0 focus:border-gray-400 peer pl-4 align-text-bottom`}
                onDragStart={(e) => e.preventDefault()}
                value={schoolYear}
                onChange={(e) => {
                  const value = e.target.value;
                  setSchoolYear(value);

                  const isValidFormat = /^sy\d{4}-\d{4}$/i.test(value);
                  setShowSchoolYearError(!isValidFormat);
                }}
                disabled={isUploading}
                placeholder=''
              />
              <label
                htmlFor={'Year'}
                className={`text-nowrap absolute cursor-text text-md select-none text-muted-foreground duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5
              `}
              >
                School Year
              </label>
            </div>
          </div>
          <div className='relative bg-slate-50 rounded-lg '>
            <Select onValueChange={(res) => setYear(res)} defaultValue={year}>
              <SelectTrigger id={'Year'} className='w-full pt-10 pb-4 capitalize text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                <SelectValue placeholder={'Select Year'} />
              </SelectTrigger>
              <SelectContent className='bg-white border-gray-300'>
                <SelectGroup>
                  {studentYearData &&
                    studentYearData.map((item: any, index: any) => {
                      return item.name ? (
                        <SelectItem value={item.courseCode} key={index} className='capitalize'>
                          {item.name}
                        </SelectItem>
                      ) : (
                        <SelectItem value={item.title} key={index} className='capitalize'>
                          {item.title}
                        </SelectItem>
                      );
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <label
              className={`pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
            >
              Year
            </label>
          </div>
          <div className='relative bg-slate-50 rounded-lg '>
            <Select onValueChange={(res) => setSemester(res)} defaultValue={semester}>
              <SelectTrigger id={'Semester'} className='w-full pt-10 pb-4 capitalize text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                <SelectValue placeholder={'Select Semester'} />
              </SelectTrigger>
              <SelectContent className='bg-white border-gray-300'>
                <SelectGroup>
                  {studentSemesterData &&
                    studentSemesterData.map((item: any, index: any) => {
                      return item.name ? (
                        <SelectItem value={item.courseCode} key={index} className='capitalize'>
                          {item.name}
                        </SelectItem>
                      ) : (
                        <SelectItem value={item.title} key={index} className='capitalize'>
                          {item.title}
                        </SelectItem>
                      );
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <label
              className={`pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
            >
              Semester
            </label>
          </div>
          <div className='relative bg-slate-50 rounded-lg '>
            <Select onValueChange={(res) => setType(res)} defaultValue={type}>
              <SelectTrigger id={'Type'} className='w-full pt-10 pb-4 capitalize text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
                <SelectValue placeholder={'Select Type'} />
              </SelectTrigger>
              <SelectContent className='bg-white border-gray-300'>
                <SelectGroup>
                  {gradeTypeData &&
                    gradeTypeData.map((item: any, index: any) => {
                      return (
                        <SelectItem value={item.value} key={index} className='capitalize'>
                          {item.title}
                        </SelectItem>
                      );
                    })}
                </SelectGroup>
              </SelectContent>
            </Select>
            <label
              className={`pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
            >
              Semester
            </label>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction type='button' className='hidden'>
              abzxc
            </AlertDialogAction>
            <Button disabled={isUploading} onClick={handleDownloadPDF} className='bg-dark-4 text-white'>
              <span className=' text-white text-[15px] font-medium'>{isUploading ? <Image src='/icons/buttonloader.svg' alt='loader' width={26} height={26} className='animate-spin' /> : 'Continue'}</span>
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </form>
    </AlertDialog>
  );
};

export default PdfButton;
