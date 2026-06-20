import { Outlet, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_app/pods/$podId/memories')({
  component: MemoriesLayout,
})

function MemoriesLayout() {
  return <Outlet />
}
