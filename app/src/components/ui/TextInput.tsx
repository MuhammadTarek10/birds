import { useId  } from 'react'
import type {InputHTMLAttributes} from 'react';
import { cx } from '#/lib/cx'

export type TextInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'style'
> & {
  label: string
  help?: string
  error?: string
}

export const TextInput = ({
  label,
  help,
  error,
  id,
  className,
  placeholder,
  ...rest
}: TextInputProps) => {
  const autoId = useId()
  const inputId = id ?? autoId
  const helpId = `${inputId}-help`
  const invalid = Boolean(error)

  return (
    <div className="text-input-field">
      <input
        id={inputId}
        className={cx('text-input', invalid && 'text-input--invalid', className)}
        placeholder={placeholder ?? ' '}
        aria-invalid={invalid || undefined}
        aria-describedby={help || error ? helpId : undefined}
        {...rest}
      />
      <label htmlFor={inputId} className="text-input-label">
        {label}
      </label>
      {(help || error) && (
        <span
          id={helpId}
          className={cx(
            'text-input-help',
            invalid && 'text-input-help--error',
          )}
        >
          {error ?? help}
        </span>
      )}
    </div>
  )
}
