import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import {
  checkTokenResponse,
  INewPost,
  INewUser,
  IUpdatePost,
  IUpdateUser,
  recoveryResponse,
  resetPasswordResponse,
  resetPasswordTokenResponse,
  SignInResponse,
  SignUpResponse,
  verificationCodeProcessResponse,
  verificationCodeResendResponse,
} from '@/types';
import { fetchAllUsers } from './api';
import { NewPasswordValidator, SigninValidator, SignupValidator } from './validators/Validator';
import { z } from 'zod';
import { signInAction, signUpAction } from '@/action/auth';
import { checkResetPasswordToken, checkToken } from '@/action/token';
import { verificationCodeProcess, verificationCodeResend } from '@/action/verification';
import { recoveryProcess, resetPassword } from '@/action/resetPassword';
import { NewPassword } from '@/action/profile/NewPassword';

// ============================================================
// AUTH QUERIES
// ============================================================
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
    refetchOnWindowFocus: false,
    // retryDelay: (attemptIndex) => attemptIndex * 1000,
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
