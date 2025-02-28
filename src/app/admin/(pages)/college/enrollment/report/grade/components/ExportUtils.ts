import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Automatically download the PDF
export const exportToPDF = async (data: any[], fileName: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (!data || data.length === 0) {
        return;
      }

      const doc = new jsPDF({ orientation: 'landscape' });
      const pageWidth = doc.internal.pageSize.getWidth();
      let yOffset = 10;
      const addHeader = () => {
        doc.setFontSize(14);
        doc.text('Class Grades Report Management', pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;

        doc.setFontSize(12);
        doc.text(`Department: ${data[0]?.courseId?.name}`, 10, yOffset);
        doc.text(`School Year: ${data[0]?.schoolYear || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.line(10, yOffset, pageWidth - 10, yOffset);
        yOffset += 6;
      };

      addHeader();
      const formattedData = data.map((a: any) => {
        const item = a?.teacherScheduleId;
        const teacher = a?.teacherId || a?.deanId;
        const formattedTeacherName = `${teacher?.lastname ? teacher?.lastname + ',' : ''} ${teacher?.firstname ?? ''} ${teacher?.middlename ?? ''}${teacher?.extensionName ? ', ' + teacher?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',')
          .replace(/(\S),/g, '$1,')
          .replace(/,(\S)/g, ', $1')
          .trim();
        return [
          formattedTeacherName,
          item?.courseId?.courseCode ?? 'N/A',
          item?.blockTypeId?.section ?? 'N/A',
          item?.subjectId?.subjectCode ?? 'N/A',
          item?.subjectId?.name ?? 'N/A',
          item?.blockTypeId?.year ?? 'N/A',
          item?.blockTypeId?.semester ?? 'N/A',
          a?.type ?? 'N/A',
          a?.schoolYear ?? 'N/A',
          a?.requestType ?? 'N/A',
          a?.statusInDean ?? 'N/A',
          a?.evaluated ? 'Verified' : 'Not Verified',
        ];
      });

      // Define table headers
      const tableHeaders = [['Instructor', 'Course Code', 'Block Type', 'Subject Code', 'Descriptive Title', 'Year', 'Semester', 'Type', 'School Year', 'Request Type', 'Approved By Dean', 'Verify']];

      autoTable(doc, {
        startY: yOffset,
        head: tableHeaders,
        body: formattedData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      });

      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, `${fileName}.pdf`);
      resolve();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};

// ✅ Export as Excel (Same Format as PDF)
export const exportToExcel = (data: any[], fileName: string) => {
  if (!data || data.length === 0) {
    return;
  }

  const formattedData = data.map((a: any) => {
    const item = a?.teacherScheduleId;
    const teacher = a?.teacherId || a?.deanId;
    const formattedTeacherName = `${teacher?.lastname ? teacher?.lastname + ',' : ''} ${teacher?.firstname ?? ''} ${teacher?.middlename ?? ''}${teacher?.extensionName ? ', ' + teacher?.extensionName + '.' : ''}`
      .replace(/\s+,/g, ',')
      .replace(/(\S),/g, '$1,')
      .replace(/,(\S)/g, ', $1')
      .trim();

    return {
      Instructor: formattedTeacherName,
      'Course Code': item?.courseId?.courseCode ?? 'N/A',
      'Block Type': item?.blockTypeId?.section ?? 'N/A',
      'Subject Code': item?.subjectId?.subjectCode ?? 'N/A',
      'Descriptive Title': item?.subjectId?.name ?? 'N/A',
      Year: item?.blockTypeId?.year ?? 'N/A',
      Semester: item?.blockTypeId?.semester ?? 'N/A',
      Type: a?.type ?? 'N/A',
      'School Year': a?.schoolYear ?? 'N/A',
      'Request Type': a?.requestType ?? 'N/A',
      'Approved By Dean': a?.statusInDean ?? 'N/A',
      Verify: a?.evaluated ? 'Verified' : 'Not Verified',
    };
  });

  // Create worksheet and workbook
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Individual Grades Report');

  // Generate and save the Excel file
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

  saveAs(blob, `${fileName}.xlsx`);
};
