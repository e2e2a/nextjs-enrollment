'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { createEnrollment, getEnrollmentByUserId } from '@/services/enrollment';
import { getStudentProfileByUserId } from '@/services/studentProfile';
import { getEnrollmentRecordByProfileId } from '@/services/enrollmentRecord';
import StudentProfile from '@/models/StudentProfile';

export const handleStudentRole = async (user: any, data: any) => {
  return tryCatch(async () => {
    const checkEnrollment = await getEnrollmentByUserId(user._id);
    if (checkEnrollment) return { error: 'You are already Enrolled/Enrolling.', status: 409 };
    const profile = await getStudentProfileByUserId(user._id);
    if (!profile) return { error: 'You are enrolling without a profile.', status: 403 };

    if (data.studentStatus === 'Returning') {
      const record = await getEnrollmentRecordByProfileId(profile._id);
      if (!record) return { error: 'No record found', status: 403 };
      if (profile.studentSemester === data.studentSemester) {
        return { message: 'Returning student: needs to wait for the next available enrollment period', status: 403 };
      }
    }
    await storeEnrollment(user, profile, data);
    await updateProfile(profile, data);
    return { message: 'hello world success', status: 201 };
  });
};

const storeEnrollment = async (user: any, profile: any, data: any) => {
  return tryCatch(async () => {
    data.userId = user._id;
    data.profileId = profile._id;
    data.courseId = profile.courseId._id;
    data.onProcess = true;
    // data.category = 'College';

    const cc = await createEnrollment(data);
    if (!cc) return { message: 'Something went wrong.', status: 500 };
  });
};

const updateProfile = async (profile: any, data: any) => {
  return tryCatch(async () => {
    const dataToUpdateProfile = {
      studentYear: data.studentYear,
      studentSemester: data.studentSemester,
      enrollStatus: 'Pending',

      numberStreet: data.numberStreet,
      barangay: data.barangay,
      district: data.district,
      cityMunicipality: data.cityMunicipality,
      province: data.province,
      contact: data.contact,
      civilStatus: data.civilStatus,
    };
    const updatedProfile = await StudentProfile.findByIdAndUpdate(profile._id, dataToUpdateProfile);
    if (!updatedProfile) return { message: 'Something went wrong.', status: 500 };
  });
};
