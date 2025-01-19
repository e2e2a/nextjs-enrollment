'use client';
import React from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DropdownMenuCheckboxItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const PdfButton = () => {
  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    // Add a title
    doc.setFontSize(16);
    doc.text('Student Grades Report', 10, 10);

    // Add a subtitle
    doc.setFontSize(12);
    doc.text('Generated on: ' + new Date().toLocaleDateString(), 10, 20);

    // Add a table
    const tableColumns = ['Student Name', 'Subject', 'Grade'];
    const tableRows = [
      ['Alice Johnson', 'Math', 'A'],
      ['Bob Smith', 'Science', 'B+'],
      ['Charlie Brown', 'History', 'A-'],
    ];

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 30,
    });

    // Download the PDF
    doc.save('report.pdf');
  };

  return (
    <DropdownMenuCheckboxItem className='capitalize'>
      <Button className='' onClick={handleDownloadPDF}>
        Export as PDF
      </Button>
    </DropdownMenuCheckboxItem>
  );
};

export default PdfButton;
