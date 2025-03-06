import React from 'react';
import FirstGrade from './FirstGrade';
import SecondGrade from './SecondGrade';
import ThirdGrade from './ThirdGrade';
import FourthGrade from './FourthGrade';

interface IProps {
  setup: any;
}
const MainGrade = ({ setup }: IProps) => {
  return (
    <div className=''>
      <h1 className='font-semibold tracking-tight text-[18px] xs:text-xl  text-center mt-10 mb-5'>Request Grades</h1>
      <div className='grid grid-cols-2 md:grid-cols-4 w-full'>
        <div className='w-auto'>
          <FirstGrade setup={setup} />
        </div>
        <div className='w-auto'>
          <SecondGrade setup={setup} />
        </div>
        <div className='w-auto'>
          <ThirdGrade setup={setup} />
        </div>
        <div className='w-auto'>
          <FourthGrade setup={setup} />
        </div>
      </div>
    </div>
  );
};

export default MainGrade;
