import React, { createContext, useContext, useEffect, useState } from 'react'

type DateContextType = {
  startDate: Date
  endDate: Date
  setStartDate: (d: Date) => void
  setEndDate: (d: Date) => void
}

const DateContext = createContext<DateContextType | null>(null)

export function DateProvider({ children }: { children: React.ReactNode }) {
  // Defaults aligned with your Home page
  const [startDate, setStartDate] = useState(new Date(2024, 5, 1)) // Jun 1, 2024
  const [endDate, setEndDate] = useState(new Date(2025, 5, 30)) // Jun 30, 2025

  // Guard: keep start <= end (moved from Home)
  useEffect(() => {
    if (startDate > endDate) setStartDate(endDate)
  }, [startDate, endDate])

  return (
    <DateContext.Provider
      value={{ startDate, endDate, setStartDate, setEndDate }}
    >
      {children}
    </DateContext.Provider>
  )
}

export function useDateContext() {
  const ctx = useContext(DateContext)
  if (!ctx) throw new Error('useDateContext must be used within DateProvider')
  return ctx
}
