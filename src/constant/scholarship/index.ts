import { studentSemesterData, studentYearData } from '../enrollment';

export const isScholarshipApplicable = (currentYear: string, currentSemester: string, scholarship: any) => {
  const yearOrder = studentYearData.map((year) => year.title);
  const semesterOrder = studentSemesterData.map((semester) => semester.title);

  // Get the index of the current year and semester
  const currentYearIndex = yearOrder.indexOf(currentYear);
  const currentSemesterIndex = semesterOrder.indexOf(currentSemester);

  if (!scholarship) return false;

  // Get the index of the scholarship's starting year and semester
  const scholarshipYearIndex = yearOrder.indexOf(scholarship?.year);
  const scholarshipSemesterIndex = semesterOrder.indexOf(scholarship?.semester);

  // Check if the student has reached or passed the starting year and semester
  if (currentYearIndex > scholarshipYearIndex || (currentYearIndex === scholarshipYearIndex && currentSemesterIndex >= scholarshipSemesterIndex)) {
    return true; // Scholarship is applicable
  }

  return false; // Scholarship is not yet applicable
};


