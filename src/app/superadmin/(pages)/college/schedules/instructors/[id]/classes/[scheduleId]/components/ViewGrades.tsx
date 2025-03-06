'use client';
import React, { useEffect, useState } from 'react';
import ViewDialog from './Dialogs/ViewDialog';
// import FilterBySelect from './FilterBySelect';

interface IProps {
  data: any;
  teacher: any;
  type: string;
  reportGrades: any;
}

const ViewGrades = ({ teacher, data, type, reportGrades }: IProps) => {
  const [firstGrade, setFirstGrade] = useState<any | null>(null);
  const [secondGrade, setSecondGrade] = useState<any | null>(null);
  const [thirdGrade, setthirdGrade] = useState<any | null>(null);
  const [fourthGrade, setFourthGrade] = useState<any | null>(null);

  useEffect(() => {
    if (!reportGrades || reportGrades.length === 0) {
      setFirstGrade(null);
      setSecondGrade(null);
      setthirdGrade(null);
      setFourthGrade(null);
      return;
    }

    const found1 = reportGrades.find((e: any) => teacher?._id === e.teacherScheduleId._id && e.type === 'firstGrade' && e.statusInDean === 'Approved');
    const found2 = reportGrades.find((e: any) => teacher?._id === e.teacherScheduleId._id && e.type === 'secondGrade' && e.statusInDean === 'Approved');
    const found3 = reportGrades.find((e: any) => teacher?._id === e.teacherScheduleId._id && e.type === 'thirdGrade' && e.statusInDean === 'Approved');
    const found4 = reportGrades.find((e: any) => teacher?._id === e.teacherScheduleId._id && e.type === 'fourthGrade' && e.statusInDean === 'Approved');

    setFirstGrade(found1 || null);
    setSecondGrade(found2 || null);
    setthirdGrade(found3 || null);
    setFourthGrade(found4 || null);
  }, [reportGrades, teacher, type]);

  return (
    <>
      {firstGrade && firstGrade.type && <ViewDialog teacher={teacher} data={data} type={'firstGrade'} reportGrades={firstGrade} />}
      {secondGrade && secondGrade.type && <ViewDialog teacher={teacher} data={data} type={'secondGrade'} reportGrades={secondGrade} />}
      {thirdGrade && thirdGrade.type && <ViewDialog teacher={teacher} data={data} type={'thirdGrade'} reportGrades={thirdGrade} />}
      {fourthGrade && fourthGrade.type && <ViewDialog teacher={teacher} data={data} type={'fourthGrade'} reportGrades={fourthGrade} />}
    </>
  );
};

export default ViewGrades;
