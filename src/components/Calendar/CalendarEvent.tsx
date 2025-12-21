import type { Event } from "../../lib/events"

export default function CalendarEvent({ event }: {event: Event }) {
    return (
        <div className="bg-green-800 text-white rounded-md p-3 text-sm shadow">
            <p className="font-semibold">{event.title}</p>
            <p className="text-xs text-green-200">
                {event.startTime} - {event.endTime}
            </p>
            <p className="text-xs">
                Max Players: {event.maxPlayers}
            </p>
        </div>
    )
}