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
      const teacher = data?.profileId || data?.deanId;
      const formattedTeacherName = capitalize(
        `${teacher?.lastname ? teacher?.lastname + ',' : ''}  ${teacher?.firstname ?? ''} ${teacher?.middlename ?? ''} ${teacher?.extensionName ? ', ' + teacher?.extensionName + '.' : ''}`
          .replace(/\s+,/g, ',')
          .replace(/(\S),/g, '$1,')
          .replace(/,(\S)/g, ', $1')
          .trim()
      );
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
        doc.text('Class Management', pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;

        doc.setFontSize(12);
        doc.text(`Instructor: ${formattedTeacherName}`, 10, yOffset);
        doc.text(`Department: ${data?.course?.name || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.setFontSize(12);
        doc.text(`Descriptive Title: ${data?.subject?.name}`, 10, yOffset);
        doc.text(`Time: ${data?.startTime || 'N/A'} - ${data?.endTime || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;
        doc.setFontSize(12);
        doc.text(`Days: ${data?.days}`, 10, yOffset);
        doc.text(`Room: ${data?.room?.roomName || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;
        doc.setFontSize(12);
        doc.text(`Year: ${data?.blockType?.year || 'N/A'} - ${data?.blockType?.semester || 'N/A'}`, 10, yOffset);
        doc.text(`Block Type: ${data?.blockType?.section || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.line(10, yOffset, pageWidth - 10, yOffset);
        yOffset += 6;
      };

      await addHeader();

      const formattedData = data?.studentsInClass?.map((a: any) => {
        const student = a?.student;
        const formattedStudentName = capitalize(
          `${student?.lastname ? student?.lastname + ',' : ''} ${student?.firstname ?? ''} ${student?.middlename ?? ''}${student?.extensionName ? ', ' + student?.extensionName + '.' : ''}`
            .replace(/\s+,/g, ',')
            .replace(/(\S),/g, '$1,')
            .replace(/,(\S)/g, ', $1')
            .trim()
        );
        return [formattedStudentName, student?.sex ?? 'N/A', a?.firstGrade || 'INC', a?.secondGrade || 'INC', a?.thirdGrade || 'INC', a?.fourthGrade || 'INC', a?.averageTotal || ''];
      });

      // Define table headers
      const tableHeaders = [['Student Name', 'Gender', 'Prelim', 'Midterm', 'Semi-final', 'Final', 'Average Total']];

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
