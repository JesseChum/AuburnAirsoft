import { useEffect, useState } from "react"
import type { Event } from "../../types/Event"
import { supabase } from "../../lib/supabase"
import { getAnonUserId } from "../../lib/anonUser"

type Props = {
  event: Event
}

export default function EventCard({ event }: Props) {
  const userId = getAnonUserId()

  const [attending, setAttending] = useState(false)
  const [guests, setGuests] = useState(0)
  const [headcount, setHeadcount] = useState(0)

  const maxGuests = 3
  const isFull = headcount >= event.maxPlayers

  //Load headcount + attendance status
  useEffect(() => {
    const loadData = async () => {
      //Total headcount
      const { data: rsvps } = await supabase
        .from("rsvps")
        .select("guests")
        .eq("event_id", event.id)

      const total =
        rsvps?.reduce((sum, r) => sum + r.guests, 0) ?? 0
      setHeadcount(total)

      //Is THIS user attending?
      const { data: myRsvp } = await supabase
        .from("rsvps")
        .select("*")
        .eq("event_id", event.id)
        .eq("user_id", userId)
        .single()

      if (myRsvp) {
        setAttending(true)
        setGuests(myRsvp.guests - 1)
      }
    }

    loadData()
  }, [event.id, userId])

  //RSVP
  const handleRsvp = async () => {
    await supabase.from("rsvps").insert({
      event_id: event.id,
      user_id: userId,
      guests: 1 + guests,
    })

    setAttending(true)
    setHeadcount((c) => c + 1 + guests)
  }

  //Cancel RSVP
  const handleCancel = async () => {
    await supabase
      .from("rsvps")
      .delete()
      .eq("event_id", event.id)
      .eq("user_id", userId)

    setAttending(false)
    setHeadcount((c) => c - (1 + guests))
    setGuests(0)
  }

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
          onClick={handleRsvp}
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
            onClick={handleCancel}
            className="text-red-400 hover:underline text-sm"
          >
            Cancel RSVP
          </button>
        </div>
      )}
    </div>
  )
}
