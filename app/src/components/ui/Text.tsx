import { createElement   } from 'react'
import type {HTMLAttributes, ReactNode} from 'react';
import { cx } from '#/lib/cx'

export type TextVariant =
  | 'display-lg'
  | 'headline-lg'
  | 'headline-lg-mobile'
  | 'title-md'
  | 'body-lg'
  | 'body-md'
  | 'label-md'

export type TextElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div'

export type TextProps = Omit<HTMLAttributes<HTMLElement>, 'style'> & {
  as?: TextElement
  variant?: TextVariant
  children?: ReactNode
}

export const Text = ({
  as = 'p',
  variant = 'body-md',
  className,
  children,
  ...rest
}: TextProps) =>
  createElement(
    as,
    { className: cx(`text-${variant}`, className), ...rest },
    children,
  )
