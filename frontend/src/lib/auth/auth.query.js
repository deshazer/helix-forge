import { getErrorMessage } from '@/lib/utils'
import {
  queryOptions,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { toast } from 'sonner'
import {
  csrf,
  // forgotPassword,
  getAuthUser,
  isAuthenticated,
  login,
  logout,
  refreshToken,
} from './auth.api'
const SESSION_DURATION = 1000 * 60 * 30 // 30 minutes

export const authQueryKeys = {
  all: [{ entity: 'auth' }],
  csrf: () => [{ ...authQueryKeys.all[0], scope: 'csrf' }],
  isAuthenticated: () => [{ ...authQueryKeys.all[0], scope: 'authenticated' }],
  user: () => [{ ...authQueryKeys.all[0], scope: 'user' }],
  refreshToken: (beforeLoad) => [
    { ...authQueryKeys.all[0], scope: 'token', beforeLoad },
  ],
}

export const authQueries = {
  csrf: () =>
    queryOptions({
      queryKey: authQueryKeys.csrf(),
      queryFn: csrf,
      staleTime: Infinity,
      gcTime: Infinity,
    }),
  user: () =>
    queryOptions({
      queryKey: authQueryKeys.user(),
      queryFn: getAuthUser,
      // Once the user is logged in, there is really no reason to keep refetching their info
      // all the time. So, we'll allow this to stay in the cache for a long(ish) time.
      staleTime: SESSION_DURATION / 2,
      gcTime: SESSION_DURATION,
      retry: false,
    }),
  isAuthenticated: () =>
    queryOptions({
      queryKey: authQueryKeys.isAuthenticated(),
      queryFn: isAuthenticated,
      staleTime: SESSION_DURATION / 2,
      gcTime: SESSION_DURATION,
    }),
  refreshToken: (beforeLoad = true) =>
    queryOptions({
      queryKey: authQueryKeys.refreshToken(beforeLoad),
      queryFn: refreshToken,
      // We need this to keep the user's session cookie alive and well.
      staleTime: SESSION_DURATION / 2,
      gcTime: SESSION_DURATION / 2,
    }),
}

export function useAuthState(params = {}) {
  return useSuspenseQuery({ ...authQueries.user(), ...params })
}

export function useCsrf() {
  return useQuery(authQueries.csrf())
}

export function useRefreshToken() {
  return useSuspenseQuery(authQueries.refreshToken())
}

export function useLoginMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const search = useSearch({ strict: false })

  return useMutation({
    mutationFn: login,
    onSuccess: async () => {
      queryClient.setQueryData(authQueryKeys.isAuthenticated(), true)
      queryClient.setQueryData(authQueryKeys.refreshToken(), true)
      toast.success('Login successful')
      const redirect = search?.next || `/home`
      return navigate({ to: redirect })
    },
  })
}

export function useLogoutMutation() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const handleLogout = async () => {
    queryClient.setQueryData(authQueryKeys.isAuthenticated(), false)

    await navigate({ to: '/login' })

    toast.success('Logout successful')
  }

  return useMutation({
    mutationFn: logout,
    onSuccess: handleLogout,
    onError: async (error) => {
      // This means we were already logged out
      if (error?.response?.status === 401 || error?.response?.status === 419) {
        return await handleLogout()
      }

      console.error('logout error', error)
      queryClient.clear()
      toast.error('Logout failed', { description: getErrorMessage(error) })
    },
  })
}

// export function useSignUpMutation() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: signUp,
//     onSettled: () =>
//       queryClient.invalidateQueries({
//         queryKey: authQueryKeys.user(),
//         refetchType: 'all',
//       }),
//   })
// }
//
// // Submit a form with your email requesting a password reset link
// export function useForgotPasswordMutation() {
//   return useMutation({ mutationFn: forgotPassword })
// }
//
// // Submit a form with your new password
// export function useResetPasswordMutation() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: resetPassword,
//     onSettled: () =>
//       queryClient.invalidateQueries({
//         queryKey: authQueryKeys.user(),
//         refetchType: 'all',
//       }),
//   })
// }
//
// // Update user profile information
// export function useUpdateProfileMutation() {
//   const queryClient = useQueryClient()
//   return useMutation({
//     mutationFn: updateProfile,
//     onSuccess: () =>
//       queryClient.invalidateQueries({
//         queryKey: authQueryKeys.user(),
//         refetchType: 'all',
//       }),
//   })
// }
