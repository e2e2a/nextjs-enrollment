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
      let yOffset = 10; // Adjusted for spacing

      const addHeader = () => {
        doc.setFontSize(14);
        doc.text('Courses Management', pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;

        doc.line(10, yOffset, pageWidth - 10, yOffset);
        yOffset += 6;
      };

      // Add the first header
      addHeader();
      let formattedData: any = [];
      formattedData = data.map((item: any) => [item?.name ?? 'N/A', item?.courseCode ?? 'N/A']);

      let tableHeaders;
      tableHeaders = [['Department Name', 'Department Code']];

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

  const formatData = (data: any) => {
    return data.map((item: any) => ({
      'Department Name': item?.name ?? 'N/A',
      'Department Code': item?.courseCode ?? 'N/A',
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
