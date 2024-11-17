import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { getAllCurriculumsResponse, getAllSchoolYearResponse, getAllStudentCurriculumsResponse, getCurriculumsResponse, getStudentCurriculumsResponse, IResponse } from '@/types';
import { deleteEnrollmentAction } from '@/action/college/enrollment/user';
import { removeTeacherScheduleCollegeMutation } from '@/action/college/schedules/teachers';
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
import { removeStudentScheduleAction } from '@/action/college/schedules/students';
const channel = new BroadcastChannel('my-channel');
// import { supabase } from './supabaseClient';

/**
 * Students Enrollment
 * @returns Queries and mutations
 */
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
