'use server';
import { faker } from '@faker-js/faker';
import { enrollmentRecordData } from './enrollmentRecordData';
import EnrollmentRecord from '@/models/EnrollmentRecord';
import TeacherProfile from '@/models/TeacherProfile';

export const seedEnrollmentRecord = async () => {
  await EnrollmentRecord.deleteMany({});
  console.log('Cleaned EnrollmentRecord Collection');

  //map this
  const enrollmentRecordDataWithNames = await Promise.all(
    enrollmentRecordData.map(async record => {
      const updatedSubjects = await Promise.all(
        record.studentSubjects.map(async subj => {
          const teacher = await TeacherProfile.findById(subj.profileId);
          return {
            ...subj,
            teacher: {
              firstname: teacher?.firstname || faker.person.firstName(),
              lastname: teacher?.lastname || faker.person.lastName(),
            },
          };
        })
      );

      return {
        ...record,
        firstname: faker.person.firstName(),
        lastname: faker.person.lastName(),
        studentSubjects: updatedSubjects,
      };
    })
  );

  await EnrollmentRecord.insertMany(enrollmentRecordDataWithNames);

  console.log('EnrollmentRecord seeding complete');
  return;
};
