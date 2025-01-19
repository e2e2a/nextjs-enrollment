import * as XLSX from 'xlsx';

export const generateExcelFile = (data: any[], columns: string[], fileName: string) => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet([columns, ...data]);
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
  XLSX.writeFile(wb, fileName);
};