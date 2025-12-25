import { useState } from "react"
import type { Event } from "../../lib/events"

type Props = {
  event: Event
}

export default function EventCard({ event }: Props) {
  const [attending, setAttending] = useState(false)
  const [guests, setGuests] = useState(0)

  const maxGuests = 3
  const headcount = attending ? 1 + guests : 0
  const isFull = headcount >= event.maxPlayers

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{event.title}</h2>
        <p className="text-sm text-zinc-400">
          {event.date} • {event.startTime} – {event.endTime}
        </p>
      </div>

      <p className="text-sm">
        Headcount:{" "}
        <span className="font-semibold">{headcount}</span>
        {" / "}
        {event.maxPlayers}
      </p>

      {!attending ? (
        <button
          disabled={isFull}
          onClick={() => setAttending(true)}
          className={`px-4 py-2 rounded font-semibold ${
            isFull
              ? "bg-zinc-600 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600 text-black"
          }`}
        >
          {isFull ? "Event Full" : "RSVP Going"}
        </button>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <span>Guests:</span>
            <input
              type="number"
              min={0}
              max={maxGuests}
              value={guests}
              onChange={(e) =>
                setGuests(
                  Math.max(0, Math.min(maxGuests, Number(e.target.value)))
                )
              }
              className="w-16 bg-zinc-900 border border-zinc-700 rounded px-2 py-1"
            />
            <span className="text-zinc-400">(max {maxGuests})</span>
          </div>

          <button
            onClick={() => {
              setAttending(false)
              setGuests(0)
            }}
            className="text-red-400 hover:underline text-sm"
          >
            Cancel RSVP
          </button>
        </div>
      )}
    </div>
  )
}
