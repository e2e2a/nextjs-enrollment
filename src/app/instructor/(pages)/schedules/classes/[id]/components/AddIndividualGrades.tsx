'use client';
import React, { useEffect, useState } from 'react';
import CreateIndividualDialog from './Dialogs/CreateIndividualDialog';

interface IProps {
  data: any;
  teacher: any;
}

const AddIndividualGrades = ({ teacher, data }: IProps) => {
  return <CreateIndividualDialog teacher={teacher} data={data} />;
};

export default AddIndividualGrades;
