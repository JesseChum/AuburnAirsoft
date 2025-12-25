import { useEffect, useState } from "react"
import { fetchEvents } from "../../lib/events"
import type { Event } from  "../../lib/events"
import EventCard from "./EventCard"
import Calendar from "../../components/Calendar/Calendar"

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      const data = await fetchEvents()
      setEvents(data)
      setLoading(false)
    }

    loadEvents()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto space-y-12">

        {/* Event Cards */}
        <section>
          <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

          {loading && <p>Loading events...</p>}

          {!loading && events.length === 0 && (
            <p>No events scheduled yet.</p>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            {events.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Calendar */}
        <section>
          <h1 className="text-3xl font-bold mb-6">Event Calendar</h1>
          <Calendar events={events} />
        </section>

      </div>
    </main>
  )
}
