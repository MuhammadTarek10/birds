import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import { QueryProvider } from '#/lib/query/provider'
import { queryClient } from '#/lib/query/client'

const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  scrollRestoration: true,
  context: { queryClient },
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const onSessionEnded = () => {
  void router.navigate({ to: '/login' })
}

const rootElement = document.getElementById('app')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <QueryProvider onSessionEnded={onSessionEnded}>
      <RouterProvider router={router} />
    </QueryProvider>,
  )
}
