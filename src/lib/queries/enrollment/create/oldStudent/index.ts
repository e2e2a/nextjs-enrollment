import { createEnrollmentForOldStudentByCategoryAction } from '@/action/enrollment/create/oldStudent';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCreateEnrollmentForOldStudentByCategoryMutation = () => {
    const queryClient = useQueryClient();
    return useMutation<any, Error, any>({
        mutationFn: async (data) => createEnrollmentForOldStudentByCategoryAction(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userProfile'] });
            queryClient.invalidateQueries({ queryKey: ['Enrollment'] });
            queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
        },
    });
};
