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
      doc.text(`Temporary Enrolled Management`, 10, 10);
      yOffset += 10;
      let formattedData: any = [];

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

      let tableHeaders;
      tableHeaders = [['FullName', 'Course Code', 'Student Year', 'Student Semester', 'Student Status', 'Block Type', 'Student Type', 'School Year', 'Subjects Count']];

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
export const exportToExcel = (data: any, fileName: string) => {
  if (!data || data.length === 0) {
    return;
  }

  const formatData = (data: any) => {
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
  };

  const formattedData = formatData(data);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

  saveAs(blob, `${fileName}.xlsx`);
};
