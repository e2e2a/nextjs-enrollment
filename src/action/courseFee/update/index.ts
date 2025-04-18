'use server';
import dbConnect from '@/lib/db/db';
import { tryCatch } from '@/lib/helpers/tryCatch';
import { CourseFeeValidator } from '@/lib/validators/courseFee/create';
import { getCourseByCourseCode } from '@/services/course';
import { updateCourseFeeById, getCourseFeeById, getCourseFeeByCourseIdAndYear } from '@/services/courseFee';
import { checkAuth } from '@/utils/actions/session';

export const updateTuitionFeeAction = async (data: any) => {
  return tryCatch(async () => {
    await dbConnect();
    const session = await checkAuth();
    if (!session || session.error) return { error: 'Not Authorized.', status: 403 };
    if (session.user.role !== 'ACCOUNTING') return { error: 'Forbidden', status: 403 };

    const result = await checkCategory(data);
    return result;
  });
};

const checkCategory = async (data: any) => {
  return tryCatch(async () => {
    switch (data.category) {
      case 'College':
        return await handleCategoryCollege(data);
      default:
        return { error: 'Invalid category.', status: 403 };
    }
  });
};

const handleCategoryCollege = async (data: any) => {
  return tryCatch(async () => {
    const parse = CourseFeeValidator.safeParse(data);
    if (!parse.success) return { error: 'Invalid fields!', status: 400 };
    const tFee = await getCourseFeeById(data.id);
    if (!tFee) return { error: 'Tuition Fee to update has not found.', status: 404 };

    let course;
    if (data.courseCode.toLowerCase() !== tFee.courseId.courseCode.toLowerCase()) {
      course = await getCourseByCourseCode(data.courseCode);
      if (!course) return { error: 'Course Not Found.', status: 404 };
      const checkDp = await getCourseFeeByCourseIdAndYear(data.year, course._id);
      if (checkDp) return { error: `Course already have a Tuition fee.`, status: 409 };
    } else {
      course = tFee.courseId;
    }

    if (!Array.isArray(data.regMiscRows) || data.regMiscRows.length === 0) return { error: 'Please provide Reg/Misc Fee', status: '400' };
    if (data.regMiscRows.length === 0) return { error: 'Please Provide Reg/Misc Fee', status: '400' };

    for (const regOrMisc of data.regMiscRows) {
      const regex = /^\d+(\.\d{1,2})?$/;
      if (!regOrMisc.name || !regOrMisc.amount) return { error: 'Please fill all fields in Reg/Misc Fee', status: '400' };
      const nameOccurrences = data.regMiscRows.filter((row: any) => row.name === regOrMisc.name).length;
      if (nameOccurrences > 1) return { error: `Duplicate name found in REG/MISC: ${regOrMisc.name.toUpperCase()}`, status: '400' };
      if (!regex.test(regOrMisc.amount)) return { error: 'Invalid amount in Reg/Misc Fee', status: '400' };
    }

    if (data?.regOrMiscWithOldAndNew) {
      for (const regOrMisc of data.regMiscRowsNew) {
        const regex = /^\d+(\.\d{1,2})?$/;
        if (!regOrMisc.name || !regOrMisc.amount) return { error: 'Please fill all fields in Reg/Misc Fee', status: '400' };
        const nameOccurrences = data.regMiscRows.filter((row: any) => row.name === regOrMisc.name).length;
        if (nameOccurrences > 1) return { error: `Duplicate name found in REG/MISC: ${regOrMisc.name.toUpperCase()}`, status: '400' };
        if (!regex.test(regOrMisc.amount)) return { error: 'Invalid amount in Reg/Misc Fee', status: '400' };
        regOrMisc.amount = Number(regOrMisc.amount).toFixed(2);
      }
    }

    const dataToStore = {
      courseId: course._id,
      category: course.category,
      regOrMisc: data.regMiscRows,
      year: data.year,
      regOrMiscWithOldAndNew: data?.regOrMiscWithOldAndNew,
      ...(data?.regOrMiscWithOldAndNew ? { regOrMiscNew: data.regMiscRowsNew } : { regOrMiscNew: [] }),
      insuranceFee: Number(parse.data.insuranceFee).toFixed(2),
      ojtFee: Number(parse.data.ojtFee).toFixed(2),
      departmentalFee: Number(parse.data.departmentalFee).toFixed(2),
      ratePerUnit: Number(parse.data.ratePerUnit).toFixed(2),
      ssgFee: Number(parse.data.ssgFee).toFixed(2),
      passbookFee: Number(parse.data.passbookFee).toFixed(2),
      ratePerLab: Number(parse.data.ratePerLab).toFixed(2),
      cwtsOrNstpFee: Number(parse.data.cwtsOrNstpFee).toFixed(2),
      downPayment: Number(parse.data.downPayment).toFixed(2),
    };

    const createdDP = await updateCourseFeeById(tFee._id, dataToStore);
    if (!createdDP) return { error: 'Error creating', status: 500 };

    return { success: true, message: `Default Down Payment for the course ${data?.courseCode.toUpperCase()} has been created.`, id: tFee?._id.toString(), category: course.category, status: 201 };
  });
};
