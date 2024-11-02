import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import {
  getAllCurriculumsResponse,
  getAllSchoolYearResponse,
  getAllStudentCurriculumsResponse,
  getCurriculumsResponse,
  getStudentCurriculumsResponse,
  IResponse,
} from '@/types';
import { deleteEnrollmentAction, updateAddSubjectAction, updateDropSubjectAction } from '@/action/college/enrollment/user';
import {
  CollegeEndSemesterAction,
} from '@/action/college/enrollment/admin';
import {
  removeTeacherScheduleCollegeMutation,
} from '@/action/college/schedules/teachers';
import { createSchoolYearAction, getAllSchoolYearAction } from '@/action/schoolyear';
import {
  createStudentCurriculumAction,
  getAllCurriculumAction,
  getAllStudentCurriculumAction,
  getCurriculumByCourseIdAction,
  getCurriculumByIdAction,
  getStudentCurriculumByStudentIdAction,
  updateCurriculumByIdAction,
  updateCurriculumSubjectByIdAction,
  updateStudentCurriculumByIdAction,
  updateStudentCurriculumSubjectByIdAction,
} from '@/action/college/curriculums';
import { removeCourseBlockScheduleAction } from '@/action/college/schedules/blocks';
import { removeStudentScheduleAction, updateStudentEnrollmentScheduleAction, updateStudentEnrollmentScheduleRequestStatusAction, updateStudentEnrollmentScheduleSuggestedSubjectAction } from '@/action/college/schedules/students';
import { getEnrollmentSetup, updateEnrollmentSetup } from '@/action/enrollmentSetup';
import { updateStudentEnrollmentScheduleBySuggestedSubjectAction } from '@/action/college/schedules/students/students';
import { createTeacherReportGradeAction, getAllTeacherReportGradeAction, getTeacherReportGradeByIdAction, updateTeacherReportGradeStatusByIdAction } from '@/action/college/schedules/teachers/reportGrade/teacher';
import { evaluateApprovedGradeReportAction } from '@/action/college/schedules/teachers/reportGrade/admin';
import {
  getAllStudentEnrollmentRecordCollegeAction,
  getAllTeacherScheduleRecordByCollegeAction,
  getStudentEnrollmentRecordByIdAction,
  getStudentEnrollmentRecordByProfileIdAction,
  getTeacherScheduleRecordByIdAction,
  getTeacherScheduleRecordByProfileIdAction,
} from '@/action/college/records/admin';
const channel = new BroadcastChannel('my-channel');
// import { supabase } from './supabaseClient';
/**
 *
 * @returns EnrollmentSetup
 */

export const useEnrollmentSetupQuery = () => {
  return useQuery<any, Error>({
    queryKey: ['EnrollmentSetup'],
    queryFn: () => getEnrollmentSetup(),
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
export const useUpdateEnrollmentSetupMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateEnrollmentSetup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['EnrollmentSetup'] });
    },
  });
};
/**
 * College End Semester
 * @returns
 */
export const useCollegeEndSemesterMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => CollegeEndSemesterAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByUserId'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentSetup'] });
    },
  });
};

/**
 * Teacher Grade Report
 * @returns
 */
export const useAllTeacherReportGradeQuery = () => {
  return useQuery<any, Error>({
    queryKey: ['TeacherReportGrade'],
    queryFn: () => getAllTeacherReportGradeAction(),
    retry: 0,
    refetchOnWindowFocus: false,
  });
};
export const useTeacherReportGradeQueryById = (id: any) => {
  return useQuery<any, Error>({
    queryKey: ['TeacherReportGradeById', id],
    enabled: !!id,
    queryFn: () => getTeacherReportGradeByIdAction(id),
    retry: 0,
    refetchOnWindowFocus: false,
  });
};

export const useCreateGradeReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createTeacherReportGradeAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['TeacherReportGrade'] });
      queryClient.invalidateQueries({ queryKey: ['TeacherReportGradeById'] });
    },
  });
};

/**
 * Dean changing Status of grade report
 * @returns
 */
export const useChangeStatusGradeReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateTeacherReportGradeStatusByIdAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['TeacherReportGrade'] });
      queryClient.invalidateQueries({ queryKey: ['TeacherReportGradeById'] });
    },
  });
};

/**
 * Admin Evaluate of grade report
 * @returns
 */
export const useEvaluateApprovedGradeReportMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => evaluateApprovedGradeReportAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['TeacherReportGrade'] });
      queryClient.invalidateQueries({ queryKey: ['TeacherReportGradeById'] });
    },
  });
};

/**
 * Students Enrollment
 * @returns Queries and mutations
 */

export const useDropSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateDropSubjectAction(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['CollegeEnrollment'] });
      queryClient.refetchQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.refetchQueries({ queryKey: ['EnrollmentById'] });
      queryClient.refetchQueries({ queryKey: ['EnrollmentByUserId'] });
    },
  });
};

export const useAddSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateAddSubjectAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByUserId'] });
      queryClient.invalidateQueries({ queryKey: ['BlockType'] });
    },
  });
};

export const useEnrollmentDeleteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<IResponse, Error, any>({
    mutationFn: async (data) => deleteEnrollmentAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
    },
  });
};

/**
 * Admin Enrollment
 * @returns Queries and mutations
 */
export const useUpdateStudentEnrollmentScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentEnrollmentScheduleAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};
export const useUpdateStudentEnrollmentScheduleBySuggestedSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentEnrollmentScheduleBySuggestedSubjectAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByUserId'] });
    },
  });
};

export const useUpdateStudentEnrollmentScheduleSuggestedSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentEnrollmentScheduleSuggestedSubjectAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByUserId'] });
      queryClient.invalidateQueries({ queryKey: ['BlockType'] });
    },
  });
};

export const useUpdateStudentEnrollmentScheduleRequestStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentEnrollmentScheduleRequestStatusAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByUserId'] });
      queryClient.invalidateQueries({ queryKey: ['BlockType'] });
    },
  });
};

export const useRemoveStudentScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => removeStudentScheduleAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};

/**
 * Admin Course BlockType
 * @returns Queries and mutations
 */
export const useRemoveCourseBlockScheduleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => removeCourseBlockScheduleAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['BlockType'] });
      queryClient.invalidateQueries({ queryKey: ['BlockTypeById'] });
      queryClient.invalidateQueries({ queryKey: ['TeacherSchedule'] });
      queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByProfileId'] });
    },
  });
};

/**
 * Admin Teacher Schedule Management
 * @returns Queries and mutations
 */
export const useRemoveTeacherScheduleCollegeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => removeTeacherScheduleCollegeMutation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['TeacherSchedule'] });
      queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByProfileId'] });
    },
  });
};

/**
 * Admin School Year
 * @returns Queries and mutations
 */
export const useSchoolYearQuery = () => {
  return useQuery<getAllSchoolYearResponse, Error>({
    queryKey: ['SchoolYear'],
    queryFn: () => getAllSchoolYearAction(),
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};

export const useCreateSchoolYearMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createSchoolYearAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['SchoolYear'] });
    },
  });
};

/**
 * Admin Curriculum
 * @returns Queries and mutations
 */
export const useCurriculumQuery = () => {
  return useQuery<getAllCurriculumsResponse, Error>({
    queryKey: ['Curriculum'],
    queryFn: () => getAllCurriculumAction(),
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};

export const useProspectusQueryById = (id: any) => {
  return useQuery<getCurriculumsResponse, Error>({
    queryKey: ['CurriculumById', id],
    queryFn: () => getCurriculumByIdAction(id),
    retry: 0,
    enabled: !!id,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
export const useCurriculumQueryByCourseId = (course: any) => {
  return useQuery<getCurriculumsResponse, Error>({
    queryKey: ['CurriculumByCourse', course],
    queryFn: () => getCurriculumByCourseIdAction(course),
    retry: 0,
    enabled: !!course,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};

export const useUpdateCurriculumLayerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateCurriculumByIdAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Curriculum'] });
      queryClient.invalidateQueries({ queryKey: ['CurriculumById'] });
      queryClient.invalidateQueries({ queryKey: ['CurriculumByCourse'] });
    },
  });
};

export const useUpdateCurriculumLayerSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateCurriculumSubjectByIdAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Curriculum'] });
      queryClient.invalidateQueries({ queryKey: ['CurriculumById'] });
      queryClient.invalidateQueries({ queryKey: ['CurriculumByCourse'] });
    },
  });
};

/**
 * Admin Student Curriculum
 * @returns Queries and mutations
 */
export const useStudentCurriculumQuery = () => {
  return useQuery<getAllStudentCurriculumsResponse, Error>({
    queryKey: ['StudentCurriculum'],
    queryFn: () => getAllStudentCurriculumAction(),
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};

export const useStudentCurriculumQueryByStudentId = (id: any) => {
  return useQuery<getStudentCurriculumsResponse, Error>({
    queryKey: ['StudentCurriculumById', id],
    queryFn: () => getStudentCurriculumByStudentIdAction(id),
    retry: 0,
    enabled: !!id,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};

export const useCreateStudentCurriculumMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createStudentCurriculumAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['StudentCurriculum'] });
      queryClient.invalidateQueries({ queryKey: ['StudentCurriculumById'] });
    },
  });
};

export const useUpdateStudentCurriculumLayerMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentCurriculumByIdAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['StudentCurriculum'] });
      queryClient.invalidateQueries({ queryKey: ['StudentCurriculumById'] });
    },
  });
};

export const useUpdateStudentCurriculumLayerSubjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => updateStudentCurriculumSubjectByIdAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['StudentCurriculum'] });
      queryClient.invalidateQueries({ queryKey: ['StudentCurriculumById'] });
    },
  });
};

/**
 * Teacher Schedule Record
 * @returns
 *
 */
export const useTeacherScheduleRecordByProfileIdQuery = (profileId: any) => {
  return useQuery<any, Error>({
    queryKey: ['TeacherScheduleRecordByProfileId', profileId],
    queryFn: () => getTeacherScheduleRecordByProfileIdAction(profileId),
    enabled: !!profileId,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
export const useTeacherScheduleRecordByIdQuery = (profileId: any) => {
  return useQuery<any, Error>({
    queryKey: ['TeacherScheduleRecordById', profileId],
    queryFn: () => getTeacherScheduleRecordByIdAction(profileId),
    enabled: !!profileId,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
/**
 * queries for students records
 * @returns
 */
export const useStudentEnrollmentRecordByProfileIdQuery = (profileId: any) => {
  return useQuery<any, Error>({
    queryKey: ['StudentEnrollmentRecordByProfileId', profileId],
    queryFn: () => getStudentEnrollmentRecordByProfileIdAction(profileId),
    enabled: !!profileId,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
export const useStudentEnrollmentRecordByIdQuery = (profileId: any) => {
  return useQuery<any, Error>({
    queryKey: ['StudentEnrollmentRecordById', profileId],
    queryFn: () => getStudentEnrollmentRecordByIdAction(profileId),
    enabled: !!profileId,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
/**
 * queries for all enrollment records and schedules record for instructors
 * @returns
 */
export const useAllStudentEnrollmentRecordCollegeQuery = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['StudentEnrollmentRecordCollege', category],
    queryFn: () => getAllStudentEnrollmentRecordCollegeAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};

export const useTeacherScheduleRecordCollegeQuery = (category: string) => {
  return useQuery<any, Error>({
    queryKey: ['TeacherScheduleRecordCollege', category],
    queryFn: () => getAllTeacherScheduleRecordByCollegeAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
