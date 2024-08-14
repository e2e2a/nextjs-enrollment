'use server';
import Course from '@/models/Course';

export const createCourse = async (data: any) => {
  try {
    const newC = new Course({
      title: data.title,
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

export const getCourseByTitle = async (title: any) => {
  try {
    const c = await Course.findOne({ title: title });
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
