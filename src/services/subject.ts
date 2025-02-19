'use server';
import Subject from '@/models/Subject';

// export const createSubjectCollege = async (data: any) => {
//   try {
//     const newS = new Subject({
//       ...data,
//     });
//     const s = await newS.save();
//     return s;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };
export const createNewSubject = async (data: any) => {
  try {
    const newS = new Subject({
      ...data,
    });
    const s = await newS.save();
    return s;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getSubjectByCategory = async (category: string) => {
  try {
    const subjects = await Subject.find({ category }).populate('courseId');
    return subjects;
  } catch (error) {
    console.log(error);
    return [];
  }
};
// export const getSubjectCategoryCollege = async () => {
//   try {
//     const subjects = await Subject.find({ category: 'College' });
//     return subjects;
//   } catch (error) {
//     console.log(error);
//     return [];
//   }
// };
export const getSubjectBySubjectCode = async (subjectCode: string) => {
  try {
    const subjects = await Subject.findOne({ subjectCode });
    return subjects;
  } catch (error) {
    console.log(error);
    return null;
  }
};
