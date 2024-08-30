import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import {
  checkTokenResponse,
  getBlockCourseResponse,
  getCourseResponse,
  getEnrollmentResponse,
  getSingleEnrollmentResponse,
  getSingleProfileResponse,
  INewPost,
  INewUser,
  IResponse,
  IUpdatePost,
  IUpdateUser,
  recoveryResponse,
  resetPasswordResponse,
  resetPasswordTokenResponse,
  SignInResponse,
  SignUpResponse,
  testResponseaa,
  updateStudentProfileResponse,
  verificationCodeProcessResponse,
  verificationCodeResendResponse,
} from '@/types';
import { fetchAllUsers } from './api';
import { EnrollmentApprovedStep2, NewPasswordValidator, SigninValidator, SignupValidator, StudentProfileValidator } from './validators/Validator';
import { z } from 'zod';
import { signInAction, signUpAction } from '@/action/auth';
import { checkResetPasswordToken, checkToken } from '@/action/token';
import { verificationCodeProcess, verificationCodeResend } from '@/action/verification';
import { recoveryProcess, resetPassword } from '@/action/resetPassword';
import { NewPassword } from '@/action/profile/NewPassword';
import { updateStudentPhoto, updateStudentProfile } from '@/action/profile/updateData';
import { getStudentProfileBySessionId, getStudentProfileByUsernameAction } from '@/action/profile/getProfile';
import { createCourseAction, getAllCourses } from '@/action/courses';
import { createEnrollmentAction, deleteEnrollmentAction, getSingleEnrollmentAction } from '@/action/enrollment/user';
import { approvedEnrollmentStep1Action, approvedEnrollmentStep2Action, getEnrollmentByStepAction, undoEnrollmentToStep } from '@/action/enrollment/admin';
import { createCourseBlockAction, getAllBlockTypeAction } from '@/action/courses/blocks';
import { supabase } from './supabaseClient';
// ============================================================
// AUTH QUERIES
// ============================================================
const myChannel = supabase.channel('global-channel', {
  config: {
    broadcast: { ack: true },
  },
});
export const useSignInMutation = () => {
  return useMutation<SignInResponse, Error, z.infer<typeof SigninValidator>>({
    mutationFn: async (data) => signInAction(data),
  });
};

export const useSignUpMutation = () => {
  return useMutation<SignUpResponse, Error, z.infer<typeof SignupValidator>>({
    mutationFn: async (data) => signUpAction(data),
  });
};

export const useTokenCheckQuery = (token: string) => {
  return useQuery<checkTokenResponse, Error>({
    queryKey: ['TokenCheck', token],
    queryFn: async () => checkToken(token),
    retry: 0,
    refetchOnWindowFocus: false,
    // retryDelay: (attemptIndex) => attemptIndex * 1000,
  });
};

interface data {
  userId: string;
  verificationCode?: string;
  Ttype?: string;
}

export const useVerificationcCodeMutation = () => {
  return useMutation<verificationCodeProcessResponse, Error, any>({
    mutationFn: async (data) => verificationCodeProcess(data),
  });
};

export const useResendVCodeMutation = () => {
  return useMutation<verificationCodeResendResponse, Error, data>({
    mutationFn: async (data) => verificationCodeResend(data),
  });
};

// ============================================================
// AUTH Recovery
// ============================================================
export const useRecoveryMutation = () => {
  return useMutation<recoveryResponse, Error, data>({
    mutationFn: async (data) => recoveryProcess(data),
  });
};

export const useRecoveryTokenCheckQuery = (token: string) => {
  return useQuery<resetPasswordTokenResponse, Error>({
    queryKey: ['RecoveryTokenCheck', token],
    queryFn: async () => checkResetPasswordToken(token),
    retry: 0,
  });
};

export const useNewPasswordMutation = () => {
  return useMutation<resetPasswordResponse, Error, z.infer<typeof NewPasswordValidator>>({
    mutationFn: async (data) => resetPassword(data),
  });
};
export const useUserNewPasswordMutation = () => {
  return useMutation<resetPasswordResponse, Error, z.infer<typeof NewPasswordValidator>>({
    mutationFn: async (data) => NewPassword(data),
  });
};

interface User {
  id: string;
  image: string | null;
  firstname: string;
  lastname: string;
  username: string | null;
  bio: string | null;
  email: string | null;
  emailVerified: Date | null;
  role: string | null;
  // password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export const UseUserQuery = () => {
  return useQuery<
    {
      error: string;
      success: string;
      users: User[];
    },
    Error
  >({
    queryKey: ['Users'],
    queryFn: fetchAllUsers,
    retry: 0,
    // refetchInterval: 100,
    refetchOnWindowFocus: false,
    // retryDelay: (attemptIndex) => attemptIndex * 1000,
  });
};

export const useProfileQuery = (id: any) => {
  return useQuery<getSingleProfileResponse, Error>({
    queryKey: ['userProfile', id],
    queryFn: () => getStudentProfileBySessionId(id),
    retry: 0,
    refetchOnWindowFocus: false,
  });
};

export const useProfileQueryByUsername = (username: string) => {
  return useQuery<getSingleProfileResponse, Error>({
    queryKey: ['userProfile'],
    queryFn: () => getStudentProfileByUsernameAction(username),
    retry: 0,
    refetchOnWindowFocus: false,
  });
};

export const useUpdateProfilePhoto = () => {
  const queryClient = useQueryClient();
  return useMutation<updateStudentProfileResponse, Error, any>({
    mutationFn: async (data) => updateStudentPhoto(data),
    onSuccess: () => {
      // Invalidate the 'userProfile' query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};

export const useStudentProfileMutation = () => {
  return useMutation<updateStudentProfileResponse, Error, z.infer<typeof StudentProfileValidator>>({
    mutationFn: async (data) => updateStudentProfile(data),
  });
};

/**
 * Courses Queries And Mutations
 * @returns
 */
export const useCourseQuery = () => {
  return useQuery<getCourseResponse, Error>({
    queryKey: ['Course'],
    queryFn: () => getAllCourses(),
    retry: 0,
    refetchOnMount: false,
    // refetchInterval: 5000,
    refetchOnWindowFocus: true,
    // retryDelay: (attemptIndex) => attemptIndex * 1000,
  });
};

export const useCreateCourseMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<testResponseaa, Error, any>({
    mutationFn: async (data) => createCourseAction(data),
    onSuccess: () => {
      // Invalidate the 'userProfile' query to trigger a refetch
      queryClient.invalidateQueries({ queryKey: ['Course'] });
    },
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

export const useEnrollmentStep1Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<getEnrollmentResponse, Error, any>({
    mutationFn: async (data) => createEnrollmentAction(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['Enrollment'] });
    },
    onError: (error) => {
      console.error('Error during mutation:', error);
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
export const useEnrollmentQueryByStep = (step: any) => {
  return useQuery<getEnrollmentResponse, Error>({
    queryKey: ['EnrollmentByStep', step],
    queryFn: () => getEnrollmentByStepAction(step),
    retry: 0,
    enabled: !!step,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};

export const useApprovedEnrollmentStep1Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<getEnrollmentResponse, Error, any>({
    mutationFn: async (data) => approvedEnrollmentStep1Action(data),
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
      const serverResponse = await myChannel.send({
        type: 'broadcast',
        event: 'message',
        payload: { message: [{queryKey: 'EnrollmentByStep'}, {querKey: 'Enrollment'}] },
      });
      console.log('Server response:', serverResponse);

    },
  });
};

export const useApprovedEnrollmentStep2Mutation = () => {
  const queryClient = useQueryClient();
  return useMutation<getEnrollmentResponse, Error, z.infer<typeof EnrollmentApprovedStep2>>({
    mutationFn: async (data) => approvedEnrollmentStep2Action(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['EnrollmentByStep'] });
    },
  });
};

export const useUndoEnrollmentToStepMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<getEnrollmentResponse, Error, any>({
    mutationFn: async (data) => undoEnrollmentToStep(data),
    onSuccess: () => {
      queryClient.refetchQueries({ queryKey: ['EnrollmentByStep'] });
    },
  });
};

/**
 * Admin Course BlockType
 * @returns Queries and mutations
 */
export const useBlockCourseQuery = () => {
  return useQuery<getBlockCourseResponse, Error>({
    queryKey: ['BlockType'],
    queryFn: () => getAllBlockTypeAction(),
    retry: 0,
    refetchOnMount: false,
    // refetchInterval: 5000,
    refetchOnWindowFocus: true,
    // retryDelay: (attemptIndex) => attemptIndex * 1000,
  });
};

export const useCreateCourseBlockMutation = () => {
  const queryClient = useQueryClient();
  return useMutation<any, Error, any>({
    mutationFn: async (data) => createCourseBlockAction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['BlockType'] });
    },
  });
};
// ============================================================
// POST QUERIES
// ============================================================

//   export const useGetPosts = () => {
//     return useInfiniteQuery({
//       queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
//       queryFn: getInfinitePosts as any,
//       getNextPageParam: (lastPage: any) => {
//         // If there's no data, there are no more pages.
//         if (lastPage && lastPage.documents.length === 0) {
//           return null;
//         }

//         // Use the $id of the last document as the cursor.
//         const lastId = lastPage.documents[lastPage.documents.length - 1].$id;
//         return lastId;
//       },
//     });
//   };

// export const useSearchPosts = (searchTerm: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
//     queryFn: () => searchPosts(searchTerm),
//     enabled: !!searchTerm,
//   });
// };

// export const useGetRecentPosts = () => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//     queryFn: getRecentPosts,
//   });
// };

// export const useCreatePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (post: INewPost) => createPost(post),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//     },
//   });
// };

// export const useGetPostById = (postId?: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
//     queryFn: () => getPostById(postId),
//     enabled: !!postId,
//   });
// };

// export const useGetUserPosts = (userId?: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_USER_POSTS, userId],
//     queryFn: () => getUserPosts(userId),
//     enabled: !!userId,
//   });
// };

// export const useUpdatePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (post: IUpdatePost) => updatePost(post),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
//       });
//     },
//   });
// };

// export const useDeletePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ postId, imageId }: { postId?: string; imageId: string }) =>
//       deletePost(postId, imageId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//     },
//   });
// };

// export const useLikePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({
//       postId,
//       likesArray,
//     }: {
//       postId: string;
//       likesArray: string[];
//     }) => likePost(postId, likesArray),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };

// export const useSavePost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: ({ userId, postId }: { userId: string; postId: string }) =>
//       savePost(userId, postId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };

// export const useDeleteSavedPost = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_POSTS],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//     },
//   });
// };

// // ============================================================
// // USER QUERIES
// // ============================================================

// export const useGetCurrentUser = () => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//     queryFn: getCurrentUser,
//   });
// };

// export const useGetUsers = (limit?: number) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_USERS],
//     queryFn: () => getUsers(limit),
//   });
// };

// export const useGetUserProfileByUsername = (username: string) => {
//   return useQuery({
//     queryKey: [QUERY_KEYS.GET_USER_PROFILE, username],
//     queryFn: () => getUserProfileByUsername(username),
//     enabled: !!username,
//   });
// };

// export const useUpdateUser = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (user: IUpdateUser) => updateUser(user),
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_CURRENT_USER],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id],
//       });
//     },
//   });
// };
