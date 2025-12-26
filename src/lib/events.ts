import { supabase } from "./supabase"
import type { DbEvent } from "../types/DbEvent"
import type { Event } from "../types/Event"

export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("event_date", { ascending: true })

  if (error || !data) {
    console.error("Error fetching events:", error)
    return []
  }

  // Map DB → UI
  return data.map((e: DbEvent) => ({
    id: e.id,
    title: e.title,
    date: e.event_date,
    startTime: e.start_time,
    endTime: e.end_time,
    maxPlayers: e.max_players,
  }))
}
