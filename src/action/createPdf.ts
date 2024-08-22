'use server';
import { degrees, PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject, listAll } from 'firebase/storage';
import { storage } from '@/firebase';
import fs from 'fs';
import path from 'path';
import dbConnect from '@/lib/db/db';
export const createPDF = async (checkE: any) => {
  try {
    console.log('createPDF', checkE);
    let mybool = false;
    // Create a new PDF document
    // const pdfDoc = await PDFDocument.create();
    // const page = pdfDoc.addPage([600, 400]);
    // const url = 'https://pdf-lib.js.org/assets/with_update_sections.pdf'
    const url = 'https://nextjs-enrollment.vercel.app/pdf/Annex-5.pdf';
    const existingPdfBytes = await fetch(url).then((res) => res.arrayBuffer());
    const pdfDoca = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoca.embedFont(StandardFonts.TimesRoman);

    const pages = pdfDoca.getPages();
    const firstPage = pages[0];
    const secondPage = pages[1];
    const { width, height } = firstPage.getSize();
    const capitalizeName = (string: string) => {
      const words = string.split(' ');
      if (words.length === 1) {
        return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
      } else {
        return words.map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
      }
    };
    //   first row
    firstPage.drawText(capitalizeName(checkE.profileId.lastname), {
      x: 165,
      y: 537,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    firstPage.drawText(capitalizeName(checkE.profileId.firstname), {
      x: 320,
      y: 537,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    firstPage.drawText(capitalizeName(checkE.profileId.middlename), {
      x: 475,
      y: 537,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    //   2nd row
    firstPage.drawText(capitalizeName(checkE.profileId.numberStreet), {
      x: 165,
      y: 504,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    firstPage.drawText(capitalizeName(checkE.profileId.barangay), {
      x: 320,
      y: 504,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    firstPage.drawText(capitalizeName(checkE.profileId.district), {
      x: 475,
      y: 504,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    //   3rd row
    firstPage.drawText(capitalizeName(checkE.profileId.cityMunicipality), {
      x: 165,
      y: 475,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    firstPage.drawText(capitalizeName(checkE.profileId.province), {
      x: 320,
      y: 475,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    firstPage.drawText(capitalizeName(checkE.profileId.region), {
      x: 475,
      y: 475,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    //   4th row
    firstPage.drawText(capitalizeName(checkE.profileId.emailFbAcc), {
      x: 165,
      y: 446,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    firstPage.drawText(capitalizeName(checkE.profileId.contact), {
      x: 320,
      y: 446,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    firstPage.drawText(capitalizeName(checkE.profileId.nationality), {
      x: 475,
      y: 446,
      size: 10,
      font: helveticaFont,
      // color: rgb(0.95, 0.1, 0.1),
      color: rgb(0, 0, 0),
      // rotate: degrees(-45),
    });
    //sex
    if (checkE.profileId.sex.toLowerCase() === 'male') {
      firstPage.drawLine({
        start: { x: 78, y: 385 },
        end: { x: 72, y: 380 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.sex.toLowerCase() === 'female') {
      firstPage.drawLine({
        start: { x: 78, y: 375 },
        end: { x: 72, y: 370 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    }
    // civil status
    if (checkE.profileId.civilStatus.toLowerCase() === 'single') {
      firstPage.drawLine({
        start: { x: 212, y: 385 },
        end: { x: 206, y: 380 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.civilStatus.toLowerCase() === 'married') {
      firstPage.drawLine({
        start: { x: 212, y: 375 },
        end: { x: 206, y: 370 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.civilStatus.toLowerCase() === 'widow/er') {
      firstPage.drawLine({
        start: { x: 212, y: 365 },
        end: { x: 206, y: 360 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.civilStatus.toLowerCase() === 'separated') {
      firstPage.drawLine({
        start: { x: 212, y: 355 },
        end: { x: 206, y: 350 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    }
    // employment status
    if (checkE.profileId.employmentStatus.toLowerCase() === 'employed') {
      firstPage.drawLine({
        start: { x: 352, y: 384 },
        end: { x: 347, y: 379 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.employmentStatus.toLowerCase() === 'unemployed') {
      firstPage.drawLine({
        start: { x: 352, y: 374 },
        end: { x: 347, y: 369 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.employmentStatus.toLowerCase() === 'self-employed') {
      firstPage.drawLine({
        start: { x: 352, y: 364 },
        end: { x: 347, y: 359 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    }

    // Birthday
    const dateObj = new Date(checkE.profileId.birthday);
    const year = dateObj.getFullYear();
    const monthIndex = dateObj.getMonth(); // expected out is number of months
    const day = dateObj.getDate();

    // Map the month index to the month name
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthName = months[monthIndex];
    firstPage.drawText(monthName, {
      x: 145,
      y: 306,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(String(day), {
      x: 285,
      y: 306,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(String(year), {
      x: 400,
      y: 306,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(String(checkE.profileId.age), {
      x: 512,
      y: 306,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });

    //Birthplace
    firstPage.drawText(capitalizeName(checkE.profileId.birthPlaceCity), {
      x: 143,
      y: 252,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(capitalizeName(checkE.profileId.birthPlaceProvince), {
      x: 310,
      y: 252,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    firstPage.drawText(capitalizeName(checkE.profileId.birthPlaceRegion), {
      x: 463,
      y: 252,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    // education attainment (before the training)
    if (checkE.profileId.educationAttainment.toLowerCase() === 'no grade completed/pre-school') {
      firstPage.drawLine({
        start: { x: 60, y: 217 },
        end: { x: 54, y: 211 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.educationAttainment.toLowerCase() === 'high school graduate') {
      firstPage.drawLine({
        start: { x: 60, y: 191 },
        end: { x: 54, y: 186 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.educationAttainment.toLowerCase() === 'elementary level') {
      firstPage.drawLine({
        start: { x: 185.5, y: 213 },
        end: { x: 179.5, y: 208 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.educationAttainment.toLowerCase() === 'post-secondary level/graduate') {
      firstPage.drawLine({
        start: { x: 185.5, y: 191 },
        end: { x: 179.5, y: 186 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.educationAttainment.toLowerCase() === 'elementary graduate') {
      firstPage.drawLine({
        start: { x: 331, y: 213 },
        end: { x: 325, y: 208 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.educationAttainment.toLowerCase() === 'college level') {
      firstPage.drawLine({
        start: { x: 332, y: 190 },
        end: { x: 326, y: 185 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.educationAttainment.toLowerCase() === 'high school level') {
      firstPage.drawLine({
        start: { x: 458, y: 213 },
        end: { x: 453, y: 207 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.educationAttainment.toLowerCase() === 'college graduate or higher') {
      firstPage.drawLine({
        start: { x: 458, y: 191 },
        end: { x: 453, y: 186 },
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    }
    //learner/trainee/student
    if (checkE.profileId.learnerOrTraineeOrStudentClassification.toLowerCase() === 'persons with disabilities(pwds)') {
      firstPage.drawLine({
        start: { x: 78, y: 140 }, // Starting point of the second line
        end: { x: 72, y: 135 }, // End point of the second line
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.learnerOrTraineeOrStudentClassification.toLowerCase() === 'displaced worker (local)') {
      firstPage.drawLine({
        start: { x: 78, y: 112 }, // Starting point of the second line
        end: { x: 72, y: 107 }, // End point of the second line
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.learnerOrTraineeOrStudentClassification.toLowerCase() === 'ofw') {
      firstPage.drawLine({
        start: { x: 78, y: 96 }, // Starting point of the second line
        end: { x: 72, y: 91 }, // End point of the second line
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.learnerOrTraineeOrStudentClassification.toLowerCase() === 'ofw dependent') {
      firstPage.drawLine({
        start: { x: 78, y: 79 }, // Starting point of the second line
        end: { x: 72, y: 74 }, // End point of the second line
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.learnerOrTraineeOrStudentClassification.toLowerCase() === 'ofw repatriate') {
      //2nd col
      firstPage.drawLine({
        start: { x: 210, y: 132 }, // Starting point of the second line
        end: { x: 204, y: 126 }, // End point of the second line
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.learnerOrTraineeOrStudentClassification.toLowerCase() === 'victims/survivors of human trafficking') {
      firstPage.drawLine({
        start: { x: 210, y: 112 }, // Starting point of the second line
        end: { x: 204, y: 107 }, // End point of the second line
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.learnerOrTraineeOrStudentClassification.toLowerCase() === 'indigenous people & cultural communities') {
      firstPage.drawLine({
        start: { x: 210, y: 96 }, // Starting point of the second line
        end: { x: 204, y: 91 }, // End point of the second line
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.learnerOrTraineeOrStudentClassification.toLowerCase() === 'rebel returnees') {
      firstPage.drawLine({
        start: { x: 210, y: 79 }, // Starting point of the second line
        end: { x: 204, y: 74 }, // End point of the second line
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.learnerOrTraineeOrStudentClassification.toLowerCase() === 'solo parent') {
      //3rd col
      firstPage.drawLine({
        start: { x: 406, y: 131 }, // Starting point of the second line
        end: { x: 401, y: 125 }, // End point of the second line
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    } else if (checkE.profileId.learnerOrTraineeOrStudentClassification.toLowerCase() === 'Others') {
      firstPage.drawLine({
        start: { x: 406, y: 113 }, // Starting point of the second line
        end: { x: 401, y: 107 }, // End point of the second line
        thickness: 1,
        color: rgb(0, 0, 0),
      });
    }
    //2nd page
    //name ofcourse/qualification
    secondPage.drawText(capitalizeName(checkE.courseId.name), {
      x: 225,
      y: 673,
      size: 10,
      font: helveticaFont,
      color: rgb(0, 0, 0),
    });
    //Printed name for the signature
    // secondPage.drawText('Reymond R. Godoy', {
    //   x: 225,
    //   y: 673,
    //   size: 10,
    //   font: helveticaFont,
    //   color: rgb(0, 0, 0),
    // })
    // firstPage.drawText('This text was added with JavaScriptLorem, ipsum dolor sit amet consectetur adipisicing elit. Hic maxime magnam provident necessitatibus, laborum qui atque voluptatum earum odit obcaecati, quis autem officiis ipsa quibusdam? Perspiciatis dolorum a, praesentium debitis ex quisquam alias reprehenderit doloremque similique maxime ullam? Nostrum sapiente culpa quia minus vero omnis. Numquam a nobis explicabo eum alias necessitatibus odit praesentium laborum vitae esse molestias, asperiores quaerat tempora velit vero hic accusamus quasi quas impedit molestiae? Ea non ducimus laudantium facilis quos consequatur iste dolores eveniet, inventore tempore accusantium cum voluptas facere omnis dignissimos dolor. Similique saepe itaque cupiditate, impedit eveniet ut veritatis odio tempore totam voluptas?Lorem, ipsum dolor sit amet consectetur adipisicing elit. Hic maxime magnam provident necessitatibus, laborum qui atque voluptatum earum odit obcaecati, quis autem officiis ipsa quibusdam? Perspiciatis dolorum a, praesentium debitis ex quisquam alias reprehenderit doloremque similique maxime ullam? Nostrum sapiente culpa quia minus vero omnis. Numquam a nobis explicabo eum alias necessitatibus odit praesentium laborum vitae esse molestias, asperiores quaerat tempora velit vero hic accusamus quasi quas impedit molestiae? Ea non ducimus laudantium facilis quos consequatur iste dolores eveniet, inventore tempore accusantium cum voluptas facere omnis dignissimos dolor. Similique saepe itaque cupiditate, impedit eveniet ut veritatis odio tempore totam voluptas?!', {
    //   x: 5,
    //   y: height / 2 + 300,
    //   size: 50,
    //   font: helveticaFont,
    //   color: rgb(0.95, 0.1, 0.1),
    //   // rotate: degrees(-45),
    // })
    // Save the PDF and get bytes
    // const filePath = path.join(__dirname, 'pdf', '../../../../../../../public/pdf/exampldPDF1.pdf');

    const pdfBytes = await pdfDoca.save();
    if(!pdfBytes){
      console.log('no pdfbytes')
    }

    // Convert the PDF bytes to base64
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');
    const metadata = {
      contentType: 'application/pdf',
    };
    const storageRef = ref(storage, `enrollment/${checkE._id}`);
    const uploadTask = uploadBytesResumable(storageRef, pdfBytes,metadata);
    let imageUrl = '';
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // setProgressUpload(progress);
        console.log(progress)
      },  
      (error) => {
        // makeToastError(error.message);
        return console.log(error);
      },
        () => {
         getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {
          console.log('url',url);
          // const updatedE = await updateEnrollmentPDFById(cc._id, url);
          // console.log('updatedE', updatedCE);
        }).catch((error) => console.log(error));
      }
    );

    // const pdfBytes = await pdfDoca.save();

    // const filePath = path.join(process.cwd(), 'public', 'pdf', 'exampldPDF1.pdf');
    // console.log(`PDF saved to ${filePath}`);
    // fs.writeFileSync(filePath, pdfBytes);
    // // Convert the PDF bytes to base64
    // const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    return pdfBase64;
  } catch (error) {
    console.log(`PDF error to`, error);
    return;
  }
};
