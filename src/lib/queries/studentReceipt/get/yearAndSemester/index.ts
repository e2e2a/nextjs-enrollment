import { getAllStudentReceiptByUserIdAndYearAndSemesterAction } from '@/action/studentReceipt/get/yearAndSemester';
import { useQuery } from '@tanstack/react-query';

export const useStudentReceiptQueryByUserIdAndYearAndSemester = (userId: string, year: string, semester: string, schoolYear: string) => {
  return useQuery<any, Error>({
    queryKey: ['StudentReceiptByUserIdAndYearAndSemester', `${userId}-${year}-${semester}-${schoolYear}`],
    queryFn: () => getAllStudentReceiptByUserIdAndYearAndSemesterAction(userId, year, semester, schoolYear),
    enabled: !!userId && !!year && !!semester && !!schoolYear,
    retry: 0,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
  });
};
