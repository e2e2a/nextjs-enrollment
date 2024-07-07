import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/lib/queryKeys';
// import {
//   // createUserAccount,
//   // signInAccount,
//   // getCurrentUser,
//   // signOutAccount,
//   // getUsers,
//   // createPost,
//   // getPostById,
//   // updatePost,
//   // getUserPosts,
//   // deletePost,
//   // likePost,
//   getUserProfileByUsername,
//   // updateUser,
//   // getRecentPosts,
//   // getInfinitePosts,
//   // searchPosts,
//   // savePost,
//   // deleteSavedPost,
// } from "@/lib/api";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from '@/types';
import { fetchNewPassword, fetchRecoveryEmail, fetchRecoveryTokenEmail, fetchResendVCode, fetchSignIn, fetchSignUp, fetchTokenEmail, fetchVerficationCode } from './api';
import { NewPasswordValidator, SigninValidator, SignupValidator } from './validators/Validator';
import { z } from 'zod';

// ============================================================
// AUTH QUERIES
// ============================================================
export const useSignUpMutation = () => {
  return useMutation<{ success: string; token: string; error: string }, Error, z.infer<typeof SignupValidator>>({
    mutationFn: fetchSignUp,
  });
};

export const useSignInMutation = () => {
  return useMutation<{ error: string, token?: string }, Error, z.infer<typeof SigninValidator>>({
    mutationFn: fetchSignIn,
  });
};

interface data {
  email: string;
  verificationCode?: string;
  Ttype?: string;
}
export const useVerificationcCodeMutation = () => {
  return useMutation<
    {
      error: string;
      success: string;
      token?: {
        id: string;
        email: string;
        token: string;
        expires: Date;
        createdAt: Date;
        updatedAt: Date;
      };
    },
    Error,
    data
  >({
    mutationFn: fetchVerficationCode,
  });
};

export const useResendVCodeMutation = () => {
  return useMutation<
    {
      error: string;
      success: string;
      verification: {
        id: string;
        email: string;
        token: string;
        code: string;
        expires: Date;
        expiresCode: Date;
      };
    },
    Error,
    data
  >({
    mutationFn: fetchResendVCode,
  });
};

export const useRecoveryMutation = () => {
  return useMutation<
    {
      error: string;
      success: string;
      token: string;
    },
    Error,
    data
  >({
    mutationFn: fetchRecoveryEmail,
  });
};

interface tokenCheck {
  token: string;
  Ttype?: string;
}

export const useTokenCheckQuery = (data: tokenCheck) => {
  return useQuery<
    {
      error: string;
      success: string;
      existingToken: {
        id: string;
        email: string;
        token: string;
        code: string;
        tokenType: string;
        expires: Date;
        expiresCode: Date;
      };
    },
    Error
  >({
    queryKey: ['TokenCheck', data],
    queryFn: fetchTokenEmail,
    retry: 0,
    // retryDelay: (attemptIndex) => attemptIndex * 1000,
  });
};

// ============================================================
// AUTH Recovery
// ============================================================
export const useRecoveryTokenCheckQuery = (data: tokenCheck) => {
  return useQuery<
    {
      error: string;
      success: string;
      existingToken: {
        id: string;
        email: string;
        token: string;
        code: string;
        tokenType: string;
        expires: Date;
        expiresCode: Date;
      };
    },
    Error
  >({
    queryKey: ['RecoveryTokenCheck', data],
    queryFn: fetchRecoveryTokenEmail,
    retry: 0,
    // retryDelay: (attemptIndex) => attemptIndex * 1000,
  });
};

export const useNewPasswordMutation = () => {
  return useMutation<
    {
      error: string;
      success: string;
    },
    Error,
    z.infer<typeof NewPasswordValidator>
  >({
    mutationFn: fetchNewPassword,
  });
};

// export const useCreateUserAccount = () => {
//   return useMutation({
//     mutationFn: (user: INewUser) => createUserAccount(user),
//   });
// };

// export const useSignInAccount = () => {
//   return useMutation({
//     mutationFn: (user: { email: string; password: string }) =>
//       signInAccount(user),
//   });
// };

// export const useSignOutAccount = () => {
//   return useMutation({
//     mutationFn: signOutAccount,
//   });
// };

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
