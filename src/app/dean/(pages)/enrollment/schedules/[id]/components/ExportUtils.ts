import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

// Automatically download the PDF
export const exportToPDF = async (data: any, schedules: any, fileName: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      if (!data || data.length === 0) {
        return;
      }

      const doc = new jsPDF({ orientation: 'landscape' });
      const pageWidth = doc.internal.pageSize.getWidth();
      let yOffset = 10; // Adjusted for spacing

      const student = data?.profileId;
      const capitalize = (str: string) => {
        return str ? str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) : '';
      };

      const formattedName = `${student?.lastname ? capitalize(student?.lastname) + ',' : ''} ${capitalize(student.firstname ?? '')} ${capitalize(student?.middlename ?? '')}${student?.extensionName ? ', ' + capitalize(student?.extensionName) + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/(\S),/g, '$1,')
        .replace(/,(\S)/g, ', $1')
        .trim();

      // Function to add a header
      const addHeader = () => {
        doc.setFontSize(14);
        doc.text('Student Schedule', pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;

        doc.setFontSize(12);
        doc.text(`Full Name: ${formattedName}`, 10, yOffset);
        yOffset += 6;

        doc.text(`Department: ${data.courseId?.name || 'N/A'}`, 10, yOffset);
        doc.text(`Year: ${data?.studentYear || 'N/A'} - Semester: ${data?.studentSemester || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.text(`Block: ${data?.blockTypeId?.section || 'N/A'}`, 10, yOffset);
        doc.text(`Enrollment Status: ${data?.enrollStatus || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.line(10, yOffset, pageWidth - 10, yOffset);
        yOffset += 6;
      };

      // Add the first header
      addHeader();

      // Format the schedule data
      const formattedData = schedules.map((item: any) => {
        const teacher = item?.teacherScheduleId?.profileId || item?.teacherScheduleId?.deanId;
        const formattedTeacherName = `${teacher?.lastname ? teacher?.lastname + ',' : ''} ${teacher?.firstname ?? ''} ${teacher?.middlename ?? ''}${teacher?.extensionName ? ', ' + teacher?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',')
          .replace(/(\S),/g, '$1,')
          .replace(/,(\S)/g, ', $1')
          .trim();
          console.log('asdasd', formattedTeacherName)
        return [
          item?.teacherScheduleId?.blockTypeId?.section ?? 'N/A',
          item?.teacherScheduleId?.subjectId?.subjectCode ?? 'N/A',
          item?.teacherScheduleId?.subjectId?.name ?? 'N/A',
          item?.teacherScheduleId?.subjectId?.lec ?? 'N/A',
          item?.teacherScheduleId?.subjectId?.lab ?? 'N/A',
          item?.teacherScheduleId?.subjectId?.unit ?? 'N/A',
          item?.teacherScheduleId?.days ?? 'N/A',
          item?.teacherScheduleId?.startTime ?? 'N/A',
          item?.teacherScheduleId?.endTime ?? 'N/A',
          formattedTeacherName,
          item?.firstGrade ?? 'N/A',
          item?.secondGrade ?? 'N/A',
          item?.thirdGrade ?? 'N/A',
          item?.fourthGrade ?? 'N/A',
          item?.averageTotal ?? 'N/A',
        ];
      });

      // Define table headers
      const tableHeaders = [['Block Type', 'Subject Code', 'Descriptive Title', 'Lec', 'Lab', 'Unit/s', 'Days', 'Start Time', 'End Time', 'Instructor', 'Prelim', 'Midterm', 'Semi-final', 'Final', 'Average Total']];

      // Add table
      autoTable(doc, {
        startY: yOffset,
        head: tableHeaders,
        body: formattedData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      });

      // Save as PDF
      const pdfBlob = doc.output('blob');
      saveAs(pdfBlob, `${fileName}.pdf`);
      resolve();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
};
