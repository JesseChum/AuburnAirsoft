import { supabase } from "./supabase"

export type Event = {
    id: string
    title: string
    date: string
    startTime: string
    endTime: string
    maxPlayers: number
}

export async function fetchEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("date", { ascending: true })

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }

  return data ?? []
}