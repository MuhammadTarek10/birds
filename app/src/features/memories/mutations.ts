import type { InfiniteData } from '@tanstack/react-query'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { memoriesService } from './services/memories.service'
import { commentsService } from './services/comments.service'
import { memoryKeys } from './keys'
import { authKeys } from '#/features/auth/keys'
import type { Comment, MemoryListPage } from './types'
import type { Me } from '#/features/auth/types'

export const useCreateMemory = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: { title: string; eventDate: string; description?: string; location?: string }) =>
      memoriesService.create(podId, data),
    onSuccess: (memory) => {
      queryClient.invalidateQueries({ queryKey: memoryKeys.all(podId) })
      queryClient.setQueryData(memoryKeys.detail(memory.id), memory)
    },
    meta: { successMessage: 'Memory saved' },
  })
}

export const useUpdateMemory = (podId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { id: string; data: { title?: string; eventDate?: string; description?: string; location?: string } }) =>
      memoriesService.update(input.id, input.data),
    onSuccess: (memory) => {
      queryClient.setQueryData(memoryKeys.detail(memory.id), memory)
      queryClient.invalidateQueries({ queryKey: memoryKeys.all(podId) })
    },
    meta: { successMessage: 'Memory updated' },
  })
}

export const useDeleteMemory = (podId: string) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: (id: string) => memoriesService.delete(id).then(() => id),
    onSuccess: async (deletedId) => {
      queryClient.setQueryData<InfiniteData<MemoryListPage>>(
        memoryKeys.all(podId),
        (prev) =>
          prev
            ? {
                ...prev,
                pages: prev.pages.map((page) => ({
                  ...page,
                  memories: page.memories.filter((m) => m.id !== deletedId),
                })),
              }
            : prev,
      )
      queryClient.removeQueries({ queryKey: memoryKeys.detail(deletedId) })
      await navigate({ to: '/pods/$podId/memories', params: { podId } })
    },
    meta: { successMessage: 'Memory deleted' },
  })
}

export const useCreateComment = (memoryId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (content: string) => commentsService.create(memoryId, { content }),
    onMutate: async (content) => {
      await queryClient.cancelQueries({ queryKey: memoryKeys.comments(memoryId) })
      const previous = queryClient.getQueryData<Comment[]>(memoryKeys.comments(memoryId))

      const me = queryClient.getQueryData<Me | null>(authKeys.me)
      const tempComment: Comment = {
        id: `temp-${Date.now()}`,
        memoryId,
        userId: me?.id ?? '',
        content,
        createdAt: new Date().toISOString(),
        updatedAt: null,
        author: {
          id: me?.id ?? '',
          name: me
            ? [me.firstName, me.lastName].filter(Boolean).join(' ') || me.email
            : 'You',
        },
      }
      queryClient.setQueryData<Comment[]>(memoryKeys.comments(memoryId), (prev) =>
        prev ? [...prev, tempComment] : [tempComment],
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) {
        queryClient.setQueryData(memoryKeys.comments(memoryId), ctx.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: memoryKeys.comments(memoryId) })
    },
    meta: { silent: true },
  })
}

export const useUpdateComment = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: { id: string; content: string }) =>
      commentsService.update(input.id, { content: input.content }),
    onSuccess: (comment) => {
      queryClient.invalidateQueries({ queryKey: memoryKeys.comments(comment.memoryId) })
    },
    meta: { successMessage: 'Comment updated' },
  })
}

export const useDeleteComment = (memoryId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => commentsService.delete(id).then(() => id),
    onSuccess: (deletedId) => {
      queryClient.setQueryData<Comment[]>(memoryKeys.comments(memoryId), (prev) =>
        prev?.filter((c) => c.id !== deletedId),
      )
    },
    meta: { successMessage: 'Comment deleted' },
  })
}
