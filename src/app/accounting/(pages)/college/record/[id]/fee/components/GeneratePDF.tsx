import jsPDF from 'jspdf';
import { saveAs } from 'file-saver';

export const GeneratePDF = async (data: any, fileName: string) => {
  return new Promise<void>((resolve, reject) => {
    try {
      const doc = new jsPDF({ orientation: 'portrait' });
      const pageWidth = doc.internal.pageSize.getWidth();
      let yOffset = 10;

      // Function to capitalize the first letter of each word
      const capitalize = (str: string) => {
        return str ? str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) : '';
      };

      // Function to add a header
      const addHeader = () => {
        doc.setFontSize(18);
        doc.text('SUMMARY', 10, yOffset);
        yOffset += 8;

        doc.setFontSize(12);
        doc.text('Department: Bachelor Science in Computer', 10, yOffset);
        yOffset += 10;

        doc.line(10, yOffset, pageWidth - 10, yOffset); // Line separator
        yOffset += 6;
      };

      // Add header
      addHeader();

      // First section data
      const summaryData = [['REG/MISC', data?.regmiscAmount], ['TUITION FEE', data?.tuitionFeeAmount], ['LAB FEE', data?.labFeeAmount], ...(data?.cwtsOrNstpFee ? [['CWTS/NSTP', data?.cwtsOrNstpFee]] : []), ['Total', data?.totalAmount]];

      // Render first section
      summaryData.forEach(([label, value]) => {
        doc.setFontSize(12);
        doc.text(label, 10, yOffset);
        doc.text(value, pageWidth - 30, yOffset, { align: 'right' });
        yOffset += 8;
      });

      yOffset += 6;

      // 1 Year Payment Section
      doc.setFontSize(14);
      doc.text('1 YEAR PAYMENT', 10, yOffset);

      // "REQUIRED" in red color next to the header
      doc.setTextColor(255, 0, 0);
      doc.text('(REQUIRED)', 60, yOffset);

      // Reset text color to black
      doc.setTextColor(0, 0, 0);
      yOffset += 8;

      // Note Section
      doc.setFontSize(10);
      doc.text('Note: This is only for new students and it will automatically have a payment if the student has not paid yet.', 10, yOffset);
      yOffset += 10;

      // Second section data
      const oneYearPaymentData = [
        ['Departmental Fee', data?.departmentalFeeAmount],
        ['SSG Fee', data?.ssgFeeAmount],
        ['Total', data?.total1YearFeeAmount],
      ];

      // Render second section
      oneYearPaymentData.forEach(([label, value]) => {
        doc.setFontSize(12);
        doc.text(label, 10, yOffset);
        doc.text(value, pageWidth - 30, yOffset, { align: 'right' });
        yOffset += 8;
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
