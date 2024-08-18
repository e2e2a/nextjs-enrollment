'use client';
import Loader from '@/components/shared/Loader';
import { useEnrollmentQueryByStep } from '@/lib/queries';
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { columns } from '../components/columns';
import { DataTable } from '../components/DataTable';
interface Enrollment {
  id: string;
  userId: any;
  courseId: any;
  studentYear: string;
  studentSemester: string;
  step: any;
  createdAt: Date;
  updatedAt: Date;
}
const page = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const step = searchParams.get('step')
    console.log(step, 'step')
//   const createQueryString = useCallback(
//     (name: string, value: string) => {
//       const params = new URLSearchParams(searchParams.toString())
//       params.set(name, value)
 
//       return params.toString()
//     },
//     [searchParams]
//   )

  const [isStep, setIsStep] = useState('');
  const [isError, setIsError] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [en, setEn] = useState([]);
  const isAllowed = ['1', '2', '3', '4'];

  useEffect(() => {
    const validateSearchParam = () => {
      if (step === null) {
        setIsError(true);
      } else if (!isAllowed.includes(step as string)) {
        // `step` parameter is invalid
        setIsStep(step as string)
        setIsError(true);
      } else {
        // `step` parameter is valid

        setIsError(false);
      }
      setIsPageLoading(false); // Set loading to false after validation
    };

    validateSearchParam();
  }, [step, isAllowed,pathname]);

  const { data, isLoading, error: isEnError } = useEnrollmentQueryByStep(isStep);
  useEffect(() => {
    if (isLoading || !data || !data.enrollment) {
      return;
    }
    if (isEnError) console.log(isEnError.message);
    if (data) {
      console.log('courses logs:', data.enrollment);
    }
    setIsPageLoading(false);
  }, [data, isLoading, isEnError, step]);

  return <>{isPageLoading ? <Loader /> : <div className='bg-white min-h-[86vh] py-5 rounded-xl'>{isError ? <div className=''>404</div> : <DataTable columns={columns} data={data?.enrollment as Enrollment[]} />}</div>}</>;
};

export default page;
