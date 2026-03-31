import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabase"
import EventCard from "./EventCard"
import Calendar from "../../components/Calendar/Calendar"
import type { DbEvent } from "../../types/DbEvent"
import type { Event } from "../../types/Event"

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true })

      if (error || !data) {
        console.error(error)
      } else {
        // MAP DB → UI SHAPE
        const mappedEvents: Event[] = data.map((e: DbEvent) => ({
          id: e.id,
          title: e.title,
          date: e.event_date,
          startTime: e.start_time,
          endTime: e.end_time,
          maxPlayers: e.max_players,
        }))

        setEvents(mappedEvents)
      }

      setLoading(false)
    }

    fetchEvents()
  }, [])

  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Upcoming Events */}
        <section className="mb-16">
          <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

          {loading ? (
            <p>Loading events...</p>
          ) : events.length === 0 ? (
            <p>No events scheduled yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </section>

        {/* Calendar */}
        <section>
          <Calendar events={events} />
        </section>

      </div>
    </main>
  )
}
