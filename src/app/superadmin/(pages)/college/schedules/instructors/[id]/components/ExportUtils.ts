import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
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
      let yOffset = 10; // Adjusted for spacing

      const teacher = data?.profile;
      const capitalize = (str: string) => {
        return str ? str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) : '';
      };

      const formattedName = `${teacher?.lastname ? capitalize(teacher?.lastname) + ',' : ''} ${capitalize(teacher?.firstname ?? '')} ${capitalize(teacher?.middlename ?? '')}${teacher?.extensionName ? ', ' + capitalize(teacher?.extensionName) + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/(\S),/g, '$1,')
        .replace(/,(\S)/g, ', $1')
        .trim();

      // Function to add a header
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
        doc.text('Instructor Schedule', pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;

        doc.setFontSize(12);
        doc.text(`FullName: ${formattedName}`, 10, yOffset);
        yOffset += 6;

        doc.line(10, yOffset, pageWidth - 10, yOffset);
        yOffset += 6;
      };

      // Add the first header
      await addHeader();

      // Format the schedule data
      const formattedData = schedules.map((item: any) => {
        return [
          item?.blockTypeId?.section ?? 'N/A',
          item?.subjectId?.subjectCode ?? 'N/A',
          item?.subjectId?.name ?? 'N/A',
          item?.subjectId?.lec ?? 'N/A',
          item?.subjectId?.lab ?? 'N/A',
          item?.subjectId?.unit ?? 'N/A',
          item?.days ?? 'N/A',
          item?.startTime ?? 'N/A',
          item?.endTime ?? 'N/A',
        ];
      });

      // Define table headers
      const tableHeaders = [['Block Type', 'Subject Code', 'Descriptive Title', 'Lec', 'Lab', 'Unit/s', 'Days', 'Start Time', 'End Time']];

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
