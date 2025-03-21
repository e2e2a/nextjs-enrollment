import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { saveAs } from 'file-saver';

export const exportToPDF = async (
  data: any,
  downPaymentAmount: number,
  paymentPerTerm: number,
  finalPayment: number,
  showPaymentOfFullPayment: boolean,
  showPaymentOfDownPayment: boolean,
  showPaymentOfPrelim: boolean,
  showPaymentOfMidterm: boolean,
  showPaymentOfSemiFinal: boolean,
  showPaymentOfFinal: boolean,
  total: string | number,
  balance: string | number,
  ssgPayment: boolean,
  insurancePayment: boolean,
  ssgPaidInThisSemester: boolean,
  insurancePaidInThisSemester: boolean,
  departmentalShow: boolean,
  ssgShow: boolean,
  insuranceShow: boolean,
  insuranceAmount: string | number,
  departmentalAmount: string | number,
  ssgAmount: string | number,
  additionalTotal: string | number,
  fileName: string
) => {
  return new Promise<void>((resolve, reject) => {
    try {
      if (!data || data.length === 0) return;

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

      // Function to add header
      const addHeader = () => {
        doc.setFontSize(14);
        doc.text('Student Payment', pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;

        doc.setFontSize(12);
        doc.text(`Full Name: ${formattedName}`, 10, yOffset);
        yOffset += 6;

        doc.text(`Department: ${data.courseId?.name || 'N/A'}`, 10, yOffset);
        doc.text(`Year: ${data?.studentYear || 'N/A'} - Semester: ${data?.studentSemester || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.text(`Block: ${data?.blockTypeId?.section || 'N/A'}`, 10, yOffset);
        doc.text(`Enrollment Status: ${data?.enrollStatus || 'N/A'}`, pageWidth - 10, yOffset, { align: 'right' });
        yOffset += 6;

        doc.line(10, yOffset, pageWidth - 10, yOffset);
        yOffset += 6;
      };
      // Add the header
      addHeader();

      const additionalData = [
        ['Down Payment', downPaymentAmount.toFixed(2) || (0).toFixed(2), showPaymentOfDownPayment || showPaymentOfFullPayment ? 'PAID' : 'UNPAID'],
        ['Departmental Fee', Number(departmentalAmount).toFixed(2), departmentalShow || showPaymentOfFullPayment ? 'PAID' : 'UNPAID'],
        ...(!insurancePayment || insurancePaidInThisSemester ? [['Insurance Payment', Number(insuranceAmount).toFixed(2), insuranceShow || showPaymentOfFullPayment || insurancePayment || ssgPaidInThisSemester ? 'PAID' : 'UNPAID']] : []),
        ...(!ssgPayment || ssgPaidInThisSemester ? [['SSG Payment', Number(ssgAmount).toFixed(2), ssgShow || showPaymentOfFullPayment || ssgPayment || ssgPaidInThisSemester ? 'PAID' : 'UNPAID']] : []),
      ];

      autoTable(doc, {
        startY: yOffset,
        head: [['Payment Type', 'Amount', 'Status']],
        body: additionalData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        foot: [['Total', '', Number(additionalTotal).toFixed(2)]],
        footStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      });

      yOffset = (doc as any).lastAutoTable.finalY + 10; // Adjust yOffset for next table

      // Table 2: Payment Details (Moved down)
      const paymentType = ['Prelim', 'Midterm', 'Semi-final', 'Final'];
      const paymentAmount = [paymentPerTerm.toFixed(2) || (0).toFixed(2), paymentPerTerm.toFixed(2) || (0).toFixed(2), paymentPerTerm.toFixed(2) || (0).toFixed(2), finalPayment.toFixed(2) || (0).toFixed(2)];

      const paymentStatus = showPaymentOfFullPayment
        ? ['PAID', 'PAID', 'PAID', 'PAID', 'PAID']
        : [showPaymentOfPrelim ? 'PAID' : 'UNPAID', showPaymentOfMidterm ? 'PAID' : 'UNPAID', showPaymentOfSemiFinal ? 'PAID' : 'UNPAID', showPaymentOfFinal ? 'PAID' : 'UNPAID'];

      const formattedData = paymentType.map((item, index) => {
        return [item, paymentAmount[index], paymentStatus[index]];
      });

      autoTable(doc, {
        startY: yOffset,
        head: [['Payment Type', 'Amount', 'Status']],
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
