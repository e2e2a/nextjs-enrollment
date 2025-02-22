import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Automatically download the PDF
export const exportToPDF = async (data: any[], fileName: string, printSelection: string) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (!data || data.length === 0) {
        console.error('exportToPDF Error: No data to export');
        return reject(new Error('No data available for export.'));
      }

      const doc = new jsPDF();
      doc.text('Exported Data', 10, 10);
      let formattedData: any = [];

      if (printSelection === 'Blocks') {
        formattedData = data.map((item) => [item?.section ?? 'N/A', item?.courseId?.name ?? 'N/A', item?.courseId?.courseCode ?? 'N/A']);
      }
      console.log('ahjgl', formattedData);
      const tableHeaders = [['Block Type', 'Department', 'Department Code']]; // Error occurs here if data[0] is undefined

      autoTable(doc, {
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
export const exportToExcel = (data: any[], fileName: string, printSelection: string) => {
  if (!data || data.length === 0) {
    console.error('exportToExcel Error: No data to export');
    return;
  }

  // 📌 Format the data before export (Used for both PDF & Excel)
  const formatData = (data: any[], printSelection: string) => {
    if (printSelection === 'Blocks') {
      return data.map((item) => ({
        'Block Type': item?.section ?? 'N/A',
        Department: item?.courseId?.name ?? 'N/A',
        'Department Code': item?.courseId?.courseCode ?? 'N/A',
      }));
    }
    return [];
  };

  const formattedData = formatData(data, printSelection);
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8' });

  saveAs(blob, `${fileName}.xlsx`);
};
