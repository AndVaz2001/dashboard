'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

function formatDate(date: Date | undefined) {
  if (!date) return ''
  return date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function isValidDate(date: Date | undefined) {
  if (!date) return false
  return !isNaN(date.getTime())
}

type Calendar28Props = {
  label?: string
  selectedDate?: Date
  onChange?: (date: Date | undefined) => void
}

export function Calendar28({
  label = 'Date',
  selectedDate,
  onChange,
}: Calendar28Props) {
  const [open, setOpen] = React.useState(false)

  // Local UI state for the input text and the visible month in the popover
  const [month, setMonth] = React.useState<Date | undefined>(selectedDate)
  const [textValue, setTextValue] = React.useState<string>(
    formatDate(selectedDate),
  )

  // Keep the input text & visible month in sync if the parent changes selectedDate
  React.useEffect(() => {
    setTextValue(formatDate(selectedDate))
    setMonth(selectedDate)
  }, [selectedDate])

  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <div className="relative flex gap-2">
        <Input
          id="date"
          value={textValue}
          placeholder="June 01, 2025"
          className="bg-background pr-10"
          onChange={(e) => {
            const raw = e.target.value
            setTextValue(raw)

            // Try to parse in a tolerant way:
            const parsed = new Date(raw)
            if (isValidDate(parsed)) {
              onChange?.(parsed)
              setMonth(parsed)
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setOpen(true)
            }
          }}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
            >
              <CalendarIcon className="size-3.5" />
              <span className="sr-only">Select date</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              captionLayout="dropdown"
              month={month}
              onMonthChange={setMonth}
              onSelect={(date) => {
                onChange?.(date)
                setTextValue(formatDate(date))
                setOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
