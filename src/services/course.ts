'use server';
import Course from '@/models/Course';

export const createCourse = async (data: any) => {
  try {
    const newC = new Course({
      courseCode: data.courseCode,
      name: data.name,
      description: data.description,
    });
    const c = await newC.save();
    return c;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCourseByCrouseCode = async (courseCode: any) => {
  try {
    const c = await Course.findOne({ courseCode });
    return c;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCourseByName = async (name: any) => {
  try {
    const c = await Course.findOne({ name: name });
    return c;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const updateCoursePhotoById = async (id: any, imageUrl: any) => {
  try {
    const c = await Course.findByIdAndUpdate(id, { imageUrl: imageUrl }, { new: true });
    return c;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCourses = async () => {
  try {
    const courses = await Course.find().exec();
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.log(error);
    return [];
  }
}
