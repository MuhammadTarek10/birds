import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { toast } from '#/lib/toasts'
import { writeLastPodId } from './hooks/use-last-pod-id'
import { podKeys } from './keys'
import { podsService } from './services/pods.service'
import type { PodMember, PodRole, PodSummary } from './types'

export const useCreatePod = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (name: string) => podsService.create(name),
    onSuccess: async (pod) => {
      queryClient.setQueryData<Array<PodSummary>>(podKeys.all, (prev) =>
        prev ? [...prev, pod] : [pod],
      )
      queryClient.setQueryData(podKeys.detail(pod.id), pod)
      writeLastPodId(pod.id)
      toast.success('Pod created', `${pod.name} is ready for memories.`)
      await navigate({ to: '/pods/$podId', params: { podId: pod.id } })
    },
  })
}

export const useRenamePod = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (name: string) => podsService.rename(podId, name),
    onSuccess: (pod) => {
      queryClient.setQueryData(podKeys.detail(podId), pod)
      queryClient.setQueryData<Array<PodSummary>>(podKeys.all, (prev) =>
        prev?.map((p) => (p.id === podId ? { ...p, name: pod.name } : p)),
      )
      toast.success('Pod renamed', `Now called ${pod.name}.`)
    },
  })
}

export const useUpdateMemberRole = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { targetUserId: string; role: PodRole }) =>
      podsService.updateRole(podId, input.targetUserId, input.role),
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: podKeys.members(podId) })
      const previous = queryClient.getQueryData<Array<PodMember>>(
        podKeys.members(podId),
      )
      queryClient.setQueryData<Array<PodMember>>(podKeys.members(podId), (prev) =>
        prev?.map((m) =>
          m.user.id === input.targetUserId ? { ...m, role: input.role } : m,
        ),
      )
      return { previous }
    },
    onSuccess: (member) => {
      queryClient.setQueryData<Array<PodMember>>(podKeys.members(podId), (prev) =>
        prev?.map((m) => (m.user.id === member.user.id ? member : m)),
      )
      const role = member.role === 'admin' ? 'made admin' : 'demoted to member'
      toast.success('Member updated', `${member.user.email} ${role}.`)
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(podKeys.members(podId), ctx.previous)
      }
    },
    meta: { silent: true },
  })
}

export const useRemoveMember = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (targetUserId: string) =>
      podsService.removeMember(podId, targetUserId).then(() => targetUserId),
    onSuccess: (targetUserId) => {
      queryClient.setQueryData<Array<PodMember>>(podKeys.members(podId), (prev) =>
        prev?.filter((m) => m.user.id !== targetUserId),
      )
      queryClient.setQueryData<PodSummary | undefined>(podKeys.detail(podId), (prev) =>
        prev ? { ...prev, memberCount: Math.max(0, prev.memberCount - 1) } : prev,
      )
    },
    meta: { successMessage: 'Member removed' },
  })
}

export const useLeavePod = (podId: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (currentUserId: string) =>
      podsService.removeMember(podId, currentUserId),
    onSuccess: async () => {
      queryClient.setQueryData<Array<PodSummary>>(podKeys.all, (prev) =>
        prev?.filter((p) => p.id !== podId),
      )
      queryClient.removeQueries({ queryKey: podKeys.detail(podId) })
      queryClient.removeQueries({ queryKey: podKeys.members(podId) })
      writeLastPodId(null)
      await navigate({ to: '/' })
    },
    meta: { successMessage: 'You left the pod' },
  })
}
