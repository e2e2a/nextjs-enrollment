import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const capitalize = (str: string) => {
  return str ? str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) : '';
};
// Automatically download the PDF
export const exportToPDF = async (data: any, fileName: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (!data || data.length === 0) {
        return;
      }

      const doc = new jsPDF({ orientation: 'landscape' });
      const pageWidth = doc.internal.pageSize.getWidth();
      let yOffset = 10;
      const teacher = data?.teacherId || data?.deanId;
      const formattedTeacherName = capitalize(
        `${teacher?.lastname ? teacher?.lastname + ',' : ''}  ${teacher?.firstname ?? ''} ${teacher?.middlename ?? ''} ${teacher?.extensionName ? ', ' + teacher?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',')
          .replace(/(\S),/g, '$1,')
          .replace(/,(\S)/g, ', $1')
          .trim()
      );
      const addHeader = () => {
        doc.setFontSize(14);
        doc.text('Individual Grades Report Management', pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;

        doc.setFontSize(12);
        doc.text(`Instructor: ${formattedTeacherName}`, 10, yOffset);
        doc.text(`Department: ${data?.teacherScheduleId?.courseId?.name || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.setFontSize(12);
        doc.text(`Descriptive Title: ${data?.teacherScheduleId?.subjectId?.name}`, 10, yOffset);
        doc.text(`Time: ${data?.startTime || 'N/A'} - ${data?.endTime || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;
        doc.setFontSize(12);
        doc.text(`Days: ${data?.teacherScheduleId?.days}`, 10, yOffset);
        doc.text(`Room: ${data?.teacherScheduleId?.roomId?.roomName || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;
        doc.setFontSize(12);
        doc.text(`Year: ${data?.teacherScheduleId?.blockTypeId?.year || 'N/A'} - ${data?.teacherScheduleId?.blockTypeId?.semester || 'N/A'}`, 10, yOffset);
        doc.text(`Block Type: ${data?.teacherScheduleId?.blockTypeId?.section || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;
        doc.setFontSize(12);
        doc.text(`Request Type: ${data?.requestType}`, 10, yOffset);
        doc.text(`Type: ${data?.type || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;
        doc.text(`Status: ${data?.statusInDean}`, 10, yOffset);
        doc.text(`Verify: ${data?.evaluated ? 'Verified' : 'Not Verified'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.line(10, yOffset, pageWidth - 10, yOffset);
        yOffset += 6;
      };

      addHeader();
      const formattedData = data?.reportedGrade?.map((a: any) => {
        const student = a?.profileId;
        const formattedStudentName = capitalize(
          `${student?.lastname ? student?.lastname + ',' : ''} ${student?.firstname ?? ''} ${student?.middlename ?? ''}${student?.extensionName ? ', ' + student?.extensionName + '.' : ''}`
            .replace(/\s+,/g, ',')
            .replace(/(\S),/g, '$1,')
            .replace(/,(\S)/g, ', $1')
            .trim()
        );
        return [formattedStudentName, student?.sex ?? 'N/A', a?.grade || 'INC'];
      });

      // Define table headers
      const tableHeaders = [['Student Name', 'Gender', 'Grade']];

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
export const exportToExcel = (data: any, fileName: string) => {
  if (!data || data.length === 0) {
    return;
  }

  const formattedData = data?.reportedGrade?.map((a: any) => {
    const student = a?.profileId;
    const formattedStudentName = capitalize(
      `${student?.lastname ? student?.lastname + ',' : ''} ${student?.firstname ?? ''} ${student?.middlename ?? ''} ${student?.extensionName ? ', ' + student?.extensionName + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/(\S),/g, '$1,')
        .replace(/,(\S)/g, ', $1')
        .trim()
    );
    return {
      'Student Name': formattedStudentName,
      Gender: student?.sex ?? 'N/A',
      Grade: a?.grade ?? 'INC',
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
