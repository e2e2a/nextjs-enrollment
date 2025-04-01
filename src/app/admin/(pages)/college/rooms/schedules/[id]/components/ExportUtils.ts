import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Automatically download the PDF
export const exportToPDF = async (data: any, fileName: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (!data || data.length === 0) {
        return;
      }

      const doc = new jsPDF();
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
        doc.text(`${data?.roomName}`, pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;

        doc.setFontSize(12);
        doc.text(`Type: ${data?.roomType}`, 10, yOffset);
        yOffset += 6;

        doc.line(10, yOffset, pageWidth - 10, yOffset);
        yOffset += 6;
      };

      await addHeader();

      let formattedData: any = [];

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

      let tableHeaders;
      tableHeaders = [['Block Type', 'Course Code', 'Instructor', 'Subject Code', 'Descriptive Title	', 'Days', 'Start Time', 'End Time']];

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

  const formatData = (data: any[]) => {
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
        Days: Array.isArray(item?.days) ? item.days.join(', ') : item?.days ?? 'N/A',
        'Start Time': item?.startTime ?? 'N/A',
        'End Time': item?.endTime ?? 'N/A',
      };
    });
  };

  const formattedData = formatData(data);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

  saveAs(blob, `${fileName}.xlsx`);
};
