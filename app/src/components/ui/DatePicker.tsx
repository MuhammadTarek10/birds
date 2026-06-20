import { useState, useRef, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, parse, isValid } from 'date-fns'

export type DatePickerProps = {
  value: string | undefined        // ISO date "YYYY-MM-DD"
  onChange: (value: string) => void
  label: string
  error?: string
  disabled?: boolean
}

export const DatePicker = ({ value, onChange, label, error, disabled }: DatePickerProps) => {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const selected = value ? parse(value, 'yyyy-MM-dd', new Date()) : undefined
  const displayValue = selected && isValid(selected) ? format(selected, 'MMM d, yyyy') : ''

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  return (
    <div className="date-picker" ref={containerRef}>
      <button
        type="button"
        className={`date-picker__trigger${error ? ' date-picker__trigger--invalid' : ''}${disabled ? ' date-picker__trigger--disabled' : ''}`}
        onClick={() => !disabled && setOpen(v => !v)}
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className="date-picker__label">{label}</span>
        {displayValue && <span className="date-picker__value">{displayValue}</span>}
      </button>
      {error && <span className="date-picker__error">{error}</span>}
      {open && (
        <div className="date-picker__popover" role="dialog" aria-label="Choose date">
          <DayPicker
            mode="single"
            selected={selected}
            onSelect={(date) => {
              if (date) {
                onChange(format(date, 'yyyy-MM-dd'))
                setOpen(false)
              }
            }}
            classNames={{
              root: 'date-picker__calendar',
              months: 'date-picker__months',
              month: 'date-picker__month',
              month_caption: 'date-picker__caption',
              caption_label: 'date-picker__caption-label',
              nav: 'date-picker__nav',
              button_previous: 'date-picker__nav-btn',
              button_next: 'date-picker__nav-btn',
              month_grid: 'date-picker__grid',
              weekdays: 'date-picker__weekdays',
              weekday: 'date-picker__weekday',
              week: 'date-picker__week',
              day: 'date-picker__day',
              day_button: 'date-picker__day-btn',
              selected: 'date-picker__day--selected',
              today: 'date-picker__day--today',
              outside: 'date-picker__day--outside',
              disabled: 'date-picker__day--disabled',
            }}
          />
        </div>
      )}
    </div>
  )
}
