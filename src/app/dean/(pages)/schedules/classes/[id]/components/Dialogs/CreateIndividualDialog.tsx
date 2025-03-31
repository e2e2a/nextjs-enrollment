'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Icons } from '@/components/shared/Icons';
import { makeToastError, makeToastSucess } from '@/lib/toast/makeToast';
import { useCreateGradeReportMutation } from '@/lib/queries/reportGrade/create';
import CreateAlert from '../Alerts/CreateAlert';
import { Combobox } from '../Fields/Combobox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ReportGradeSingleValidatorInCollege } from '@/lib/validators/reportGrade/individual';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import { selectGradeType } from '@/constant/reportGrade';
import { SelectInput } from '../Fields/SelectInput';
import Input from '../Fields/Input';

interface IProps {
  data: any;
  teacher: any;
}

const CreateIndividualDialog = ({ teacher, data }: IProps) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [studentId, setStudentId] = useState('');
  const mutation = useCreateGradeReportMutation();

  const [grades, setGrades] = useState<any>([]);
  const form = useForm<z.infer<typeof ReportGradeSingleValidatorInCollege>>({
    resolver: zodResolver(ReportGradeSingleValidatorInCollege),
    defaultValues: {
      type: '',
      studentId: '',
      category: 'College',
    },
  });
  //   useEffect(() => {
  //     const initialGrades = data.map((s: any) => ({
  //       profileId: s.profileId?._id,
  //       grade: s.grade,
  //       error: false, // for error messages
  //     }));
  //     setGrades(initialGrades);
  //   }, [data]);

  const handleGradeChange = (index: any, profileId: any, value: any) => {
    value = value.trim();
    let error = false;
    if (isNaN(value) && String(value).toLowerCase() !== 'inc') error = true;

    const updatedGrades = [...grades];
    updatedGrades[index] = { profileId, grade: value, error };
    setGrades(updatedGrades);
  };

  const handleSubmit = async (data: z.infer<typeof ReportGradeSingleValidatorInCollege>) => {
    setIsUploading(true);
    const g = await grades.filter((g: any) => isNaN(g.grade) && String(g.grade).toLowerCase() !== 'inc');
    if (g.length > 0) {
      makeToastError('Only Number/INC are allowed');
      setIsAlertOpen(false);
      setIsUploading(false);
      return;
    }
    const dataa = {
      ...data,
      category: 'College',
      teacherScheduleId: teacher._id,
      reportedGrade: [{ profileId: studentId, grade: data.grade }],
      requestType: 'Individual',
    };

    mutation.mutate(dataa, {
      onSuccess: (res) => {
        switch (res.status) {
          case 200:
          case 201:
          case 203:
            setIsOpen(false);
            makeToastSucess(res?.message);
            return;
          default:
            if (res.error) {
              makeToastError(res.error);
            }
            return;
        }
      },
      onSettled: () => {
        setIsAlertOpen(false);
        setIsUploading(false);
      },
    });
  };
  return (
    <Dialog open={isOpen} modal={true} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size={'sm'} className={`focus-visible:ring-0 w-100 flex mb-2 bg-transparent bg-none text-black hover:bg-green-500 px-2 py-0 gap-x-1 justify-center hover:text-neutral-50 font-medium`}>
          <Icons.add className='h-4 w-4' />
          <span className='flex items-center justify-center'>Create Individual Report Grades</span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className='sm:max-w-6xl max-h-[75%] overflow-y-auto w-full bg-white focus-visible:ring-0 '
        onOpenAutoFocus={(e) => e.preventDefault()}
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle className='flex flex-col space-y-1 sm:text-center'>
            <span>Create Grade Report in</span>
          </DialogTitle>
          <DialogDescription className='' asChild>
            <div className=''>
              <div className='text-orange-500'>Reminder:</div>
              <div className=''>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Empty grades cannot be submitted. If a grade is incomplete, input <span className='text-red'>INC</span>.
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form method='POST' className='space-y-6'>
            <SelectInput label='Grade type' form={form} name={'type'} selectItems={selectGradeType} placeholder='Select Grade type' />
            <Combobox name={'studentId'} selectItems={data} form={form} label={'Select Student:'} placeholder={'Select Student'} setStudentId={setStudentId} />
            <Input name={'grade'} type={'text'} isNotEditable={false} form={form} label={'Grade:'} classNameInput={'uppercase'} />
            <CreateAlert isUploading={isUploading} isAlertOpen={isAlertOpen} setIsAlertOpen={setIsAlertOpen} handleSubmit={form.handleSubmit(handleSubmit)} />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateIndividualDialog;
