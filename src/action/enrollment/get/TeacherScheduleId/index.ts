'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getAllEnrollmentByTeacherScheduleId } from '@/services/enrollment';
import { getTeacherProfileByUserId } from '@/services/teacherProfile';
import { getTeacherScheduleById } from '@/services/teacherSchedule';
import { checkAuth } from '@/utils/actions/session';

export const getEnrollmentByTeacherScheduleIdAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();

    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not authenticated.', status: 403 };

    const res = await checkSessionRole(session.user, data);
    if (res && res.error) return { error: res.error, status: res.status };
    console.log('res.2', res.students[2]._id);
    console.log('res.3', res.students[3]._id);
    return { students: JSON.parse(JSON.stringify(res.students)), status: 200 };
  });
};

const checkSessionRole = async (user: any, data: any) => {
  return tryCatch(async () => {
    let enrollments;
    switch (user.role) {
      case 'ADMIN':
        enrollments = await adminRole(data);
        break;
      case 'SUPER ADMIN':
        enrollments = await adminRole(data);
        break;
      case 'DEAN':
        enrollments = await deanRole(user, data);
        break;
      case 'TEACHER':
        enrollments = await teacherRole(user, data);
        break;
      default:
        return { error: 'forbidden', status: 403 };
    }
    if (enrollments && enrollments.error)
      return { error: enrollments.error, status: enrollments.status };
    return { success: true, students: enrollments.students, status: enrollments.status };
  });
};

const adminRole = async (data: any) => {
  return tryCatch(async () => {
    const ts = await getTeacherScheduleById(data.id);
    if (!ts) return { error: 'forbidden', status: 500 };
    let s;
    const a = await getAllEnrollmentByTeacherScheduleId(data.id);
    s = a?.filter(e => e.enrollStatus.toLowerCase() !== 'withdraw');
    let students;
    if (s && s.length > 0) {
      students = s
        .map((ss: any) => {
          return ss.studentSubjects.filter(
            (sss: any) =>
              sss.teacherScheduleId._id.toString() === ts._id.toString() &&
              sss.status === 'Approved'
          );
        })
        .flat();
    }
    return { success: true, students: students, status: 200 };
  });
};

const deanRole = async (user: any, data: any) => {
  return tryCatch(async () => {
    const p = await getDeanProfileByUserId(user._id);

    const ts = await getTeacherScheduleById(data.id);
    if (!ts) return { error: 'forbidden', status: 500 };
    //double check if the courseId is not equal
    if (p.courseId._id.toString() !== ts.courseId._id.toString())
      return { error: 'Dont have permission.', status: 403 };
    let s;
    const a = await getAllEnrollmentByTeacherScheduleId(data.id);
    s = a?.filter(e => e.enrollStatus.toLowerCase() !== 'withdraw');

    let students;
    if (s && s.length > 0) {
      students = s
        .map((ss: any) => {
          return ss.studentSubjects.filter(
            (sss: any) =>
              sss.teacherScheduleId._id.toString() === ts._id.toString() &&
              sss.status === 'Approved'
          );
        })
        .flat();
    } else {
      students = [];
    }

    return { success: true, students: students, status: 200 };
  });
};

const teacherRole = async (user: any, data: any) => {
  return tryCatch(async () => {
    const p = await getTeacherProfileByUserId(user._id);

    const ts = await getTeacherScheduleById(data.id);
    if (!ts) return { error: 'TS not found', status: 500 };
    //double check if the courseId is not equal
    if (p._id.toString() !== ts.profileId._id.toString())
      return { error: 'Dont have permission.', status: 403 };

    let s;
    console.log('data.id', data.id);
    const a = await getAllEnrollmentByTeacherScheduleId(data.id);
    console.log('a2', a ? a[2] : []);
    console.log('a3', a ? a[3] : []);
    const b = a?.filter(e => e._id.toString() === '67e1559754f8de622fa30ded');
    console.log('b', b);
    s = a?.filter(e => e.enrollStatus.toLowerCase() !== 'withdraw');
    let students;
    if (s && s.length > 0) {
      students = s
        .map((ss: any) => {
          return ss.studentSubjects.filter(
            (sss: any) =>
              sss.teacherScheduleId._id.toString() === ts._id.toString() &&
              sss.status === 'Approved'
          );
        })
        .flat();
    } else {
      students = [];
    }

    return { success: true, students: students, status: 200 };
  });
};
