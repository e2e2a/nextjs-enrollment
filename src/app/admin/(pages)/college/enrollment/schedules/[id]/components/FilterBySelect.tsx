import React, { useEffect } from 'react';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { studentSemesterData, studentYearData } from '@/constant/enrollment';
interface IProps {
  studentBlockType: string;
  setStudentBlockType: React.Dispatch<React.SetStateAction<string>>;
  studentSemester: string;
  setStudentSemester: React.Dispatch<React.SetStateAction<string>>;
  studentYear: string;
  setStudentYear: React.Dispatch<React.SetStateAction<string>>;
  schedules: any;
}
const FilterBySelect = ({ studentBlockType, setStudentBlockType, studentSemester, setStudentSemester, studentYear, setStudentYear, schedules }: IProps) => {
  return (
    <div className='flex flex-col'>
      <span>Filter:</span>
      <div className='flex md:flex-row flex-col gap-5'>
        <div className='relative bg-slate-50 rounded-lg'>
          {/* <Select onValueChange={field.onChange} value={field.value}> */}
          <Select
            onValueChange={(value) => {
              setStudentBlockType(value);
            }}
            value={studentBlockType}
          >
            <SelectTrigger id={'studentBlockType'} className='w-44 uppercase pt-10 pb-4 text-left text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
              <SelectValue placeholder={'Select Block Type'} />
            </SelectTrigger>
            <SelectContent className='bg-white border-gray-300'>
              <SelectGroup>
                {schedules &&
                  schedules.map((item: any, index: any) => {
                    return item.section ? (
                      <SelectItem value={item.section} key={index} className='capitalize'>
                        Block {item.section}
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
            htmlFor={'studentBlockType'}
            className={`pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
          >
            Select Block Type
          </label>
        </div>
        <div className='relative bg-slate-50 rounded-lg'>
          <Select
            onValueChange={(value) => {
              setStudentYear(value);
            }}
            value={studentYear}
          >
            <SelectTrigger id={'studentYear'} className='w-44 uppercase pt-10 pb-4 text-left text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
              <SelectValue placeholder={'Select Block Type'} />
            </SelectTrigger>
            <SelectContent className='bg-white border-gray-300'>
              <SelectGroup>
                {studentYearData &&
                  studentYearData.map((item: any, index: any) => {
                    return item.title ? (
                      <SelectItem value={item.title} key={index} className='capitalize'>
                        {item.title}
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
            htmlFor={'studentYear'}
            className={`pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
          >
            Select Student Year
          </label>
        </div>
        <div className='relative bg-slate-50 rounded-lg'>
          <Select
            onValueChange={(value) => {
              setStudentSemester(value);
            }}
            value={studentSemester}
          >
            <SelectTrigger id={'studentYear'} className='w-44 uppercase pt-10 pb-4 text-left text-black rounded-lg focus:border-gray-400 ring-0 focus:ring-0 px-4'>
              <SelectValue placeholder={'Select Block Type'} />
            </SelectTrigger>
            <SelectContent className='bg-white border-gray-300'>
              <SelectGroup>
                {studentSemesterData &&
                  studentSemesterData.map((item: any, index: any) => {
                    return item.title ? (
                      <SelectItem value={item.title} key={index} className='capitalize'>
                        {item.title}
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
            htmlFor={'studentYear'}
            className={`pointer-events-none absolute cursor-text text-md select-none duration-200 transform -translate-y-2.5 scale-75 top-4 z-10 origin-[0] start-4 peer-focus:text-black peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-2.5`}
          >
            Select Student Year
          </label>
        </div>
      </div>
    </div>
  );
};

export default FilterBySelect;
