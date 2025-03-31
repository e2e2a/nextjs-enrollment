'use client';
import React, { useEffect, useState } from 'react';
import LoaderPage from '@/components/shared/LoaderPage';
import { Button } from '@/components/ui/button';
import { useProfileQueryBySessionId } from '@/lib/queries/profile/get/session';
import { useBlockCourseQueryByCategory } from '@/lib/queries/blocks/get/category';
import { CardContent, CardFooter } from '@/components/ui/card';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { SelectInput } from './components/SelectInput';
import { PrintReportValidatorInCollege } from '@/lib/validators/report';
import { printSelectionOptions, printSelectionScope, exportTypeOption, printSelectionStudentType, studentYearData, studentSemesterData } from '../../../../constant/print/printOptions';
import { useAllRoomQueryByEduLevel } from '@/lib/queries/rooms/get/all';
import { Combobox } from './components/Combobox';
import { useAllProfileQueryByUserRoles } from '@/lib/queries/profile/get/roles/admin';
import { usePrintReportMutation } from '@/lib/queries/print';
import { exportToExcel, exportToPDF } from './components/ExportUtils';
import { useSubjectQueryByCategory } from '@/lib/queries/subjects/get/category';

const Page = () => {
  const [studentId, setStudentId] = useState('');
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isUploaded, setIsUploaded] = useState(false);
  const [blocks, setBlocks] = useState<any>([]);
  const { data, error } = useBlockCourseQueryByCategory('College');
  const { data: pData, error: pError } = useProfileQueryBySessionId();
  const { data: roomData, error: roomError } = useAllRoomQueryByEduLevel('tertiary');
  const { data: sData, isError: sError } = useAllProfileQueryByUserRoles('STUDENT');
  const { data: subsData, isError: subError } = useSubjectQueryByCategory('College');
  const mutation = usePrintReportMutation();

  useEffect(() => {
    if (error || !data) return;
    if (pError || !pData) return;

    if (data && pData?.profile) {
      if (data?.blockTypes) {
        const filteredBlocks = data?.blockTypes.filter((b: any) => b?.courseId?._id === pData.profile?.courseId?._id);
        setBlocks(filteredBlocks);
      }
      setIsPageLoading(false);
    }
  }, [data, error, pData, pError]);

  useEffect(() => {
    if (roomError || !roomData) return;
    if (sError || !sData) return;
    if (subError || !subsData) return;
  }, [roomData, roomError, sData, sError, subsData, subError]);

  const formCollege = useForm<z.infer<typeof PrintReportValidatorInCollege>>({
    resolver: zodResolver(PrintReportValidatorInCollege),
    defaultValues: {
      category: 'College',
      printSelection: '',
      selectionScope: '',
      individualSelectionId: '',
      studentType: '',
      year: '',
      semester: '',
      exportType: '',
    },
  });

  const a = formCollege.watch('printSelection');
  const b = formCollege.watch('selectionScope');
  const c = formCollege.watch('studentType');
  useEffect(() => {
    if (a) {
      formCollege.setValue('individualSelectionId', '');
    }
  }, [a, formCollege]);

  const onSubmit: SubmitHandler<z.infer<typeof PrintReportValidatorInCollege>> = async (data) => {
    setIsUploaded(true);
    if (a === 'Students' && b === 'Individual') data.individualSelectionId = studentId;

    mutation.mutate(data, {
      onSuccess: async (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            formCollege.reset();
            if (res.message) makeToastSucess(res.message);
            if (data.exportType === 'Pdf') await exportToPDF(res?.b?.dataToPrint, 'asd', data.printSelection, data.selectionScope);
            if (data.exportType === 'Excel') await exportToExcel(res?.b?.dataToPrint, 'as3d', data.printSelection, data.selectionScope);
            return;
          default:
            if (res.error) return makeToastError(res.error);
            return;
        }
      },
      onSettled: () => {
        setIsUploaded(false);
      },
    });
  };
  return (
    <>
      {isPageLoading ? (
        <LoaderPage />
      ) : (
        <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl'>
          {((data?.error && data?.status === 404) || (pData?.error && pData?.status === 404)) && <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>404</div>}
          {((data?.error && data?.status > 500) || (pData?.error && pData?.status > 500)) && <div className='bg-white min-h-[86vh] py-5 px-5 rounded-xl items-center flex justify-center'>Something Went Wrong</div>}
          {pData?.profile && !pData?.error && (
            <div className=''>
              <div className='flex flex-col items-center justify-center py-4 text-black'>
                <h1 className='text-lg sm:text-3xl font-bold'>Print Reports</h1>
              </div>
              <div className='flex flex-col items-start justify-start py-4 text-black'>
                <h1 className='text-lg sm:text-lglg font-bold'>Department: {pData?.profile?.courseId?.name || ''}</h1>
              </div>
              <Form {...formCollege}>
                <form method='post' onSubmit={formCollege.handleSubmit(onSubmit)} className='w-full space-y-4'>
                  <CardContent className='w-full '>
                    <div className='flex flex-col gap-4'>
                      <SelectInput name={'printSelection'} selectItems={printSelectionOptions} form={formCollege} label={'Select to print:'} placeholder={'Select to print'} />
                      <SelectInput name={'selectionScope'} selectItems={printSelectionScope} form={formCollege} label={'Select scope:'} placeholder={'Select scope'} />
                      {a === 'Blocks' && b === 'Individual' && (
                        <span className=''>
                          <SelectInput name={'individualSelectionId'} selectItems={blocks || []} form={formCollege} label={'Select Block:'} placeholder={'Select Block'} />
                        </span>
                      )}
                      {a === 'Rooms' && b === 'Individual' && (
                        <span className=''>
                          <SelectInput name={'individualSelectionId'} selectItems={roomData?.rooms || []} form={formCollege} label={'Select room:'} placeholder={'Select room'} />
                        </span>
                      )}
                      {a === 'Subjects' && b === 'Individual' && (
                        <span className=''>
                          <SelectInput name={'individualSelectionId'} selectItems={subsData?.subjects || []} form={formCollege} label={'Select Subject:'} placeholder={'Select Subject'} />
                        </span>
                      )}
                      {a === 'Students' && b === 'Individual' && (
                        <span className=''>
                          <Combobox name={'individualSelectionId'} selectItems={sData?.profiles || []} form={formCollege} label={'Select Student:'} placeholder={'Select Student'} setStudentId={setStudentId} />
                        </span>
                      )}
                      {a === 'Students' && b === 'All' && (
                        <span className=''>
                          <SelectInput name={'studentType'} selectItems={printSelectionStudentType} form={formCollege} label={'Select Student Type:'} placeholder={'Select Student Type'} />
                        </span>
                      )}
                      {a === 'Students' && b === 'All' && c === 'regular' && (
                        <span className=''>
                          <p className='text-muted-foreground text-xs text-red'>Please leave the selection of blocks empty if you want to print overall student</p>
                          <SelectInput name={'individualSelectionId'} selectItems={blocks || []} form={formCollege} label={'Select block:'} placeholder={'Select block'} />
                        </span>
                      )}
                      {a === 'Students' && b === 'All' && c && c !== 'regular' && (
                        <>
                          <span className=''>
                            <p className='text-muted-foreground text-xs text-red'>Please leave the selection of year empty if you want to print overall student</p>
                            <SelectInput name={'year'} selectItems={studentYearData} form={formCollege} label={'Select year:'} placeholder={'Select year'} />
                          </span>
                          <span className=''>
                            <p className='text-muted-foreground text-xs text-red'>Please leave the selection of semester empty if you want to print overall student</p>
                            <SelectInput name={'semester'} selectItems={studentSemesterData} form={formCollege} label={'Select semester:'} placeholder={'Select semester'} />
                          </span>
                        </>
                      )}
                      <SelectInput name={'exportType'} selectItems={exportTypeOption} form={formCollege} label={'Select export type:'} placeholder={'Select export type'} />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className='flex w-full justify-center md:justify-end items-center mt-4'>
                      <Button type='submit' disabled={isUploaded} variant={'destructive'} className='bg-blue-500 hover:bg-blue-700 text-white font-bold'>
                        Submit!
                      </Button>
                    </div>
                  </CardFooter>
                </form>
              </Form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Page;
