import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Export Curriculum Data to PDF
export const exportToPDF = async (data: any, fileName: string) => {
  if (!data || !data.curriculum || data.curriculum.length === 0) {
    console.error('No curriculum data available');
    return;
  }

  const doc = new jsPDF();
  doc.setFont('helvetica', 'bold');

  // Course Title
  doc.setFontSize(16);
  doc.text(data?.courseId?.name || 'Course Name', 105, 15, { align: 'center' });

  let yOffset = 30;

  // Loop through each curriculum entry
  data.curriculum.forEach((curriculumItem: any) => {
    // Add Year and Semester Title
    doc.setFontSize(14);
    doc.text(`${curriculumItem.year} - ${curriculumItem.semester}`, 105, yOffset, { align: 'center' });
    yOffset += 5;

    // Define table headers
    const tableHeaders = [[ 'Subject Code', 'Descriptive Title', 'Pre. Req.', 'Lec', 'Lab', 'Unit/s']];

    // Format the subject data
    const formattedData = curriculumItem.subjectsFormat.map((subjectItem: any) => [
      subjectItem?.subjectId?.subjectCode ?? 'N/A',
      subjectItem?.subjectId?.name ?? 'N/A',
      subjectItem?.subjectId?.preReq ?? 'N/A',
      subjectItem?.subjectId?.lec ?? 'N/A',
      subjectItem?.subjectId?.lab ?? 'N/A',
      subjectItem?.subjectId?.unit ?? 'N/A',
    ]);

    // Generate the table
    autoTable(doc, {
      startY: yOffset,
      head: tableHeaders,
      body: formattedData,
      theme: 'grid',
      styles: { fontSize: 10 },
      headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255] },
    });

    // Adjust yOffset to avoid overlapping tables
    yOffset = (doc as any).lastAutoTable.finalY + 10;
  });

  // Save the PDF
  doc.save(`${fileName}.pdf`);
};

