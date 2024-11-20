import { useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { deleteEnrollmentAction } from '@/action/college/enrollment/user';
import { removeTeacherScheduleCollegeMutation } from '@/action/college/schedules/teachers';
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
  return useMutation<any, Error, any>({
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
