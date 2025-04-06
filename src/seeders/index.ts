'use server';
import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import { seedBlockType } from './blockType/blockType';
import { seedCourse } from './course/course';
import { seedCourseFee } from './courseFee/courseFee';
import { seedCourseFeeRecord } from './courseFeeRecord/courseFeeRecord';
import { seedCurriculum } from './curriculum/curriculum';
import { seedRoom } from './room/room';
import { seedSubject } from './subject/subject';
import { seedStudentProfile } from './studentProfile/studentProfile';
import { seedDeanProfile } from './deanProfile/deanProfile';
import { seedTeacherProfile } from './teacherProfile/teacherProfile';
import { seedAdminProfile } from './adminProfile/adminProfile';
import { seedSuperAdminProfile } from './superAdminProfile/superAdminProfile';
import { seedAccountingProfile } from './accountingProfile/accountingProfile';
import { seedEnrollmentRecord } from './enrollmentRecords/enrollmentRecords';
import { seedEnrollment } from './enrollment/enrollment';
import { seedEnrollmentSetup } from './enrollmentSetup/enrollmentSetup';
import { seedScholarship } from './scholarship/scholarship';
import { seedStudentReceipt } from './studentReceipt/studentReceipt';
import { seedTeacherSchedule } from './teacherSchedule/teacherSchedule';

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI!);

    await seedCourse();
    await seedBlockType();
    await seedCourseFee();
    await seedCourseFeeRecord();
    await seedRoom();
    await seedSubject();
    await seedCurriculum();

    await seedAdminProfile();
    await seedSuperAdminProfile();
    await seedAccountingProfile();

    await seedDeanProfile();
    await seedTeacherProfile();
    await seedTeacherSchedule();

    await seedStudentProfile();
    await seedEnrollmentSetup();
    await seedEnrollment();
    await seedScholarship();
    await seedStudentReceipt();
    await seedEnrollmentRecord();

    console.log('All Seeding complete!');
  } catch (err) {
    console.error('Error during seeding:', err);
  }
})();
