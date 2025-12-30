import type { Event } from "../../types/Event"
import CalendarEvent from "./CalendarEvent"

type CalendarProps = {
  events: Event[]
}

export default function Calendar({ events }: CalendarProps) {
  const year = 2026
  const month = 0

  const monthLabel = new Date(year, month).toLocaleString("default", {
    month: "long",
    year: "numeric",
  })

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const calendarCells: (number | null)[] = []

  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push(null)
  }

  for (let day = 1; day <= daysInMonth; day++) {
    calendarCells.push(day)
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-white mb-6">
        Event Calendar — {monthLabel}
      </h2>

      {/* Weekday labels (desktop only) */}
      <div className="hidden md:grid grid-cols-7 gap-4 mb-2 text-center text-green-400 font-semibold">
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-3">
        {calendarCells.map((day, index) => {
          if (!day) {
            return (
              <div
                key={index}
                className="hidden md:block border border-transparent min-h-[120px]"
              />
            )
          }

          const dayString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

          const dayEvents = events.filter(
            (event) => event.date === dayString
          )

          return (
            <div
              key={day}
              className="border border-green-800 rounded-md p-3 md:min-h-[120px]"
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
