import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Button } from '#/components/ui/Button'
import { Card } from '#/components/ui/Card'
import { Label } from '#/components/ui/Label'
import { Text } from '#/components/ui/Text'
import { TextInput } from '#/components/ui/TextInput'
import {
  ChevronRightIcon,
  HeartIcon,
  LogOutIcon,
  PlusIcon,
  SettingsIcon,
  UserIcon,
} from '#/components/ui/icons'
import { Heart, Plus } from 'lucide-react'

export const Route = createFileRoute('/_dev/atoms')({
  component: AtomsShowcase,
})

function AtomsShowcase() {
  const [email, setEmail] = useState('')
  const [bad, setBad] = useState('not-an-email')

  return (
    <main className="mx-auto max-w-4xl px-8 py-16 flex flex-col gap-section">
      <header className="flex flex-col gap-2">
        <Text as="span" variant="label-md">
          Foundation Showcase
        </Text>
        <Text as="h1" variant="display-lg">
          Atoms
        </Text>
        <Text variant="body-lg">
          Every primitive rendered against the Birds palette. Visual smoke test for the foundation.
        </Text>
      </header>

      <section className="flex flex-col gap-stack-md">
        <Text as="h2" variant="headline-lg">
          Typography
        </Text>
        <Text as="h3" variant="title-md">
          Title medium
        </Text>
        <Text variant="body-md">
          Body medium &mdash; EB Garamond. The quick brown fox jumps over the lazy dog.
        </Text>
        <Text as="span" variant="label-md">
          Label medium
        </Text>
      </section>

      <section className="flex flex-col gap-stack-md">
        <Text as="h2" variant="headline-lg">
          Buttons
        </Text>
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Primary</Button>
          <Button variant="gold">Gold</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <div className="flex flex-wrap gap-4">
          <Button leading={Heart} variant="primary">
            Save memory
          </Button>
          <Button trailing={Plus} variant="gold">
            New pod
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-stack-md">
        <Text as="h2" variant="headline-lg">
          Text inputs
        </Text>
        <div className="grid gap-stack-md sm:grid-cols-2">
          <TextInput
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            help="We'll never share it."
          />
          <TextInput
            label="Invalid email"
            value={bad}
            onChange={(e) => setBad(e.target.value)}
            error="Enter a valid email address."
          />
          <TextInput label="Disabled" value="locked" disabled readOnly />
          <TextInput label="With placeholder hint" placeholder=" " />
        </div>
      </section>

      <section className="flex flex-col gap-stack-md">
        <Text as="h2" variant="headline-lg">
          Labels
        </Text>
        <div className="flex flex-wrap gap-6">
          <Label>Section title</Label>
          <Label>Metadata</Label>
        </div>
      </section>

      <section className="flex flex-col gap-stack-md">
        <Text as="h2" variant="headline-lg">
          Icons
        </Text>
        <div className="flex flex-wrap items-center gap-6">
          <HeartIcon size="sm" tone="primary" />
          <HeartIcon size="md" tone="primary" />
          <HeartIcon size="lg" tone="primary" />
          <SettingsIcon tone="muted" />
          <UserIcon tone="gold" />
          <LogOutIcon tone="danger" />
          <PlusIcon tone="primary" />
          <ChevronRightIcon tone="muted" />
        </div>
      </section>

      <section className="flex flex-col gap-stack-md">
        <Text as="h2" variant="headline-lg">
          Cards
        </Text>
        <div className="grid gap-stack-md sm:grid-cols-2">
          <Card variant="plain">
            <Text as="h3" variant="title-md">
              Plain card
            </Text>
            <Text variant="body-md">
              Soft ambient shadow on the lowest surface tone.
            </Text>
          </Card>
          <Card variant="vault">
            <Text as="h3" variant="title-md">
              Vault item
            </Text>
            <Text variant="body-md">
              Thin gold frame with a subtle grain overlay.
            </Text>
          </Card>
        </div>
      </section>
    </main>
  )
}
