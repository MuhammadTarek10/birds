import type { ReactNode } from 'react'
import { Text } from '#/components/ui/Text'

export type AuthLayoutProps = {
  rightEyebrow: string
  rightHeadline: string
  rightLede: string
  children: ReactNode
}

export const AuthLayout = ({
  rightEyebrow,
  rightHeadline,
  rightLede,
  children,
}: AuthLayoutProps) => (
  <div className="auth-backdrop">
    <div className="auth-ribbon" aria-hidden="true">
      <svg viewBox="0 0 800 600" preserveAspectRatio="none">
        <path
          d="M820 -40 C 600 220, 520 360, 240 520"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <main className="auth-stage">
      <div className="auth-stage__form">{children}</div>
      <aside className="auth-stage__editorial" aria-hidden="false">
        <Text as="span" variant="label-md" className="auth-stage__eyebrow">
          {rightEyebrow}
        </Text>
        <Text as="p" variant="display-lg" className="auth-stage__headline">
          {rightHeadline}
        </Text>
        <Text as="p" variant="body-lg" className="auth-stage__lede">
          {rightLede}
        </Text>
      </aside>
    </main>
  </div>
)
