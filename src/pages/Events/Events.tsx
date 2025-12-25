import { events } from "../../lib/events"
import EventCard from "./EventCard"
import Calendar from "../../components/Calendar/Calendar"

export default function Events(){
    return (
        <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
            <div className="max-w-7xl mx-auto">

        <section>
          <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>

          <div className="grid md:grid-cols-2 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>

        {/* Calender */}
        <section>
            <h1 className="text-3xl font-bold mb-6">Event Calendar</h1>
            <Calendar />
        </section>
            </div>
        </main>
    )
}