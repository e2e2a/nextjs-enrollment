'use server';
import Enrollment from '@/models/Enrollment';
import StudentProfile from '@/models/StudentProfile';
import { User } from '@/models/User';
import bcrypt from 'bcryptjs';

const createUsers = async () => {
  const password = 'qweqwe';
  const courseId1 = '66e145343b8dbdf7923c117a';
  const courseId2 = '66e146283b8dbdf7923c11c4';
  const blockTypeId1 = '';
  const blockTypeId2 = '';
  const hashedPassword = await bcrypt.hash(password, 10);
  for (let i = 0; i < 100; i++) {
    const courseId = i < 50 ? courseId1 : courseId2;
    const studentEmail = `student${i}@example.com`;
    const student = new User({
      email: studentEmail,
      password: hashedPassword,
      role: 'student',
      isVerified: true,
    });
    await student.save();
    const studentProfile = new StudentProfile({
      userId: student._id,
      age: '24',
      barangay: 'qweqwe',
      birthPlaceCity: 'Dipolog City',
      birthPlaceProvince: 'Dipolog City',
      birthPlaceRegion: 'birthPlaceRegiony',
      birthday: {
        $date: '2000-09-19T16:00:00.000Z',
      },
      cityMunicipality: 'qweqwe',
      civilStatus: 'single',
      contact: 'qweqwe',
      district: 'qweqwe',
      educationAttainment: 'high School graduate',
      emailFbAcc: 'facebook.com',
      employmentStatus: 'employed',
      extensionName: '',
      firstname: `reymond${i}`,
      middlename: `reymond${i}`,
      lastname: `reymond${i}`,
      sex: 'male',
      learnerOrTraineeOrStudentClassification: 'Displaced Worker (Local)',
      nationality: 'qweqwe',
      numberStreet: 'qweqwe',
      province: 'qweqwe',
      region: 'qqweqwe',
      isVerified: true,
    });
    await studentProfile.save();
    const studentEnrollment = new Enrollment({
      userId: student._id,
      profileId: studentProfile._id,
      courseId: courseId,
      studentYear: '1st year',
      studentSemester: '1st semester',
      onProcess: true,
      step: 5,
      enrollStatus: 'Enrolled',
      studentStatus: 'new student',
      photoUrl: 'https://firebasestorage.googleapis.com/v0/b/my-project-eaeb4.appspot.com/o/enrollment%2Fstudentphoto%2F66e14c4c3b8dbdf7923c13c7%2Fatt.Gqvfkzdn53FSMWItGHwOkIaj4wfsZF7hPcU-g329MpQ.jpg?alt=media&token=5563659b-605c-4f3c-a209-3eb68b79770e',
      psaUrl: 'https://firebasestorage.googleapis.com/v0/b/my-project-eaeb4.appspot.com/o/enrollment%2Fpsa%2F66e14c4c3b8dbdf7923c13c7%2Fatt.fWoAMz1p0-hiGvbqhKldwMyoGae-asesqnK11GciQ70.jpg?alt=media&token=81e9ce4b-4874-4b0d-98e1-3e1e4551eb8b',
      schoolYear: 'sy2001-2002',
      blockTypeId: {
        $oid: '66e146ab3b8dbdf7923c11f4',
      },
    });
  }
};
