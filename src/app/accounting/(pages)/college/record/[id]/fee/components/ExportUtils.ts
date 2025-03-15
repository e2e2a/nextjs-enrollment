import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

// Automatically download the PDF
export const exportToPDF = async (
  data: any,
  downPaymentAmount: Number,
  paymentPerTerm: Number,
  finalPayment: Number,
  showPaymentOfFullPayment: Boolean,
  showPaymentOfDownPayment: Boolean,
  showPaymentOfPrelim: Boolean,
  showPaymentOfMidterm: Boolean,
  showPaymentOfSemiFinal: Boolean,
  showPaymentOfFinal: Boolean,
  total: String | Number,
  balance: String | Number,
  fileName: string
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      if (!data || data.length === 0) {
        return;
      }

      const doc = new jsPDF({ orientation: 'landscape' });
      const pageWidth = doc.internal.pageSize.getWidth();
      let yOffset = 10;

      const student = data?.profileId;
      const capitalize = (str: string) => {
        return str ? str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase()) : '';
      };

      const formattedName = `${student?.lastname ? capitalize(student?.lastname) + ',' : ''} ${capitalize(student?.firstname ?? '')} ${capitalize(student?.middlename ?? '')}${student?.extensionName ? ', ' + capitalize(student?.extensionName) + '.' : ''}`
        .replace(/\s+,/g, ',')
        .replace(/(\S),/g, '$1,')
        .replace(/,(\S)/g, ', $1')
        .trim();

      // Function to add a header
      const addHeader = () => {
        doc.setFontSize(14);
        doc.text('Student Payment', pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;

        doc.setFontSize(12);
        doc.text(`Full Name: ${formattedName}`, 10, yOffset);
        yOffset += 6;

        doc.text(`Department: ${data?.course || 'N/A'}`, 10, yOffset);
        doc.text(`Year: ${data?.studentYear || 'N/A'} - Semester: ${data?.studentSemester || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.text(`Block: ${data?.blockType?.section || 'N/A'}`, 10, yOffset);
        doc.text(`Enrollment Status: ${data?.enrollStatus || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.line(10, yOffset, pageWidth - 10, yOffset);
        yOffset += 6;
      };

      // Add the first header
      addHeader();

      // Format the schedule data
      let formattedData;
      if (!showPaymentOfFullPayment) {
        const paymentType = ['Down Payment', 'Prelim', 'Midterm', 'Semi-final', 'Final'];
        const paymentAmount = [downPaymentAmount.toFixed(2) || (0).toFixed(2), paymentPerTerm.toFixed(2) || (0).toFixed(2), paymentPerTerm.toFixed(2) || (0).toFixed(2), paymentPerTerm.toFixed(2) || (0).toFixed(2), finalPayment.toFixed(2) || (0).toFixed(2)];
        const paymentStatus = [showPaymentOfDownPayment ? 'PAID' : 'UNPAID', showPaymentOfPrelim ? 'PAID' : 'UNPAID', showPaymentOfMidterm ? 'PAID' : 'UNPAID', showPaymentOfSemiFinal ? 'PAID' : 'UNPAID', showPaymentOfFinal ? 'PAID' : 'UNPAID'];
        formattedData = paymentType.map((item: any, index: number) => {
          return [item, paymentAmount[index], paymentStatus[index]];
        });
      } else {
        const paymentType = ['Down Payment', 'Prelim', 'Midterm', 'Semi-final', 'Final'];
        const paymentAmount = [downPaymentAmount.toFixed(2) || (0).toFixed(2), paymentPerTerm.toFixed(2) || (0).toFixed(2), paymentPerTerm.toFixed(2) || (0).toFixed(2), paymentPerTerm.toFixed(2) || (0).toFixed(2), finalPayment.toFixed(2) || (0).toFixed(2)];
        const paymentStatus = ['PAID', 'PAID', 'PAID', 'PAID', 'PAID'];
        formattedData = paymentType.map((item: any, index: number) => {
          return [item, paymentAmount[index], paymentStatus[index]];
        });
      }

      // Define table headers
      const tableHeaders = [['Payments Type', 'Amount', 'Status']];

      // Add table
      autoTable(doc, {
        startY: yOffset,
        head: tableHeaders,
        body: formattedData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        foot: [
          ['Total', '', Number(total).toFixed(2)],
          ['Balance', '', Number(balance).toFixed(2)],
        ],
        footStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
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
