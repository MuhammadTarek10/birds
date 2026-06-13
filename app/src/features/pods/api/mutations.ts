import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { api } from '#/lib/api/client'
import { toast } from '#/lib/toasts'
import { writeLastPodId } from '../hooks/use-last-pod-id'
import {
  PODS_KEY,
  podKey,
  podMembersKey
  
  
  
} from './queries'
import type {PodMember, PodRole, PodSummary} from './queries';

export const useCreatePod = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (name: string): Promise<PodSummary> => {
      const res = await api.post<PodSummary>('/pods', { name })
      return res.data
    },
    onSuccess: async (pod) => {
      queryClient.setQueryData<Array<PodSummary>>(PODS_KEY, (prev) =>
        prev ? [...prev, pod] : [pod],
      )
      queryClient.setQueryData(podKey(pod.id), pod)
      writeLastPodId(pod.id)
      toast.success('Pod created', `${pod.name} is ready for memories.`)
      await navigate({ to: '/pods/$podId', params: { podId: pod.id } })
    },
    onError: (err: Error) => toast.error("Couldn't create pod", err.message),
  })
}

export const useRenamePod = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (name: string): Promise<PodSummary> => {
      const res = await api.patch<PodSummary>(`/pods/${podId}`, { name })
      return res.data
    },
    onSuccess: (pod) => {
      queryClient.setQueryData(podKey(podId), pod)
      queryClient.setQueryData<Array<PodSummary>>(PODS_KEY, (prev) =>
        prev?.map((p) => (p.id === podId ? { ...p, name: pod.name } : p)),
      )
      toast.success('Pod renamed', `Now called ${pod.name}.`)
    },
    onError: (err: Error) => toast.error("Couldn't rename pod", err.message),
  })
}

export const useUpdateMemberRole = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: { targetUserId: string; role: PodRole }) => {
      const res = await api.patch<PodMember>(
        `/pods/${podId}/members/${input.targetUserId}`,
        { role: input.role },
      )
      return res.data
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: podMembersKey(podId) })
      const previous = queryClient.getQueryData<Array<PodMember>>(
        podMembersKey(podId),
      )
      queryClient.setQueryData<Array<PodMember>>(podMembersKey(podId), (prev) =>
        prev?.map((m) =>
          m.user.id === input.targetUserId ? { ...m, role: input.role } : m,
        ),
      )
      return { previous }
    },
    onSuccess: (member) => {
      queryClient.setQueryData<Array<PodMember>>(podMembersKey(podId), (prev) =>
        prev?.map((m) => (m.user.id === member.user.id ? member : m)),
      )
      const role = member.role === 'admin' ? 'made admin' : 'demoted to member'
      toast.success('Member updated', `${member.user.email} ${role}.`)
    },
    onError: (err: Error, _input, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(podMembersKey(podId), ctx.previous)
      }
      toast.error("Couldn't change role", err.message)
    },
  })
}

export const useRemoveMember = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (targetUserId: string) => {
      await api.delete(`/pods/${podId}/members/${targetUserId}`)
      return targetUserId
    },
    onSuccess: (targetUserId) => {
      queryClient.setQueryData<Array<PodMember>>(podMembersKey(podId), (prev) =>
        prev?.filter((m) => m.user.id !== targetUserId),
      )
      queryClient.setQueryData<PodSummary | undefined>(podKey(podId), (prev) =>
        prev ? { ...prev, memberCount: Math.max(0, prev.memberCount - 1) } : prev,
      )
      toast.success('Member removed')
    },
    onError: (err: Error) => toast.error("Couldn't remove member", err.message),
  })
}

export const useLeavePod = (podId: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: async (currentUserId: string) => {
      await api.delete(`/pods/${podId}/members/${currentUserId}`)
      return currentUserId
    },
    onSuccess: async () => {
      queryClient.setQueryData<Array<PodSummary>>(PODS_KEY, (prev) =>
        prev?.filter((p) => p.id !== podId),
      )
      queryClient.removeQueries({ queryKey: podKey(podId) })
      queryClient.removeQueries({ queryKey: podMembersKey(podId) })
      writeLastPodId(null)
      toast.success('You left the pod')
      await navigate({ to: '/' })
    },
    onError: (err: Error) => toast.error("Couldn't leave pod", err.message),
  })
}
