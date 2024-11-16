'use client';
import { useEffect, useState } from 'react';
import { useEnrollmentSetupQuery } from '@/lib/queries/enrollmentSetup/get';
import LoaderPage from '@/components/shared/LoaderPage';
import MainTabs from './MainTabs';

type IProps = {
  search: any;
  enrollment: any;
  profile: any;
  courses: any;
};

const EnrollmentForms = ({ search, enrollment, profile, courses }: IProps) => {
  const [value, setValue] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const { data: esData, isLoading: esLoading, isError: esError } = useEnrollmentSetupQuery();

  useEffect(() => {
    if (!esData || esError) return;

    if (esData) {
      if (esData.enrollmentSetup) {
        // setBlocks(esData.blockTypes);
        setIsPageLoading(false);
      }
      return;
    }
  }, [esData, esError]);

  useEffect(() => {
    if (!enrollment) return setValue('0');
    if (enrollment && enrollment.step) return setValue(enrollment.step as string);
  }, [value, enrollment]);

  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className=''>
          {enrollment && profile.enrollStatus === 'Pending' && (
            <div className='flex flex-col gap-y-4 justify-center items-center mb-5'>
              <div className='text-center font-semibold tracking-wider pointer-events-none select-none'>Enrollment Progress</div>
              <div className='w-full flex flex-row gap-6 bg-transparent justify-center pointer-events-none select-none'>
                <div className={`border  rounded-full text-[15px] w-6 h-6 text-center ${value == '1' ? 'border-blue-500 scale-[2] duration-500 transition-transform' : 'border-black'}`}>1</div>
                <div className={`border  rounded-full text-[15px] w-6 h-6 text-center ${value == '2' ? 'border-blue-500 scale-[2] duration-500 transition-transform' : 'border-black'}`}>2</div>
                <div className={`border  rounded-full text-[15px] w-6 h-6 text-center ${value == '3' ? 'border-blue-500 scale-[2] duration-500 transition-transform' : 'border-black'}`}>3</div>
                <div className={`border  rounded-full text-[15px] w-6 h-6 text-center ${value == '4' ? 'border-blue-500 scale-[2] duration-500 transition-transform' : 'border-black'}`}>4</div>
                <div className={`border  rounded-full text-[15px] w-6 h-6 text-center ${value == '5' ? 'border-blue-500 scale-[2] duration-500 transition-transform' : 'border-black'}`}>5</div>
                <div className={`border  rounded-full text-[15px] w-6 h-6 text-center ${value == '6' ? 'border-blue-500 scale-[2] duration-500 transition-transform' : 'border-black'}`}>6</div>
                {/* <div className={`border  rounded-full text-[15px] w-6 h-6 text-center ${value == 4 ? 'border-blue-500 scale-[2] duration-500 transition-transform' : 'border-black'}`}>4</div> */}
              </div>
            </div>
          )}

          <MainTabs search={search} value={value} enrollment={enrollment} profile={profile} enrollmentSetup={esData.enrollmentSetup} courses={courses} />
        </div>
      )}
    </>
  );
};

export default EnrollmentForms;
