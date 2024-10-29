import { adminCreateUserWithRoleAction } from '@/action/user/create';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useAdminCreateUserRoleMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => adminCreateUserWithRoleAction(data),
    onSuccess: (data) => {
      if (data.role) {
        if (data.role === 'ADMIN') {
          queryClient.invalidateQueries({ queryKey: ['Admins'] });
          queryClient.invalidateQueries({ queryKey: ['userAdminProfile'] });
        } else if (data.role === 'DEAN') {
          /**
           * @todo invalidate user role DEAN
           */
        } else if (data.role === 'TEACHER') {
          queryClient.invalidateQueries({ queryKey: ['Teachers'] });
          queryClient.invalidateQueries({ queryKey: ['TeacherSchedule'] });
          queryClient.invalidateQueries({ queryKey: ['TeacherScheduleByProfileId'] });
        } else if (data.role === 'STUDENT') {
          queryClient.invalidateQueries({ queryKey: ['Students'] });
        }
      }
    },
  });
};
