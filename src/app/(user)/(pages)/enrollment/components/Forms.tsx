'use client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Step0 from './Step0';
import Step2 from './Step2';
import Step1 from './Step1';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Congrats from './Congrats';
import { useEnrollmentSetupQuery } from '@/lib/queries';
import LoaderPage from '@/components/shared/LoaderPage';
import Open from './EnrollmentsStatus/Open';
type IProps = {
  search: any;
  enrollment: any;
  profile: any;
};
const EnrollmentForms = ({ search, enrollment, profile }: IProps) => {
  // if (!enrollment) return;
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
  console.log('dataeasd', esData?.enrollmentSetup?.enrollmentTertiary.open);
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

          <Tabs value={`${value}`} className='w-full gap-4 '>
            {!enrollment && !esData?.enrollmentSetup?.enrollmentTertiary.open && <Open es={esData?.enrollmentSetup?.enrollmentTertiary}/>}
            {esData?.enrollmentSetup?.enrollmentTertiary.open && (!enrollment && profile.studentStatus === 'New Student' && profile.enrollStatus !== 'Enrolled') && <Step0 search={search} enrollment={enrollment} /> }
            {(!enrollment && profile.studentStatus === 'Continue' && profile.enrollStatus !== 'Enrolled') && <Step0 search={search} enrollment={enrollment} />}
            {enrollment && profile.enrollStatus === 'Pending' && (
              <>
                <Step1 search={search} enrollment={enrollment} />
                <Step2 enrollment={enrollment} />
                <Step3 enrollment={enrollment} />
                <Step4 enrollment={enrollment} />
                <Step5 enrollment={enrollment} />
                <Step6 enrollment={enrollment} />
              </>
            )}
            {enrollment && profile.enrollStatus === 'Enrolled' && <Congrats enrollment={enrollment} />}
          </Tabs>
        </div>
      )}
    </>
  );
};

export default EnrollmentForms;
