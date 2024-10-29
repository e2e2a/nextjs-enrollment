import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import {
  getAllCurriculumsResponse,
  getAllSchoolYearResponse,
  getAllStudentCurriculumsResponse,
  getAllTeacherProfileResponse,
  getAllTeacherScheduleResponse,
  getCurriculumsResponse,
  getEnrollmentResponse,
  getSingleEnrollmentResponse,
  getStudentCurriculumsResponse,
  getTeacherProfileResponse,
  getTeacherScheduleResponse,
  IResponse,
} from '@/types';
import { createEnrollmentAction, deleteEnrollmentAction, getSingleEnrollmentAction, getSingleEnrollmentByUserIdIdAction, updateAddSubjectAction, updateDropSubjectAction } from '@/action/college/enrollment/user';
import {
  approvedEnrollmentStep1Action,
  approvedEnrollmentStep2Action,
  approvedEnrollmentStep3Action,
  approvedEnrollmentStep4Action,
  approvedEnrollmentStep5Action,
  approvedEnrollmentStep6Action,
  CollegeEndSemesterAction,
  getAllEnrollmentAction,
  getAllEnrollmentByTeacherScheduleIdAction,
  getEnrollmentByIdAction,
  getEnrollmentByStepAction,
  undoEnrollmentToStep1,
  undoEnrollmentToStep2,
  undoEnrollmentToStep3,
  undoEnrollmentToStep4,
} from '@/action/college/enrollment/admin';
import {
  createTeacherScheduleAction,
  getAllTeacherProfileAction,
  getAllTeacherScheduleAction,
  getTeacherProfileByIdAction,
  getTeacherProfileByUserIdAction,
  getTeacherScheduleByIdAction,
  getTeacherScheduleByProfileIdAction,
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

// export const useAllUsersQuery = () => {
//   return useQuery<any, Error>({
//     queryKey: ['AllUsers'],
//     queryFn: () => getAllUsersAction(),
//     retry: 0,
//     refetchOnWindowFocus: false,
//   });
// };


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
 * Admin Teacher Profile
 * @returns Queries And Mutations
 */
export const useAllTeacherProfileQuery = () => {
  return useQuery<getAllTeacherProfileResponse, Error>({
    queryKey: ['TeacherProfile'],
    queryFn: () => getAllTeacherProfileAction(),
    retry: 0,
    refetchOnWindowFocus: false,
  });
};

export const useTeacherProfileQueryById = (id: string) => {
  return useQuery<getTeacherProfileResponse, Error>({
    queryKey: ['TeacherProfileById', id],
    queryFn: () => getTeacherProfileByIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};

export const useTeacherProfileQueryByUserId = (id: string) => {
  return useQuery<getTeacherProfileResponse, Error>({
    queryKey: ['TeacherProfileByUserId', id],
    queryFn: () => getTeacherProfileByUserIdAction(id),
    enabled: !!id,
    retry: 0,
    refetchOnWindowFocus: false,
  });
};

/**
 * Instructor Query Students Schedules/Subjects
 * @returns Queries and mutations
 */
export const useAllEnrollmentByTeacherScheduleIdQuery = (data: any) => {
  return useQuery<any, Error>({
    queryKey: ['EnrollmentByTeacherScheduleId', data],
    queryFn: () => getAllEnrollmentByTeacherScheduleIdAction(data),
    enabled: !!data,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
/**
 * Students Enrollment
 * @returns Queries and mutations
 */
export const useEnrollmentQuery = (data: any) => {
  return useQuery<getSingleEnrollmentResponse, Error>({
    queryKey: ['Enrollment'],
    queryFn: () => getSingleEnrollmentAction(data),
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useEnrollmentQueryByUserId = (data: any) => {
  return useQuery<getSingleEnrollmentResponse, Error>({
    queryKey: ['EnrollmentByUserId'],
    queryFn: () => getSingleEnrollmentByUserIdIdAction(data),
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

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
export const useEnrollmentStep1Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<getEnrollmentResponse, Error, any>({
    mutationFn: async (data) => createEnrollmentAction(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['userProfile'] });
      queryClient.refetchQueries({ queryKey: ['Enrollment'] });
      queryClient.refetchQueries({ queryKey: ['EnrollmentByStep'] });
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
export const useAllEnrollmentQuery = (category: string) => {
  return useQuery<getEnrollmentResponse, Error>({
    queryKey: ['CollegeEnrollment', category],
    queryFn: () => getAllEnrollmentAction(category),
    enabled: !!category,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

export const useEnrollmentQueryByStep = (data: any) => {
  return useQuery<getEnrollmentResponse, Error>({
    queryKey: ['EnrollmentByStep', data],
    queryFn: () => getEnrollmentByStepAction(data),
    retry: 0,
    enabled: !!data,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useEnrollmentQueryById = (id: string) => {
  return useQuery<getSingleEnrollmentResponse, Error>({
    queryKey: ['EnrollmentById', id],
    queryFn: () => getEnrollmentByIdAction(id),
    retry: 0,
    enabled: !!id,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

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
//step1 approved
export const useApprovedEnrollmentStep1Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<getEnrollmentResponse, Error, any>({
    mutationFn: async (data) => approvedEnrollmentStep1Action(data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
      // const serverResponse = await myChannel.send({
      //   type: 'broadcast',
      //   event: 'message',
      //   payload: { message: [{queryKey: 'EnrollmentByStep'}, {querKey: 'Enrollment'}] },
      // });
      // console.log('Server response:', serverResponse);
      // Send a message to the channel
      channel.postMessage({ type: 'data-updated', queryKey: 'exampleQueryKey' });
    },
  });
};

//step2 approved
export const useApprovedEnrollmentStep2Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => approvedEnrollmentStep2Action(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};

//step3 approved
export const useApprovedEnrollmentStep3Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => approvedEnrollmentStep3Action(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};

//step4 approved
export const useApprovedEnrollmentStep4Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => approvedEnrollmentStep4Action(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};

//step5 approved
export const useApprovedEnrollmentStep5Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => approvedEnrollmentStep5Action(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.invalidateQueries({ queryKey: ['CollegeEnrollment'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};

//step6 approved
export const useApprovedEnrollmentStep6Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => approvedEnrollmentStep6Action(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.invalidateQueries({ queryKey: ['CollegeEnrollment'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};

//step2 undo
export const useUndoEnrollmentToStep1Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => undoEnrollmentToStep1(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};

//step3 undo
export const useUndoEnrollmentToStep2Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => undoEnrollmentToStep2(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};

//step4 undo
export const useUndoEnrollmentToStep3Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => undoEnrollmentToStep3(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['EnrollmentByStep'] });
      queryClient.invalidateQueries({ queryKey: ['EnrollmentById'] });
    },
  });
};

//step5 undo
export const useUndoEnrollmentToStep4Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => undoEnrollmentToStep4(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['EnrollmentByStep'] });
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
 * Instructor Teacher Schedule By Id
 * @returns Queries and mutations
 */
export const useTeacherScheduleCollegeQueryById = (data: any) => {
  return useQuery<getTeacherScheduleResponse, Error>({
    queryKey: ['TeacherScheduleByProfileId', data],
    queryFn: () => getTeacherScheduleByIdAction(data),
    retry: 0,
    enabled: !!data,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
/**
 * Admin Teacher Schedule Management
 * @returns Queries and mutations
 */
export const useTeacherScheduleCollegeQuery = () => {
  return useQuery<getAllTeacherScheduleResponse, Error>({
    queryKey: ['TeacherSchedule'],
    queryFn: () => getAllTeacherScheduleAction(),
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
export const useTeacherScheduleCollegeQueryByProfileId = (data: any) => {
  return useQuery<getAllTeacherScheduleResponse, Error>({
    queryKey: ['TeacherScheduleByProfileId', data],
    queryFn: () => getTeacherScheduleByProfileIdAction(data),
    retry: 0,
    enabled: !!data,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};

export const useCreateTeacherScheduleCollegeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createTeacherScheduleAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['TeacherSchedule'] });
      queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByProfileId'] });
    },
  });
};
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
