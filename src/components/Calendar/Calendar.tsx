import { useState } from "react"
import type { Event } from "../../types/Event"
import CalendarEvent from "./CalendarEvent"

type CalendarProps = {
  events: Event[]
}

export default function Calendar({ events }: CalendarProps) {
  const year = 2026
  const [currentMonth, setCurrentMonth] = useState(0) // 0 = January

  const monthLabel = new Date(year, currentMonth).toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const firstDayOfMonth = new Date(year, currentMonth, 1).getDay()
  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate()

  const calendarCells: (number | null)[] = []

  // Pad start of month
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null)
  }

  // Fill days
  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day)
  }

  const nextMonth = () => {
    if (currentMonth < 11) setCurrentMonth((prev) => prev + 1)
  }

  const prevMonth = () => {
    if (currentMonth > 0) setCurrentMonth((prev) => prev - 1)
  }

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          disabled={currentMonth === 0}
          className="text-green-400 text-3xl disabled:opacity-30"
        >
          ←
        </button>

        <h2 className="text-3xl font-bold text-white text-center">
          Event Calendar — {monthLabel}
        </h2>

        <button
          onClick={nextMonth}
          disabled={currentMonth === 11}
          className="text-green-400 text-3xl disabled:opacity-30"
        >
          →
        </button>
      </div>

      {/* ================= WEEKDAY LABELS (DESKTOP) ================= */}
      <div className="hidden md:grid grid-cols-7 gap-4 mb-2 text-center text-green-400 font-semibold">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* ================= MOBILE VIEW ================= */}
      <div className="md:hidden space-y-4">
        {calendarCells.map((day) => {
          if (!day) return null

          const dayString = `${year}-${String(currentMonth + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`

          const dayEvents = events.filter(
            (event) => event.date === dayString
          )

          return (
            <div
              key={dayString}
              className="border border-green-800 rounded-md p-4"
            >
              <p className="text-green-300 font-semibold mb-2">
                {monthLabel.split(" ")[0]} {day}
              </p>

              {dayEvents.length === 0 ? (
                <p className="text-sm text-gray-400">No events</p>
              ) : (
                <div className="space-y-2">
                  {dayEvents.map((event) => (
                    <CalendarEvent key={event.id} event={event} />
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ================= DESKTOP VIEW ================= */}
      <div className="hidden md:grid grid-cols-7 gap-3">
        {calendarCells.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="border border-transparent min-h-[120px]"
              />
            )
          }

          const dayString = `${year}-${String(currentMonth + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`

          const dayEvents = events.filter(
            (event) => event.date === dayString
          )

          return (
            <div
              key={dayString}
              className="border border-green-800 rounded-md p-3 min-h-[120px]"
            >
              <p className="text-sm font-semibold text-green-300 mb-2">
                {monthLabel.split(" ")[0]} {day}
              </p>

              <div className="space-y-2">
                {dayEvents.map((event) => (
                  <CalendarEvent key={event.id} event={event} />
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
