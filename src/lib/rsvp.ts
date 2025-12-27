import { supabase } from "./supabase"

export async function rsvpToEvent(
  eventId: string,
  userId: string,
  guests: number
) {
  return supabase.from("rsvps").insert({
    event_id: eventId,
    user_id: userId,
    guests,
  })
}

export async function cancelRsvp(eventId: string, userId: string) {
  return supabase
    .from("rsvps")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", userId)
}

export async function fetchEventRsvps(eventId: string) {
  return supabase
    .from("rsvps")
    .select("guests")
    .eq("event_id", eventId)
}
