import React from 'react';
import FirstGrade from './FirstGrade';

interface IProps {
  setup: any;
}
const MainGrade = ({ setup }: IProps) => {
  console.log('setup', setup);
  return (
    <div className=''>
      <h1 className="font-semibold tracking-tight text-[18px] xs:text-xl">Request Grades</h1>
      <div className='grid grid-cols-2 md:grid-cols-4 w-full'>
        <div className='w-auto'>
          <FirstGrade setup={setup} />
        </div>
        <div className='w-auto'>
          <FirstGrade setup={setup} />
        </div>
        <div className='w-auto'>
          <FirstGrade setup={setup} />
        </div>
        <div className='w-auto'>
          <FirstGrade setup={setup} />
        </div>
      </div>
    </div>
  );
};

export default MainGrade;
