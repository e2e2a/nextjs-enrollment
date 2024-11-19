'use server';
import { tryCatch } from '@/lib/helpers/tryCatch';
import StudentCurriculum from '@/models/StudentCurriculum';
import { getBlockTypeById } from '@/services/blockType';
import { getDeanProfileByUserId } from '@/services/deanProfile';
import { getEnrollmentById, updateEnrollmentById } from '@/services/enrollment';
import { createStudentCurriculum } from '@/services/studentCurriculum';
import { updateStudentProfileById } from '@/services/studentProfile';

/**
 *
 * @param {object} user
 * @param {object} data
 */
export const handlesCollege = async (user: any, data: any) => {
  return tryCatch(async () => {
    const checkE = await getEnrollmentById(data.EId);
    if (!checkE || checkE.category !== data.category) return { error: 'No enrollment found to update.', status: 404 };
    if (checkE.step !== data.step) return { error: `Can't find the student in this ${data.step}`, status: 404 };

    const checkedR = await checkSessionRole(user, data, checkE);
    if (checkedR && checkedR.error) return { error: checkedR.error, status: 403 };

    if (data.request === 'Rejected') return await handleReject(user, data, checkE);

    let r;
    switch (Number(checkE.step)) {
      case 1:
        r = await handleStep1(data, checkE);
        break;
      case 2:
        r = await handleStep2(data, checkE);
        break;
      case 3:
        r = await handleStep3(data, checkE);
        break;
      case 4:
        r = await handleStep4(data, checkE);
        break;
      case 5:
        r = await handleStep5(data, checkE);
        break;
      case 6:
        r = await handleStep6(data, checkE);
        break;

      default:
        return { error: 'Foribbeden.', status: 403 };
    }

    return { ...r, category: data.category, prevStep: checkE.step, userId: checkE.userId._id.toString(), courseId: checkE.courseId._id.toString() };
  });
};

const handleReject = async (user: any, data: any, e: any) => {
  return tryCatch(async () => {
    if (user.role !== 'ADMIN') return { error: 'Forbidden.', status: 403 };

    const rejectedCount = Number(e.rejectedCount ?? 0) + 1;
    await updateStudentProfileById(e.profileId._id, { studentType: '', enrollStatus: '', rejectedCount });
    await updateEnrollmentById(e._id, { enrollStatus: 'Rejected', rejectedRemark: data.rejectedRemark });

    return { message: `Student Enrollment has been ${data.request}`, prevStep: e.step, userId: e.userId._id.toString(), courseId: e.courseId._id.toString(), profileId: e.profileId._id.toString(), status: 201 };
  });
};

/**
 *
 * @param {object} user
 * @param {object} data
 * @param {object} e
 */
const checkSessionRole = async (user: any, data: any, e: any) => {
  return tryCatch(async () => {
    if (user.role === 'DEAN') {
      const p = await getDeanProfileByUserId(user._id);
      if (p.courseId._id.toString() !== e.courseId._id.toString()) return { error: 'Forbidden', status: 403 };
      return { success: true, message: '', status: 201 };
    } else if (user.role === 'ADMIN') {
      //overAll
      return { success: true, message: '', status: 201 };
    } else {
      return { error: 'forbidden', status: 403 };
    }
  });
};
/**
 *
 * @param {object} data
 * @param {object} e
 */
const handleStep1 = async (data: any, e: any) => {
  return tryCatch(async () => {
    if (data.request === 'Approved') {
      const newStep = e.step + 1;
      await updateEnrollmentById(e._id, { step: newStep });
      return { message: `Student Enrollment has been proceed in step ${newStep}`, nextStep: newStep, status: 201 };
    } else if (data.request === 'Undo') {
      return { error: 'Step 1 cannot be undo cuz its the first step.', message: '', status: 403 };
    } else if (data.request === 'Rejected') {
      return { success: true, message: '', status: 201 };
    } else {
      return { error: 'parang wala lang.', message: '123', status: 403 };
    }
  });
};

/**
 *
 * @param {object} data
 * @param {object} e
 */
const handleStep2 = async (data: any, e: any) => {
  return tryCatch(async () => {
    if (data.request === 'Approved') {
      let block;
      if (data.studentType === 'regular') {
        block = await getBlockTypeById(data.blockType);
        if (!block) return { error: 'Block Type is not valid', status: 403 };
      }

      const newStep = Number(e.step) + 1;
      const dataToUpdate = {
        step: newStep,
        blockTypeId: block ? block._id : null,
        studentType: data.studentType,
      };

      await updateStudentProfileById(e.profileId._id, { studentType: data.studentType });
      await updateEnrollmentById(e._id, dataToUpdate);

      return { message: `Student Enrollment has been proceed in step ${newStep}`, nextStep: newStep, status: 201 };
    } else if (data.request === 'Undo') {
      const newStep = Number(e.step) - 1;

      await updateEnrollmentById(e._id, { step: newStep });
      return { message: `Student Enrollment has been undo in step ${newStep}`, nextStep: newStep, status: 201 };
    } else if (data.request === 'Rejected') {
      return { success: true, message: '', status: 201 };
    } else {
      return { error: 'parang wala lang.', message: '123', status: 403 };
    }
  });
};

/**
 *
 * @param {object} data
 * @param {object} e
 */
const handleStep3 = async (data: any, e: any) => {
  return tryCatch(async () => {
    if (data.request === 'Approved') {
      const newStep = e.step + 1;
      await updateEnrollmentById(e._id, { step: newStep });

      return { message: `Student Enrollment has been proceed in step ${newStep}`, nextStep: newStep, status: 201 };
    } else if (data.request === 'Undo') {
      const newStep = Number(e.step) - 1;

      const dataToUpdate = {
        step: newStep,
        blockTypeId: null,
        studentType: '',
      };

      await updateStudentProfileById(e.profileId._id, { studentType: '' });
      await updateEnrollmentById(e._id, dataToUpdate);
      return { message: `Student Enrollment has been undo in step ${newStep}`, nextStep: newStep, status: 201 };
    } else if (data.request === 'Rejected') {
      return { success: true, message: '', status: 201 };
    } else {
      return { error: 'parang wala lang.', message: '123', status: 403 };
    }
  });
};

/**
 *
 * @param {object} data
 * @param {object} e
 */
const handleStep4 = async (data: any, e: any) => {
  return tryCatch(async () => {
    if (data.request === 'Approved') {
      const newStep = e.step + 1;
      await updateEnrollmentById(e._id, { step: newStep });

      return { message: `Student Enrollment has been proceed in step ${newStep}`, nextStep: newStep, status: 201 };
    } else if (data.request === 'Undo') {
      const newStep = Number(e.step) - 1;

      await updateEnrollmentById(e._id, { step: newStep });
      return { message: `Student Enrollment has been undo in step ${newStep}`, nextStep: newStep, status: 201 };
    } else if (data.request === 'Rejected') {
      return { success: true, message: '', status: 201 };
    } else {
      return { error: 'parang wala lang.', message: '123', status: 403 };
    }
  });
};

/**
 *
 * @param {object} data
 * @param {object} e
 */
const handleStep5 = async (data: any, e: any) => {
  return tryCatch(async () => {
    if (data.request === 'Approved') {
      const newStep = e.step + 1;
      /**
       * @todo this is payment statement
       */
      await updateStudentProfileById(e.profileId._id, { payment: true });
      await updateEnrollmentById(e._id, { step: newStep });
      return { message: `Student Enrollment has been proceed in step ${newStep}`, category: data.category, nextStep: newStep, status: 201 };
    } else if (data.request === 'Undo') {
      const newStep = Number(e.step) - 1;

      await updateEnrollmentById(e._id, { step: newStep });
      return { message: `Student Enrollment has been undo in step ${newStep}`, category: data.category, nextStep: newStep, status: 201 };
    } else if (data.request === 'Rejected') {
      return { success: true, message: '', category: data.category, status: 201 };
    } else {
      return { error: 'parang wala lang.', message: '123', status: 403 };
    }
  });
};

/**
 *
 * @param {object} data
 * @param {object} e
 */
const handleStep6 = async (data: any, e: any) => {
  return tryCatch(async () => {
    if (data.request === 'Approved') {
      if (data.enrollStatus !== 'Enrolled' && data.enrollStatus !== 'Temporary Enrolled') return { error: 'Not valid', status: 403 };
      await updateEnrollmentById(e._id, { enrollStatus: data.enrollStatus });

      const b = await StudentCurriculum.findOne({ studentId: e.profileId._id, courseId: e.courseId._id });
      if (!b) await createStudentCurriculum({ category: data.category, studentId: e.profileId._id, courseId: e.courseId._id });

      await updateStudentProfileById(e.profileId._id, { enrollStatus: data.enrollStatus });
      return { message: `Student Enrollment has been ${data.enrollStatus}`, category: data.category, status: 201 };
    } else if (data.request === 'Undo') {
      const newStep = Number(e.step) - 1;
      /**
       * @todo this is payment statement
       */
      await updateStudentProfileById(e.profileId._id, { payment: false });
      await updateEnrollmentById(e._id, { step: newStep });
      return { message: `Student Enrollment has been undo in step ${newStep}`, category: data.category, nextStep: newStep, status: 201 };
    } else if (data.request === 'Rejected') {
      return { success: true, message: '', category: data.category, status: 201 };
    } else {
      return { error: 'parang wala lang.', message: '123', status: 403 };
    }
  });
};
