'use client';
// import jsPDF from 'jspdf';
import React, { useEffect, useState } from 'react';
// import { renderToStaticMarkup } from 'react-dom/server';
// import PdfContent from './Content';

export default function Page() {
  const [send, setSend] = useState(true);
  const generatePDF = async () => {
    // Render the PdfContent component to a static HTML string
    // const contentString = renderToStaticMarkup(<PdfContent />);

    // // Create a new PDF document
    // const pdf = new jsPDF({
    //   orientation: 'portrait',
    //   unit: 'px',
    //   format: [816, 1344], // Legal size in pixels at 96 dpi
    // });

    // // Use the HTML string to add content to the PDF
    // pdf.html(contentString, {
    //   callback: function (pdf) {
    //     // pdf.save('download.pdf');
    //     pdf.autoPrint();
    //     window.open(pdf.output('bloburl'));
    //   },
    //   x: 10,
    //   y: 10,
    //   width: 796,
    //   windowWidth: 816,
    // });
  };
  useEffect(() => {
    if (send) {
      setSend(false);
      generatePDF();
    }
  }, [send]);
  return (
    <div>
      <button onClick={generatePDF}>Download as PDF</button>
    </div>
  );
}
