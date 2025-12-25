import type { Event } from "../../lib/events"

type CalendarProps = {
  events: Event[]
}

export default function Calendar({ events }: CalendarProps) {
  return (
    <div className="grid grid-cols-7 gap-4">
      {Array.from({ length: 31 }).map((_, index) => {
        const day = index + 1

        const dayEvents = events.filter(
          event =>
            new Date(event.date).getDate() === day
        )

        return (
          <div
            key={day}
            className="border border-green-800 rounded-md min-h-[120px] p-2"
          >
            <p className="text-xs text-green-300 mb-2">{day}</p>

            <div className="space-y-2">
              {dayEvents.map(event => (
                <p key={event.id} className="text-xs">
                  {event.title}
                </p>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
