import * as DialogPrimitive from '@radix-ui/react-dialog'
import type { ComponentProps, ReactNode } from 'react'
import { cx } from '#/lib/cx'

export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogClose = DialogPrimitive.Close

export type DialogContentProps = ComponentProps<
  typeof DialogPrimitive.Content
> & {
  children: ReactNode
}

export const DialogContent = ({
  className,
  children,
  ...rest
}: DialogContentProps) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="dialog-overlay" />
    <DialogPrimitive.Content className={cx('dialog-content', className)} {...rest}>
      <span aria-hidden="true" className="dialog-content__ornament">❦</span>
      {children}
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
)

export const DialogTitle = ({
  className,
  ...rest
}: ComponentProps<typeof DialogPrimitive.Title>) => (
  <DialogPrimitive.Title className={cx('dialog-title', className)} {...rest} />
)

export const DialogDescription = ({
  className,
  ...rest
}: ComponentProps<typeof DialogPrimitive.Description>) => (
  <DialogPrimitive.Description
    className={cx('dialog-description', className)}
    {...rest}
  />
)

export const DialogFooter = ({
  className,
  ...rest
}: ComponentProps<'div'>) => (
  <div className={cx('dialog-footer', className)} {...rest} />
)
