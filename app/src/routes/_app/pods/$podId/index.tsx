import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/pods/$podId/')({
  beforeLoad: ({ params }) => {
    throw redirect({ to: '/pods/$podId/memories', params: { podId: params.podId } })
  },
})
