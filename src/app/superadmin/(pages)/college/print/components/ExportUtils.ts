import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Automatically download the PDF
export const exportToPDF = async (data: any[], fileName: string, printSelection: string, selectionScope: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (!data || data.length === 0) {
        return;
      }

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let yOffset = 10;

      // Load image
      const logoPath = '/pdf/pdf-header.png';
      const logoImage = await fetch(logoPath)
        .then((res) => res.blob())
        .then((blob) => {
          return new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        })
        .catch(() => null);

      // Add image
      if (logoImage) {
        const logoWidth = 210;
        const logoHeight = 70;
        const xPosition = (pageWidth - logoWidth) / 2;
        doc.addImage(logoImage, 'PNG', xPosition, yOffset, logoWidth, logoHeight);
        yOffset += logoHeight + 5;
      }

      // Title
      doc.setFontSize(14);
      doc.text('Exported Data', 10, 10);
      yOffset += 10;
      let formattedData: any = [];

      if (printSelection === 'Blocks' && selectionScope === 'All') formattedData = data.map((item) => [item?.section ?? 'N/A', item?.courseId?.name ?? 'N/A', item?.courseId?.courseCode ?? 'N/A']);
      if (printSelection === 'Rooms' && selectionScope === 'All') formattedData = data.map((item) => [item?.educationLevel ?? 'N/A', item?.roomName ?? 'N/A', item?.roomType ?? 'N/A']);
      if (printSelection === 'Subjects') formattedData = data.map((item) => [item?.subjectCode ?? 'N/A', item?.name ?? 'N/A', item?.preReq ?? '', item?.lec ?? 'N/A', item?.lab ?? 'N/A', item?.unit ?? 'N/A']);

      if (printSelection === 'Students' && selectionScope === 'All') {
        formattedData = data.map((item: any) => {
          const student = item?.profileId;
          const formattedName = `${student?.lastname ? student?.lastname + ',' : ''} ${student.firstname ?? ''} ${student?.middlename ?? ''}${student?.extensionName ? ', ' + student?.extensionName + '.' : ''}`
            .replace(/\s+,/g, ',')
            .replace(/(\S),/g, '$1,')
            .replace(/,(\S)/g, ', $1')
            .trim();

          return [
            formattedName,
            item?.courseId?.courseCode ?? 'N/A',
            item?.studentYear ?? 'N/A',
            item?.studentSemester ?? 'N/A',
            item?.studentStatus ?? 'N/A',
            item?.blockTypeId?.section ?? 'N/A',
            item?.studentType ?? 'N/A',
            item?.schoolYear ?? 'N/A',
            item?.studentSubjects?.length ?? '0',
          ];
        });
      }
      if (printSelection === 'Rooms' && selectionScope === 'Individual') {
        // @ts-ignore
        formattedData = data?.schedules.filter((item: any) => item?.blockTypeId && item?.blockTypeId?.section);
        formattedData = formattedData.map((item: any) => {
          const teacher = item?.profileId || item?.deanId;
          const formattedName = `${teacher?.lastname ? teacher?.lastname + ',' : ''} ${teacher.firstname ?? ''} ${teacher?.middlename ?? ''}${teacher?.extensionName ? ', ' + teacher?.extensionName + '.' : ''}`
            .replace(/\s+,/g, ',')
            .replace(/(\S),/g, '$1,')
            .replace(/,(\S)/g, ', $1')
            .trim();

          return [item?.blockTypeId?.section ?? 'N/A', item?.courseId?.courseCode ?? 'N/A', formattedName, item?.subjectId?.subjectCode ?? 'N/A', item?.subjectId?.name ?? 'N/A', item?.days ?? 'N/A', item?.startTime ?? 'N/A', item?.endTime ?? 'N/A'];
        });
      }

      let tableHeaders;
      if (printSelection === 'Blocks' && selectionScope === 'All') tableHeaders = [['Block Type', 'Department', 'Department Code']];
      if (printSelection === 'Rooms' && selectionScope === 'All') tableHeaders = [['Education Level', 'Room Name', 'Room Type']];
      if (printSelection === 'Subjects') tableHeaders = [['Subject Code', 'Descriptive Title', 'Pre Req.', 'Lec', 'Lab', 'Unit/s']];

      if (printSelection === 'Rooms' && selectionScope === 'Individual') tableHeaders = [['Block Type', 'Course Code', 'Instructor', 'Subject Code', 'Descriptive Title	', 'Days', 'Start Time', 'End Time']];
      if (printSelection === 'Students' && selectionScope === 'All') tableHeaders = [['FullName', 'Course Code', 'Student Year', 'Student Semester', 'Student Status', 'Block Type', 'Student Type', 'School Year', 'Subjects Count']];
      autoTable(doc, {
        startY: yOffset,
        head: tableHeaders,
        body: formattedData,
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
export const exportToExcel = (data: any[], fileName: string, printSelection: string, selectionScope: string) => {
  if (!data || data.length === 0) {
    return;
  }

  const formatData = (data: any[], printSelection: string, selectionScope: string) => {
    if (printSelection === 'Blocks' && selectionScope === 'All') {
      return data.map((item) => ({
        'Block Type': item?.section ?? 'N/A',
        Department: item?.courseId?.name ?? 'N/A',
        'Department Code': item?.courseId?.courseCode ?? 'N/A',
      }));
    }
    if (printSelection === 'Rooms' && selectionScope === 'All') {
      return data.map((item) => ({
        'Education Level': item?.educationLevel ?? 'N/A',
        'Room Name': item?.roomName ?? 'N/A',
        'Room Type': item?.roomType ?? 'N/A',
      }));
    }
    if (printSelection === 'Students' && selectionScope === 'All') {
      //@ts-ignore
      return data.map((item: any) => {
        const student = item?.profileId || item?.deanId;
        const formattedName = `${student?.lastname ? student?.lastname + ',' : ''} ${student?.firstname ?? ''} ${student?.middlename ?? ''}${student?.extensionName ? ', ' + student?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',')
          .replace(/(\S),/g, '$1,')
          .replace(/,(\S)/g, ', $1')
          .trim();

        return {
          FullName: formattedName ?? 'N/A',
          'Course Code': item?.courseId?.courseCode ?? 'N/A',
          'Student Year': item?.studentYear ?? 'N/A',
          'Student Semester': item?.studentSemester ?? 'N/A',
          'Student Status': item?.studentStatus ?? 'N/A',
          'Block Type': item?.blockTypeId?.section ?? 'N/A',
          'Student Type': item?.studentType ?? '',
          'School Year': item?.schoolYear ?? 'N/A',
          'Subjects Count': item?.studentSubjects?.length ?? '0',
        };
      });
    }
    if (printSelection === 'Rooms' && selectionScope === 'Individual') {
      //@ts-ignore
      const a = data?.schedules.filter((item: any) => item?.blockTypeId && item?.blockTypeId?.section);
      return a.map((item: any) => {
        const teacher = item?.profileId || item?.deanId;
        const formattedName = `${teacher?.lastname ? teacher?.lastname + ',' : ''} ${teacher?.firstname ?? ''} ${teacher?.middlename ?? ''}${teacher?.extensionName ? ', ' + teacher?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',')
          .replace(/(\S),/g, '$1,')
          .replace(/,(\S)/g, ', $1')
          .trim();

        return {
          'Block Type': item?.blockTypeId?.section ?? 'N/A',
          'Course Code': item?.courseId?.courseCode ?? 'N/A',
          Instructor: formattedName, // Using formattedName correctly
          'Subject Code': item?.subjectId?.subjectCode ?? '',
          'Descriptive Title': item?.subjectId?.name ?? 'N/A',
          Days: item?.days ?? 'N/A',
          'Start Time': item?.startTime ?? 'N/A',
          'End Time': item?.endTime ?? 'N/A',
        };
      });
    }

    if (printSelection === 'Subjects') {
      return data.map((item) => ({
        'Subject Code': item?.subjectCode ?? 'N/A',
        'Descriptive Title': item?.name ?? 'N/A',
        'Pre Req.': item?.preReq ?? '',
        Lec: item?.lec ?? 'N/A',
        Lab: item?.lab ?? 'N/A',
        'Unit/s': item?.unit ?? 'N/A',
      }));
    }
    return [];
  };

  const formattedData = formatData(data, printSelection, selectionScope);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

  saveAs(blob, `${fileName}.xlsx`);
};
