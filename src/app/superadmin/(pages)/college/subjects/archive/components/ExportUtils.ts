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
      doc.text('Subject Management', 10, 10);
      yOffset += 10;

      let formattedData: any = [];
      formattedData = data.map((item) => [item?.subjectCode ?? 'N/A', item?.name ?? 'N/A', item?.preReq ?? '', item?.lec ?? 'N/A', item?.lab ?? 'N/A', item?.unit ?? 'N/A']);

      let tableHeaders;
      tableHeaders = [['Subject Code', 'Descriptive Title', 'Pre Req.', 'Lec', 'Lab', 'Unit/s']];

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
export const exportToExcel = (data: any[], fileName: string) => {
  if (!data || data.length === 0) {
    return;
  }

  const formatData = (data: any[]) => {
    return data.map((item) => ({
      'Subject Code': item?.subjectCode ?? 'N/A',
      'Descriptive Title': item?.name ?? 'N/A',
      'Pre Req.': item?.preReq ?? '',
      Lec: item?.lec ?? 'N/A',
      Lab: item?.lab ?? 'N/A',
      'Unit/s': item?.unit ?? 'N/A',
    }));
  };

  const formattedData = formatData(data);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

  saveAs(blob, `${fileName}.xlsx`);
};
