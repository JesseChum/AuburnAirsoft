import { useEffect, useState, useCallback } from "react"
import type { Event } from "../../types/Event"
import { supabase } from "../../lib/supabase"
import { getAnonUserId } from "../../lib/anonUser"

type Props = {
  event: Event
}

export default function EventCard({ event }: Props) {
  const userId = getAnonUserId()

  const [attending, setAttending] = useState(false)
  const [selectingGuests, setSelectingGuests] = useState(false)
  const [guests, setGuests] = useState(0)
  const [headcount, setHeadcount] = useState(0)
  const [loading, setLoading] = useState(true)

  // ----------------------------
  // Fetch RSVP data
  // ----------------------------
  const loadData = useCallback(async () => {
    const { data: rsvps } = await supabase
      .from("rsvps")
      .select("guests")
      .eq("event_id", event.id)

    const total =
      rsvps?.reduce((sum, r) => sum + r.guests, 0) ?? 0

    const { data: myRsvp } = await supabase
      .from("rsvps")
      .select("guests")
      .eq("event_id", event.id)
      .eq("user_id", userId)
      .maybeSingle()

    return { total, myRsvp }
  }, [event.id, userId])

  // ----------------------------
  // Sync state on mount / reload
  // ----------------------------
  useEffect(() => {
    let cancelled = false
    setLoading(true)

    loadData().then(({ total, myRsvp }) => {
      if (cancelled) return

      setHeadcount(total)
      if (myRsvp) {
        setAttending(true)
        setGuests(myRsvp.guests - 1)
      } else {
        setAttending(false)
        setGuests(0)
      }

      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [loadData])

  // ----------------------------
  // RSVP actions
  // ----------------------------
  const handleConfirmRsvp = async () => {
    const seatsAdded = 1 + guests
    const { error } = await supabase
      .from("rsvps")
      .upsert(
        {
          event_id: event.id,
          user_id: userId,
          guests: seatsAdded,
        },
        { onConflict: "event_id,user_id" }
      )

    if (error) return
    
    setHeadcount((prev) => prev + seatsAdded)
    setAttending(true)
    setSelectingGuests(false)
  }

  const handleCancelRsvp = async () => {
    const seatsRemoved = 1 + guests
    const { error } = await supabase
      .from("rsvps")
      .delete()
      .eq("event_id", event.id)
      .eq("user_id", userId)

    if (error) return
      setHeadcount((prev) => Math.max(0, prev - seatsRemoved))
      setAttending(false)
      setGuests(0)
  }

  // const updateGuests = async (newGuests: number) => {
  //   const diff = newGuests - guests

  //   const { error } = await supabase
  //     .from("rsvps")
  //     .update({ guests: 1 + newGuests })
  //     .eq("event_id", event.id)
  //     .eq("user_id", userId)

  //   if (error) return 
  //   setGuests(newGuests)
  //   setHeadcount((prev) => prev + diff)

  //   await loadData()
  // }

  // ----------------------------
  // UI
  // ----------------------------
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold">{event.title}</h2>

      <p className="text-sm text-zinc-400">
        {event.date} • {event.startTime} – {event.endTime}
      </p>

      <p className="text-sm">
        Headcount:{" "}
        <span className="font-semibold">
          {loading ? "…" : `${headcount} / ${event.maxPlayers}`}
        </span>
      </p>
      {attending && (
        <p className="text-green-400 text-sm font-medium">
        ✓ You are going
          {guests > 0 && ` (you + ${guests} guest${guests > 1 ? "s" : ""})`}
      </p>
        )}


      {/* RSVP BUTTON */}
      {!attending && !selectingGuests && (
        <button
          disabled={loading || headcount >= event.maxPlayers}
          onClick={() => setSelectingGuests(true)}
          className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded font-semibold"
        >
          RSVP Going
        </button>
      )}

      {/* GUEST SELECTION */}
      {selectingGuests && !attending && (
        <div className="space-y-3">
          <p className="text-sm font-medium">How many guests?</p>

          <div className="flex gap-2 flex-wrap">
            {[0, 1, 2, 3, 4, 5].map((n) => {
              const seatsRequired = 1 + n
              const wouldOverflow =
                headcount + seatsRequired > event.maxPlayers

              return (
                <button
                  key={n}
                  disabled={wouldOverflow}
                  onClick={() => setGuests(n)}
                  className={`px-3 py-1 rounded ${
                    guests === n
                      ? "bg-green-500 text-black"
                      : "bg-zinc-700 text-white"
                  } ${wouldOverflow ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {n}
                </button>
              )
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConfirmRsvp}
              className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded"
            >
              Confirm RSVP
            </button>

            <button
              onClick={() => {
                setGuests(0)
                setSelectingGuests(false)
              }}
              className="text-zinc-400 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ATTENDING VIEW */}
      {attending && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            
          </div>

          <button
            onClick={handleCancelRsvp}
            className="text-red-400 hover:underline text-sm"
          >
            Cancel RSVP
          </button>
        </div>
      )}
    </div>
  )
}
