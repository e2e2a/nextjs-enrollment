"use client"
import React from 'react';
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { generateExcelFile } from '@/utils/views/excelUtils';

const ExcelButton = () => {
  const handleDownloadExcel = () => {
    // Define student grades data
    const columns = ['Student Name', 'Subject', 'Grade'];
    const data = [
      ['Alice Johnson', 'Math', 'A'],
      ['Bob Smith', 'Science', 'B+'],
      ['Charlie Brown', 'History', 'A-'],
    ];

    // Generate and download the Excel file for student grades
    generateExcelFile(data, columns, 'student_grades_report.xlsx');
  };

  return (
    <DropdownMenuCheckboxItem className='capitalize'>
      <Button onClick={handleDownloadExcel}>
        Export as Excel
      </Button>
    </DropdownMenuCheckboxItem>
  );
};

export default ExcelButton;
