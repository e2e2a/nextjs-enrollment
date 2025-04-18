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
  totalCurrent: string | number,
  balance: string | number,
  insurancePayment: boolean,
  insurancePaidInThisSemester: boolean,
  passbookPayment: boolean,
  passbookPaidInThisSemester: boolean,
  departmentalShow: boolean,
  ssgShow: boolean,
  insuranceShow: boolean,
  insuranceAmount: string | number,
  departmentalAmount: string | number,
  passbookAmount: string | number,
  ssgAmount: string | number,
  additionalTotal: string | number,
  additionalTotalBalance: string | number,
  prevBalance: any,
  isScholarshipStart: boolean,
  fileName: string
) => {
  return new Promise<void>(async (resolve, reject) => {
    try {
      if (!data || data?.length === 0) return;

      const doc = new jsPDF({ orientation: 'landscape', format: [310, 310] });
      const pageWidth = doc.internal.pageSize.getWidth();
      let yOffset = 10;

      const student = data?.profileId;
      const capitalize = (str: string) => {
        return str ? str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase()) : '';
      };

      const formattedName = `${
        student?.lastname ? capitalize(student?.lastname) + ',' : ''
      } ${capitalize(student?.firstname ?? '')} ${capitalize(student?.middlename ?? '')}${
        student?.extensionName ? ', ' + capitalize(student?.extensionName) + '.' : ''
      }`
        .replace(/\s+,/g, ',')
        .replace(/(\S),/g, '$1,')
        .replace(/,(\S)/g, ', $1')
        .trim();

      // Function to add header
      const addHeader = async () => {
        const logoPath = '/pdf/pdf-header.png'; // Path to the image in the public folder

        // Load the image as a base64 URL
        const logoImage = await fetch(logoPath)
          .then(response => response.blob()) // Get the image as a Blob
          .then(blob => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string); // Convert to Base64 string
              reader.onerror = reject;
              reader.readAsDataURL(blob); // Read the image as Data URL (Base64)
            });
          })
          .catch(error => {
            console.error('Error loading image:', error);
            return null;
          });

        if (logoImage) {
          const logoWidth = 210; // Adjust width of the logo
          const logoHeight = 70; // Adjust height of the logo
          // Calculate the x position to center the image
          const pageWidth = doc.internal.pageSize.getWidth();
          const xPosition = (pageWidth - logoWidth) / 2; // Center the image horizontally

          // Add the image to the PDF
          doc.addImage(logoImage, 'PNG', xPosition, yOffset, logoWidth, logoHeight);
          yOffset += logoHeight + 5; // Adjust yOffset to avoid overlap with other content
        }

        doc.setFontSize(14);
        doc.text('Student Payment', pageWidth / 2, yOffset, { align: 'center' });
        yOffset += 8;

        doc.setFontSize(12);
        doc.text(`Full Name: ${formattedName}`, 10, yOffset);
        yOffset += 6;

        doc.text(`Department: ${data.courseId?.name || 'N/A'}`, 10, yOffset);
        doc.text(
          `Year: ${data?.studentYear || 'N/A'} - Semester: ${data?.studentSemester || 'N/A'}`,
          pageWidth - 10,
          yOffset,
          { align: 'right' }
        );
        yOffset += 6;

        doc.text(`Block: ${data?.blockTypeId?.section || 'N/A'}`, 10, yOffset);
        doc.text(`Enrollment Status: ${data?.enrollStatus || 'N/A'}`, pageWidth - 10, yOffset, {
          align: 'right',
        });
        yOffset += 6;

        doc.line(10, yOffset, pageWidth - 10, yOffset);
        yOffset += 6;
      };

      // Add the header
      await addHeader();
      // Table 1: Payment Details (Moved up)
      const paymentType = ['Down Payment', 'Prelim', 'Midterm', 'Semi-final', 'Final'];
      const paymentAmount = [
        downPaymentAmount.toFixed(2) || (0).toFixed(2),
        paymentPerTerm.toFixed(2) || (0).toFixed(2),
        paymentPerTerm.toFixed(2) || (0).toFixed(2),
        paymentPerTerm.toFixed(2) || (0).toFixed(2),
        finalPayment.toFixed(2) || (0).toFixed(2),
      ];

      const paymentStatus = showPaymentOfFullPayment
        ? ['PAID', 'PAID', 'PAID', 'PAID', 'PAID']
        : [
            showPaymentOfDownPayment ? 'PAID' : 'UNPAID',
            showPaymentOfPrelim ? 'PAID' : 'UNPAID',
            showPaymentOfMidterm ? 'PAID' : 'UNPAID',
            showPaymentOfSemiFinal ? 'PAID' : 'UNPAID',
            showPaymentOfFinal ? 'PAID' : 'UNPAID',
          ];

      const formattedData = paymentType.map((item, index) => {
        return [item, paymentAmount[index], paymentStatus[index]];
      });
      const prev = prevBalance?.map((balance: any, index: number) => {
        return {
          year: `${balance?.year}-${balance?.semester}`,
          balance: Number(balance?.balanceToShow || 0),
        };
      });
      autoTable(doc, {
        startY: yOffset,
        head: [['Payment Type', 'Amount', 'Status']],
        body: formattedData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        foot: [
          //put here the Outstanding Balance which is the prev variable
          ...(!data?.profileId?.scholarshipId?.amount && !isScholarshipStart && prev.length > 0
            ? prev.map((item: any) => [
                `Outstanding Balance (${item.year})`,
                '',
                item.balance.toFixed(2),
              ])
            : []),
          ...(!data?.profileId?.scholarshipId?.amount && !isScholarshipStart && prev.length > 0
            ? [[`Current Semester Fees`, '', Number(totalCurrent || 0).toFixed(2)]]
            : []),
          [prevBalance?.length > 0 ? 'Overall Total' : 'Total', '', Number(total).toFixed(2)],
          [prevBalance?.length > 0 ? 'Overall Balance' : 'Balance', '', Number(balance).toFixed(2)],
        ],
        footStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      });

      yOffset = (doc as any).lastAutoTable.finalY + 10; // Adjust yOffset for next table

      // Table 2: Additional Fees (Moved down)
      const additionalData = [
        [
          'Departmental Fee',
          Number(departmentalAmount).toFixed(2),
          departmentalShow || showPaymentOfFullPayment ? 'PAID' : 'UNPAID',
        ],
        ...(!insurancePayment || insurancePaidInThisSemester
          ? [
              [
                'Insurance Payment',
                Number(insuranceAmount).toFixed(2),
                insuranceShow ||
                showPaymentOfFullPayment ||
                insurancePayment ||
                insurancePaidInThisSemester
                  ? 'PAID'
                  : 'UNPAID',
              ],
            ]
          : []),
        ...(!passbookPayment || passbookPaidInThisSemester
          ? [
              [
                'Passbook Payment',
                Number(passbookAmount).toFixed(2),
                showPaymentOfFullPayment || passbookPaidInThisSemester ? 'PAID' : 'UNPAID',
              ],
            ]
          : []),
        [
          'SSG Payment',
          Number(ssgAmount).toFixed(2),
          ssgShow || showPaymentOfFullPayment ? 'PAID' : 'UNPAID',
        ],
      ];

      autoTable(doc, {
        startY: yOffset,
        head: [['Payment Type', 'Amount', 'Status']],
        body: additionalData,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 3 },
        foot: [
          ['Total', '', Number(additionalTotal).toFixed(2)],
          ['Balance', '', Number(additionalTotalBalance).toFixed(2)],
        ],
        footStyles: { fillColor: [230, 230, 230], textColor: [0, 0, 0], fontStyle: 'bold' },
        headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
      });
      yOffset = (doc as any).lastAutoTable.finalY + 10;
      const addFooter = async () => {
        const logoPath = '/pdf/signature.png'; // Path to the image in the public folder
        yOffset += 6;
        // Load the image as a base64 URL
        const logoImage = await fetch(logoPath)
          .then(response => response.blob()) // Get the image as a Blob
          .then(blob => {
            return new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result as string); // Convert to Base64 string
              reader.onerror = reject;
              reader.readAsDataURL(blob); // Read the image as Data URL (Base64)
            });
          })
          .catch(error => {
            console.error('Error loading image:', error);
            return null;
          });

        if (logoImage) {
          const logoWidth = 35; // Adjust width of the logo
          const logoHeight = 35; // Adjust height of the logo
          doc.addImage(logoImage, 'PNG', pageWidth - 48, yOffset - 25, logoWidth, logoHeight);
        }
        doc.setFontSize(14);
        doc.text(`Dionelyn D. Gabrinez`, pageWidth - 10, yOffset, {
          align: 'right',
        });
        yOffset += 6;
        doc.setFontSize(11);
        doc.text(`School Cashier`, pageWidth - 20, yOffset, {
          align: 'right',
        });
      };
      await addFooter();
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
