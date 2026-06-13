import { createFileRoute } from '@tanstack/react-router'
import { Text } from '#/components/ui/Text'
import { useMe } from '#/features/auth/hooks/use-me'

export const Route = createFileRoute('/_app/')({
  component: Home,
})

function Home() {
  const me = useMe()
  const firstName = me.data?.firstName

  return (
    <main className="mx-auto max-w-4xl px-8 py-16 flex flex-col gap-stack-md">
      <Text as="span" variant="label-md">
        Your archive
      </Text>
      <Text as="h1" variant="display-lg" className="text-on-surface italic">
        {firstName ? `Welcome back, ${firstName}.` : 'Welcome back.'}
      </Text>
      <Text variant="body-lg" className="text-on-surface-variant max-w-prose">
        Pods, memories, and quiet rituals will land here. For now, your vault is
        ready and waiting.
      </Text>
    </main>
  )
}
