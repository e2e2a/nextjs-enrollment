import React from 'react';

interface IProps {
  s: any;
  yearSem: string;
}
const ViewMissingGrades = ({ s, yearSem }: IProps) => {
  return (
    <div className=''>
      {Object.entries(s).map(([y, subjects], index) => {
        if (y !== yearSem) return;
        return (
          <div className='w-full' key={index}>
            <h2 className='text-red'>Missing Grades: {y}</h2>
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
                  {Array.isArray(subjects) &&
                    subjects.map((subject: any, index) => (
                      <tr key={index}>
                        <td className='px-4 py-2 border text-center'>{subject?.subjectId?.subjectCode}</td>
                        <td className='px-4 py-2 border text-center'>{subject?.subjectId?.name}</td>
                        <td className='px-4 py-2 border text-center'>{subject?.subjectId?.preReq ?? ''}</td>
                        <td className='px-4 py-2 border text-center'>{subject?.subjectId?.lec}</td>
                        <td className='px-4 py-2 border text-center'>{subject?.subjectId?.lab}</td>
                        <td className='px-4 py-2 border text-center'>{subject?.subjectId?.unit}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
            <div className='flex flex-col gap-y-6 lg:hidden'>
              {Array.isArray(subjects) &&
                subjects.map((subject: any, index) => (
                  <div className='flex flex-col w-full' key={index}>
                    <div className='bg-gray-200 border border-neutral-50 pl-3'>Subject Code: {subject?.subjectId?.subjectCode}</div>
                    <div className='bg-gray-200 border border-neutral-50 pl-3'>Descriptive Title: {subject.subjectId?.name}</div>
                    <div className='bg-gray-200 border border-neutral-50 pl-3'>Pre Req.: {subject?.subjectId?.preReq ?? ''}</div>
                    <div className='bg-gray-200 border border-neutral-50 pl-3'>lec: {subject?.subjectId?.lec}</div>
                    <div className='bg-gray-200 border border-neutral-50 pl-3'>lab: {subject?.subjectId?.lab}</div>
                    <div className='bg-gray-200 border border-neutral-50 pl-3'>unit: {subject?.subjectId?.lab}</div>
                  </div>
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ViewMissingGrades;
