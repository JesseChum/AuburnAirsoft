import { events } from "../../lib/events"
import CalendarEvent from "./CalendarEvent"

export default function Calendar() {
  return (
    <div className="grid grid-cols-7 gap-4">
      {Array.from({ length: 31 }).map((_, index) => {
        const day = index + 1
        const dayString = `2025-03-${String(day).padStart(2, "0")}`

        const dayEvents = events.filter(
          (event) => event.date === dayString
        )

        return (
          <div
            key={day}
            className="border border-green-800 rounded-md min-h-[120px] p-2"
          >
            <p className="text-xs text-green-300 mb-2">{day}</p>

            <div className="space-y-2">
              {dayEvents.map((event) => (
                <CalendarEvent key={event.id} event={event} />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
