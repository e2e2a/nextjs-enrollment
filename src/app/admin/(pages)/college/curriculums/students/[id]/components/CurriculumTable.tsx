'use client';
import { Button } from '@/components/ui/button';
import React, { useEffect } from 'react';
import AddFormSubject from './AddFormSubject';

interface IProps {
  data: any;
  s: any;
}

const CurriculumTable = ({ data, s }: IProps) => {
  if (!data || !data.curriculum) return <div>No data available</div>;
  console.log(data)
  return (
    <>
      {data.curriculum.length > 0 ? (
        data.curriculum.map((item: any, index: any) => (
          <div key={index} className='mb-20'>
            <div className='w-full items-center flex justify-between mb-2'>
              <span className='text-[8px] sm:text-sm'>Order: {item.order}</span>
              <div className="flex flex-col text-center">
              <span className=' font-bold text-sm sm:text-lg'>
                {item.year} - {item.semester}
              </span>
              <span className=' uppercase font-bold text-sm '>
                {item.schoolYear}
              </span>
              </div>
              <span className=' font-bold text-lg'>
                <AddFormSubject curriculum={item} s={s} />
              </span>
            </div>
            <div className='overflow-x-auto'>
              <table className='min-w-full bg-white border'>
                <thead>
                  <tr className='bg-gray-200 text-black'>
                    <th className='px-4 py-2 border'>Grades</th>
                    <th className='px-4 py-2 border'>Course Code</th>
                    <th className='px-4 py-2 border'>Descriptive Name</th>
                    <th className='px-4 py-2 border'>Pre. Req.</th>
                    <th className='px-4 py-2 border'>Lec Unit/s</th>
                    <th className='px-4 py-2 border'>Lab Unit/s</th>
                    <th className='px-4 py-2 border'>Total Unit/s</th>
                  </tr>
                </thead>
                <tbody>
                  {item.subjectsFormat && item.subjectsFormat.length > 0 ? (
                    item.subjectsFormat.map((subject: any, idx: any) => (
                      <tr key={idx}>
                        <td className='px-4 py-2 border text-center'>{subject.grade}</td>
                        <td className='px-4 py-2 border text-center'>{subject.subjectId.subjectCode}</td>
                        <td className='px-4 py-2 border text-center'>{subject.subjectId.name}</td>
                        <td className='px-4 py-2 border text-center'>EMPTY</td>
                        <td className='px-4 py-2 border text-center'>{subject.subjectId.lec}</td>
                        <td className='px-4 py-2 border text-center'>{subject.subjectId.lab}</td>
                        <td className='px-4 py-2 border text-center'>{subject.subjectId.unit}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className='px-4 py-2 border text-center'>
                        No subjects available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))
      ) : (
        <div>No curriculum data available</div>
      )}
    </>
  );
};

export default CurriculumTable;
