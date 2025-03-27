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
        doc.text('COURSE FEE SUMMARY', 10, yOffset);
        yOffset += 8;

        doc.setFontSize(12);
        doc.text(`Department: ${data?.tFee?.courseId?.name}`, 10, yOffset);
        doc.text(`Year: ${data?.tFee?.year}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 10;

        doc.line(10, yOffset, pageWidth - 10, yOffset); // Line separator
        yOffset += 6;
      };

      // Add header
      addHeader();

      // First section data
      const summaryData = [
        ['REG/MISC', data?.regmiscAmount],
        ['TUITION FEE', data?.tuitionFeeAmount],
        ['LAB FEE', data?.labFeeAmount],
        ...(data?.cwtsOrNstpFeeAmount > 0 ? [['CWTS/NSTP', data?.cwtsOrNstpFeeAmount]] : []),
        ...(data?.ojtFeeAmount ? [['OJT FEE', data?.ojtFeeAmount]] : []),
        ['Total', data?.totalAmount],
      ];

      // Render first section
      summaryData.forEach(([label, value]) => {
        doc.setFontSize(12);
        doc.text(label, 10, yOffset);
        doc.text(String(value ?? ''), pageWidth - 30, yOffset, { align: 'right' });
        yOffset += 8;
      });

      yOffset += 6;

      // 1 Year Payment Section
      doc.setFontSize(14);
      doc.text('ADDITIONAL PAYMENT', 10, yOffset);

      // "REQUIRED" in red color next to the header
      doc.setTextColor(255, 0, 0);
      doc.text('(REQUIRED)', 65, yOffset);

      // Reset text color to black
      doc.setTextColor(0, 0, 0);
      yOffset += 8;

      // Note Section
      doc.setFontSize(10);
      const noteText = 'Note:  The Departmental Fee is required each semester, the Insurance Fee once per year, and the SSG Fee only for the first two payments of an academic year. The Passbook Fee is a one-time payment.';

      // Define a max width for the text to wrap properly
      const textLines = doc.splitTextToSize(noteText, 180); // Adjust width as needed

      doc.text(textLines, 10, yOffset);

      yOffset += 20;

      // Second section data
      const oneYearPaymentData = [
        ['Departmental Fee', data?.tFee?.departmentalFee],
        ...(data.insuranceBoolean ? [['Insurance Fee', data?.tFee?.insuranceFee]] : []),
        ...(data.passbookBoolean ? [['Passbook Fee', data?.tFee?.passbookFee]] : []),
        ['SSG Fee', data?.tFee?.ssgFee],
        ['Total', (Number(data?.tFee?.departmentalFee || 0) + Number(data?.tFee?.ssgFee || 0) + Number(data.insuranceBoolean ? data?.tFee?.insuranceFee || 0 : 0) + Number(data.passbookBoolean ? data?.tFee?.passbookFee || 0 : 0)).toFixed(2)],
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
