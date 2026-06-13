import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import type { ComponentProps } from 'react'
import { cx } from '#/lib/cx'

export const DropdownMenu = DropdownPrimitive.Root
export const DropdownMenuTrigger = DropdownPrimitive.Trigger

export const DropdownMenuContent = ({
  className,
  align = 'end',
  sideOffset = 8,
  ...rest
}: ComponentProps<typeof DropdownPrimitive.Content>) => (
  <DropdownPrimitive.Portal>
    <DropdownPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={cx('dropdown-content', className)}
      {...rest}
    />
  </DropdownPrimitive.Portal>
)

export type DropdownItemProps = ComponentProps<
  typeof DropdownPrimitive.Item
> & {
  tone?: 'default' | 'danger'
}

export const DropdownMenuItem = ({
  className,
  tone = 'default',
  ...rest
}: DropdownItemProps) => (
  <DropdownPrimitive.Item
    className={cx(
      'dropdown-item',
      tone === 'danger' && 'dropdown-item--danger',
      className,
    )}
    {...rest}
  />
)

export const DropdownMenuSeparator = ({
  className,
  ...rest
}: ComponentProps<typeof DropdownPrimitive.Separator>) => (
  <DropdownPrimitive.Separator
    className={cx('dropdown-separator', className)}
    {...rest}
  />
)

export const DropdownMenuLabel = ({
  className,
  ...rest
}: ComponentProps<typeof DropdownPrimitive.Label>) => (
  <DropdownPrimitive.Label
    className={cx('dropdown-label', className)}
    {...rest}
  />
)
