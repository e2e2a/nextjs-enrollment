import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Automatically download the PDF
export const exportToPDF = async (data: any, schedules: any, fileName: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (!data || data.length === 0) {
        return;
      }

      const doc = new jsPDF({ orientation: 'landscape' });
      const pageWidth = doc.internal.pageSize.getWidth();
      let yOffset = 10;

      const addHeader = async () => {
        const logoPath = '/pdf/pdf-header.png';

        const logoImage = await fetch(logoPath)
          .then((response) => response.blob())
          .then((blob) => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          })
          .catch((error) => {
            console.error('Error loading image:', error);
            return null;
          });

        if (logoImage) {
          const logoWidth = 210;
          const logoHeight = 70;
          const pageWidth = doc.internal.pageSize.getWidth();
          const xPosition = (pageWidth - logoWidth) / 2;

          doc.addImage(logoImage, 'PNG', xPosition, yOffset, logoWidth, logoHeight);
          yOffset += logoHeight + 5;
        }

        doc.setFontSize(14);
        doc.text('Block Schedule', pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;

        doc.setFontSize(12);
        doc.text(`Department: ${data?.blockType?.courseId?.name}`, 10, yOffset);
        doc.text(`Year: ${data?.blockType?.year || 'N/A'} - Semester: ${data?.blockType?.semester || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.line(10, yOffset, pageWidth - 10, yOffset);
        yOffset += 6;
      };

      await addHeader();

      const formattedData = schedules.map((a: any) => {
        const item = a?.teacherScheduleId;
        const teacher = item?.profileId || item?.deanId;
        const formattedTeacherName = `${teacher?.lastname ? teacher?.lastname + ',' : ''} ${teacher?.firstname ?? ''} ${teacher?.middlename ?? ''}${teacher?.extensionName ? ', ' + teacher?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',')
          .replace(/(\S),/g, '$1,')
          .replace(/,(\S)/g, ', $1')
          .trim();
        return [
          item?.subjectId?.subjectCode ?? 'N/A',
          item?.subjectId?.name ?? 'N/A',
          item?.subjectId?.lec ?? 'N/A',
          item?.subjectId?.lab ?? 'N/A',
          item?.subjectId?.unit ?? 'N/A',
          item?.days ?? 'N/A',
          item?.startTime ?? 'N/A',
          item?.endTime ?? 'N/A',
          item?.roomId?.roomName ?? 'N/A',
          formattedTeacherName,
        ];
      });

      // Define table headers
      const tableHeaders = [['Subject Code', 'Descriptive Title', 'Lec', 'Lab', 'Unit/s', 'Days', 'Start Time', 'End Time', 'Room Name', 'Instructor']];

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

// ✅ Export as Excel (Same Format as PDF)
export const exportToExcel = (data: any, schedules: any, fileName: string) => {
  if (!schedules || schedules.length === 0) {
    return;
  }

  const capitalize = (str: string) => {
    return str ? str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) : '';
  };

  const formatData = (schedules: any) => {
    return schedules.map((a: any) => {
      const item = a?.teacherScheduleId;
      const teacher = item?.profileId || item?.deanId || {};
      const formattedTeacherName = `${teacher?.lastname ? capitalize(teacher?.lastname) + ',' : ''} ${capitalize(teacher?.firstname ?? '')} ${capitalize(teacher?.middlename ?? '')}${
        teacher?.extensionName ? ', ' + capitalize(teacher?.extensionName) + '.' : ''
      }`
        .replace(/\s+,/g, ',')
        .replace(/(\S),/g, '$1,')
        .replace(/,(\S)/g, ', $1')
        .trim();

      return {
        'Subject Code': item?.subjectId?.subjectCode ?? '',
        'Descriptive Title': item?.subjectId?.name ?? 'N/A',
        'Pre Req.': item?.subjectId?.preReq ?? '',
        Lec: item?.subjectId?.lec ?? 'N/A',
        Lab: item?.subjectId?.lab ?? 'N/A',
        'Unit/s': item?.subjectId?.unit ?? 'N/A',
        Days: Array.isArray(item?.days) ? item.days.join(', ') : item?.days ?? 'N/A',
        'Start Time': item?.startTime ?? 'N/A',
        'End Time': item?.endTime ?? 'N/A',
        'Room Name': item?.roomId?.roomName ?? 'N/A',
        Instructor: formattedTeacherName,
      };
    });
  };

  const formattedData = formatData(schedules);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

  saveAs(blob, `${fileName}.xlsx`);
};
