'use client';
import React, { useEffect, useState } from 'react';
import CreateDialog from './Dialogs/CreateDialog';
import ViewDialog from './Dialogs/ViewDialog';
// import FilterBySelect from './FilterBySelect';

interface IProps {
  data: any;
  teacher: any;
  type: string;
  reportGrades: any;
}

const AddGrades = ({ teacher, data, type, reportGrades }: IProps) => {
  const [fiteredType, setFiteredType] = useState<any | null>(null);

  useEffect(() => {
    if (!reportGrades || reportGrades.length === 0) {
      setFiteredType(null);
      return;
    }

    const found = reportGrades.find((e: any) => teacher?._id === e.teacherScheduleId._id && e.type === type);

    setFiteredType(found || null);
  }, [reportGrades, teacher, type]);

  return <>{fiteredType && fiteredType.type ? <ViewDialog teacher={teacher} data={data} type={type} reportGrades={fiteredType} /> : <CreateDialog teacher={teacher} data={data} type={type} />}</>;
};

export default AddGrades;
