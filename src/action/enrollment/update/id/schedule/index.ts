'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import Enrollment from '@/models/Enrollment';
import TeacherSchedule from '@/models/TeacherSchedule';
import { getEnrollmentById, getEnrollmentByProfileId, getEnrollmentByUserId } from '@/services/enrollment';
import { checkAuth } from '@/utils/actions/session';
import mongoose from 'mongoose';

export const updateStudentEnrollmentScheduleAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    let enrollment;
    if (session.user.role === 'STUDENT') {
      enrollment = await getEnrollmentByUserId(session.user._id);
    } else if (session.user.role === 'DEAN' || session.user.role === 'ADMIN') {
      if (data.type === 'Declined' || data.type === 'Approved') {
        enrollment = await getEnrollmentByProfileId(data.enrollmentId);
      } else {
        enrollment = await getEnrollmentById(data.enrollmentId);
      }
    }
    if (!enrollment) return { error: 'Enrollment ID is not valid.', status: 404 };

    const c = await checkCategory(session.user, data, enrollment);

    return c;
  });
};

const checkCategory = async (user: any, data: any, e: any) => {
  return tryCatch(async () => {
    let category;
    switch (data.category) {
      case 'College':
        category = await checkTypeRequest(user, data, e);
        break;
      default:
        return { error: 'Invalid category.', status: 400 };
    }

    return { ...category, category: e.courseId.category, courseId: e.courseId._id.toString(), userId: e.userId._id.toString() };
  });
};

const checkTypeRequest = async (user: any, data: any, e: any) => {
  return tryCatch(async () => {
    let request;
    switch (data.request) {
      case 'Add':
        if (user.role === 'ADMIN' || user.role === 'DEAN') {
          const p = data.type === 'Approved' || data.type === 'Declined';
          if (data.type && p) {
            if (user.role === 'ADMIN') {
              request = await ApprovedByAdminAddSubjectCollege(data, e);
            } else if (user.role === 'DEAN') {
              request = await ApprovedByDeanAddSubjectCollege(data, e);
            }
          } else {
            request = await addStudentSubjectCollege(data, e); // if its admin then it automatically add
          }
        }
        if (user.role === 'STUDENT') request = await requestAddStudentSubjectCollege(data, e); // if its student it may request add
        break;
      case 'Drop':
        if (user.role === 'STUDENT') request = await requestDropStudentSubjectCollege(data, e); // if its student it may request drop
        if (user.role === 'ADMIN') request = await ApprovedByAdminDropSubjectCollege(data, e); // approval/declined of drop subject
        if (user.role === 'DEAN') request = await ApprovedByDeanDropSubjectCollege(data, e); // approval/declined of drop subject
        break;
      case 'Suggested':
        if (user.role === 'ADMIN' || user.role === 'DEAN') request = await suggestStudentSubjectCollege(data, e); // if its admin then it automatically suggest
        if (user.role === 'STUDENT') request = await AcceptSuggestedSubjectCollege(data, e); // if its student it may accept add
        break;
      default:
        return { error: 'Invalid category.', status: 403 };
    }

    return request;
  });
};

/**
 * role Dean - Approved/Declined add subject
 *
 * @param {object} data
 * @param {object} e
 */
const ApprovedByDeanAddSubjectCollege = async (data: any, e: any) => {
  return tryCatch(async () => {
    //this area is single data.teacherScheduleId
    const teacherSchedule = await TeacherSchedule.findById(data.teacherScheduleId).populate('blockTypeId');
    if (!teacherSchedule) return { error: `Teacher Schedule ID is not valid.`, status: 404 };

    const enrollmentToUpdate = await e.studentSubjects.find((sched: any) => sched.teacherScheduleId._id.toString() === data.teacherScheduleId);
    if (!enrollmentToUpdate) return { error: 'No student subject found.', status: 403 };
    if (enrollmentToUpdate.requestStatusInDean === data.type) return { error: `You already have already ${data.type} This.`, status: 409 };

    if (data.type === 'Approved') {
      enrollmentToUpdate.requestStatusInDean = 'Approved';
      if (enrollmentToUpdate.requestStatusInRegistrar === 'Approved') {
        enrollmentToUpdate.requestStatus = 'Approved';
        enrollmentToUpdate.status = 'Approved';
      }
    } else if (data.type === 'Declined') {
      enrollmentToUpdate.requestStatusInDean = 'Declined';
      // if (enrollmentToUpdate.requestStatusInRegistrar === 'Declined') {
      enrollmentToUpdate.requestStatus = 'Declined';
      enrollmentToUpdate.status = 'Declined';
      // }
    }

    await e.save();
    return { message: `Subject Status has been ${data.type}.`, status: 201 };
  });
};

/**
 * role Admin - Approved/Declined add subject
 *
 * @param {object} data
 * @param {object} e
 */
const ApprovedByAdminAddSubjectCollege = async (data: any, e: any) => {
  return tryCatch(async () => {
    //this area is single data.teacherScheduleId
    const teacherSchedule = await TeacherSchedule.findById(data.teacherScheduleId).populate('blockTypeId');
    if (!teacherSchedule) return { error: `Teacher Schedule ID is not valid.`, status: 404 };

    const enrollmentToUpdate = await e.studentSubjects.find((sched: any) => sched.teacherScheduleId._id.toString() === data.teacherScheduleId);
    if (!enrollmentToUpdate) return { error: 'No student subject found.', status: 403 };
    if (enrollmentToUpdate.requestStatusInRegistrar === data.type) return { error: `You already have already ${data.type} This.`, status: 409 };

    if (data.type === 'Approved') {
      enrollmentToUpdate.requestStatusInRegistrar = 'Approved';
      if (enrollmentToUpdate.requestStatusInDean === 'Approved') {
        enrollmentToUpdate.requestStatus = 'Approved';
        enrollmentToUpdate.status = 'Approved';
      }
    } else if (data.type === 'Declined') {
      enrollmentToUpdate.requestStatusInRegistrar = 'Declined';
      // if (enrollmentToUpdate.requestStatusInDean === 'Declined') {
      enrollmentToUpdate.requestStatus = 'Declined';
      enrollmentToUpdate.status = 'Declined';
      // }
    }

    await e.save();
    return { message: `Subject Status has been ${data.type}.`, status: 201 };
  });
};

/**
 * role Admin - Approved/Declined drop subject
 *
 * @param {object} data
 * @param {object} e
 */
const ApprovedByAdminDropSubjectCollege = async (data: any, e: any) => {
  return tryCatch(async () => {
    //this area is single data.teacherScheduleId
    const teacherSchedule = await TeacherSchedule.findById(data.teacherScheduleId).populate('blockTypeId');
    if (!teacherSchedule) return { error: `Teacher Schedule ID is not valid.`, status: 404 };

    const enrollmentToUpdate = await e.studentSubjects.find((sched: any) => sched.teacherScheduleId._id.toString() === data.teacherScheduleId);
    if (!enrollmentToUpdate) return { error: 'No student subject found.', status: 403 };
    if (enrollmentToUpdate.requestStatusInRegistrar === data.type) return { error: `You already have already ${data.type} This.`, status: 409 };

    if (data.type === 'Approved') {
      enrollmentToUpdate.requestStatusInRegistrar = 'Approved';
      if (enrollmentToUpdate.requestStatusInDean === 'Approved') {
        enrollmentToUpdate.requestStatus = 'Approved';
        enrollmentToUpdate.status = 'Dropped';
      }
    } else if (data.type === 'Declined') {
      enrollmentToUpdate.requestStatusInRegistrar = 'Declined';
      // if (enrollmentToUpdate.requestStatusInDean === 'Declined') {
      enrollmentToUpdate.requestStatus = 'Declined';
      enrollmentToUpdate.status = 'Approved';
      // }
    }

    await e.save();
    return { message: `Subject Status has been ${data.type}.`, status: 201 };
  });
};

/**
 * role dean - Approved/Declined drop subject
 *
 * @param {object} data
 * @param {object} e
 */
const ApprovedByDeanDropSubjectCollege = async (data: any, e: any) => {
  return tryCatch(async () => {
    //this area is single data.teacherScheduleId
    const teacherSchedule = await TeacherSchedule.findById(data.teacherScheduleId).populate('blockTypeId');
    if (!teacherSchedule) return { error: `Teacher Schedule ID is not valid.`, status: 404 };

    const enrollmentToUpdate = await e.studentSubjects.find((sched: any) => sched.teacherScheduleId._id.toString() === data.teacherScheduleId);
    if (!enrollmentToUpdate) return { error: 'No student subject found.', status: 403 };
    if (enrollmentToUpdate.requestStatusInDean === data.type) return { error: `You already have already ${data.type} This.`, status: 409 };

    if (data.type === 'Approved') {
      enrollmentToUpdate.requestStatusInDean = 'Approved';
      if (enrollmentToUpdate.requestStatusInRegistrar === 'Approved') {
        enrollmentToUpdate.requestStatus = 'Approved';
        enrollmentToUpdate.status = 'Dropped';
      }
    } else if (data.type === 'Declined') {
      enrollmentToUpdate.requestStatusInDean = 'Declined';
      // if (enrollmentToUpdate.requestStatusInRegistrar === 'Declined') {
      enrollmentToUpdate.requestStatus = 'Declined';
      enrollmentToUpdate.status = 'Approved';
      // }
    }

    await e.save();
    return { message: `Subject Status has been ${data.type}.`, status: 201 };
  });
};

/**
 * role student - Accept suggested subject
 *
 * @param {object} data
 * @param {object} e
 */
const AcceptSuggestedSubjectCollege = async (data: any, e: any) => {
  return tryCatch(async () => {
    //this area is single data.teacherScheduleId
    const teacherSchedule = await TeacherSchedule.findById(data.teacherScheduleId).populate('blockTypeId');
    if (!teacherSchedule) return { error: `Teacher Schedule ID is not valid.`, status: 404 };

    const enrollmentToUpdate = await e.studentSubjects.find((sched: any) => sched.teacherScheduleId._id.toString() === data.teacherScheduleId);
    if (!enrollmentToUpdate) return { error: 'No student subject found.', status: 403 };
    if (enrollmentToUpdate.request === 'add') return { error: 'Subject is already added.', status: 409 };

    enrollmentToUpdate.status = 'Pending';
    enrollmentToUpdate.request = 'add';
    enrollmentToUpdate.requestStatusInDean = 'Pending';
    enrollmentToUpdate.requestStatusInRegistrar = 'Pending';
    enrollmentToUpdate.requestStatus = 'Pending';
    await e.save();
    return { message: `Suggested subjects has been Accepted.`, status: 201 };
  });
};

/**
 * role student - request drop subject
 *
 * @param {object} data
 * @param {object} e
 */
const requestDropStudentSubjectCollege = async (data: any, e: any) => {
  return tryCatch(async () => {
    //this area is single data.teacherScheduleId
    const teacherSchedule = await TeacherSchedule.findById(data.teacherScheduleId).populate('blockTypeId');
    if (!teacherSchedule) return { error: `Teacher Schedule ID is not valid.`, status: 404 };

    const enrollmentToUpdate = await e.studentSubjects.find((sched: any) => sched.teacherScheduleId._id.toString() === data.teacherScheduleId);
    if (!enrollmentToUpdate) return { error: 'No student subject found.', status: 403 };
    if (enrollmentToUpdate.request === 'drop') return { error: 'Subject is already added.', status: 409 };

    enrollmentToUpdate.request = 'drop';
    enrollmentToUpdate.requestStatusInDean = 'Pending';
    enrollmentToUpdate.requestStatusInRegistrar = 'Pending';
    enrollmentToUpdate.requestStatus = 'Pending';
    await e.save();
    return { message: `Student subjects has been ${data.request}.`, status: 201 };
  });
};

/**
 * role student - request add subject
 *
 * @param {object} data
 * @param {object} e
 */
const requestAddStudentSubjectCollege = async (data: any, e: any) => {
  return tryCatch(async () => {
    const c = await checkStudentSched(data, e);
    if (c && c.error) return c;

    for (const item of data.selectedItems) {
      await Enrollment.findByIdAndUpdate(
        e._id,
        { $addToSet: { studentSubjects: { teacherScheduleId: item.teacherScheduleId, profileId: e.profileId._id, status: 'Pending', request: 'add', requestStatusInDean: 'Pending', requestStatusInRegistrar: 'Pending', requestStatus: 'Pending' } } }, // Add teacherScheduleId to blockSubjects
        { new: true }
      );
    }
    return { message: 'Block subjects updated successfully.', status: 201 };
  });
};

/**
 * role admin/dean - add student subject
 *
 * @param {object} data
 * @param {object} e
 */
const addStudentSubjectCollege = async (data: any, e: any) => {
  return tryCatch(async () => {
    const c = await checkStudentSched(data, e);
    if (c && c.error) return c;

    for (const item of data.selectedItems) {
      await Enrollment.findByIdAndUpdate(
        e._id,
        { $addToSet: { studentSubjects: { teacherScheduleId: item.teacherScheduleId, profileId: e.profileId._id, status: 'Approved' } } }, // Add teacherScheduleId to blockSubjects
        { new: true }
      );
    }
    return { message: 'Student subjects updated successfully.', status: 201 };
  });
};

/**
 * role admin/dean - suggest subject to student
 *
 * @param {object} data
 * @param {object} e
 */
const suggestStudentSubjectCollege = async (data: any, e: any) => {
  return tryCatch(async () => {
    const c = await checkStudentSched(data, e);
    if (c && c.error) return c;

    for (const item of data.selectedItems) {
      await Enrollment.findByIdAndUpdate(
        e._id,
        { $addToSet: { studentSubjects: { teacherScheduleId: item.teacherScheduleId, profileId: e.profileId._id, status: 'Suggested', request: 'suggested', requestStatus: 'Suggested' } } }, // Add teacherScheduleId to blockSubjects
        { new: true }
      );
    }
    return { message: 'Student subjects updated successfully.', status: 201 };
  });
};

const checkStudentSched = async (data: any, e: any) => {
  return tryCatch(async () => {
    for (const item of data.selectedItems) {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(item.teacherScheduleId);
      if (!isValidObjectId) return { error: `Teacher Schedule ID is not valid.`, status: 403 };

      const teacherSchedule = await TeacherSchedule.findById(item.teacherScheduleId).populate('blockTypeId');
      if (!teacherSchedule) return { error: `Teacher Schedule ID ${item.teacherScheduleId} is not valid.`, status: 404 };

      for (const existStudentSched of e.studentSubjects) {
        if (existStudentSched.teacherScheduleId._id.toString() === item.teacherScheduleId) return { error: `Some Teacher Schedule already ${data.request} in the student schedules.`, status: 409 };
      }
    }
    return { success: true, message: 'no conflict', status: 200 };
  });
};
