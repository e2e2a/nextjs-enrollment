'use server';
import Course from '@/models/Course';

export const createCourse = async (data: any) => {
  try {
    const newC = new Course({
      courseCode: data.courseCode,
      name: data.name,
      category: data.category,
      description: data.description,
    });
    // const c = await newC.save();
    return newC;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCourseByCourseCode = async (courseCode: any) => {
  try {
    const c = await Course.findOne({ courseCode, archive: { $ne: true } });
    return c;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getCourseByName = async (name: any) => {
  try {
    const c = await Course.findOne({ name: name, archive: { $ne: true } });
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
    const courses = await Course.find({ archive: { $ne: true } }).exec();
    return JSON.parse(JSON.stringify(courses));
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getCoursesByCategory = async (category: string) => {
  try {
    const courses = await Course.find({ category, archive: { $ne: true } }).exec();
    return courses;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getAllCoursesByCategory = async (category: string) => {
  try {
    const courses = await Course.find({ category }).exec();
    return courses;
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getCoursesById = async (id: string) => {
  try {
    const course = await Course.findById(id).exec();
    return course;
  } catch (error) {
    console.log(error);
    return null;
  }
};
