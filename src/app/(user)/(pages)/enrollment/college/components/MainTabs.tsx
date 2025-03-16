'use client';
import { Tabs } from '@/components/ui/tabs';
import Step0 from './Step0';
import Step2 from './Step2';
import Step1 from './Step1';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import Step6 from './Step6';
import Congrats from './Congrats';
import Open from './EnrollmentsStatus/Open';
import CollegeOldStudent from './CollegeOldStudent';

type IProps = {
  search: string;
  value: string;
  enrollment: any;
  profile: any;
  enrollmentSetup: any;
  courses: any
};

/**
 * @note This component is sensitive in formatting code
 * example: auto removing '()' if formatted
 * 
 */

const MainTabs = ({ search, value, enrollment, profile, enrollmentSetup, courses }: IProps) => {
  const isEnrolled = (profile.enrollStatus !== 'Enrolled' && profile.enrollStatus !== 'Temporary Enrolled')
  return (
    <Tabs value={`${value}`} className='w-full gap-4 '>
      {!enrollment && !enrollmentSetup?.enrollmentTertiary.open && <Open es={enrollmentSetup?.enrollmentTertiary} />}
      {enrollmentSetup?.enrollmentTertiary.open && (!enrollment && profile.studentStatus === 'New Student' && isEnrolled) && <Step0 search={search} enrollmentSetup={enrollmentSetup} courses={courses} />}
      {enrollmentSetup?.enrollmentTertiary.open && (!enrollment && profile.studentStatus === 'Continue' && isEnrolled) && <CollegeOldStudent profile={profile} enrollmentSetup={enrollmentSetup} />}
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
      {enrollment && (profile.enrollStatus === 'Enrolled' || profile.enrollStatus === 'Temporary Enrolled') && <Congrats enrollment={enrollment} enrollmentSetup={enrollmentSetup} />}
    </Tabs>
  );
};

export default MainTabs;
