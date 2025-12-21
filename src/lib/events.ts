export type Event = {
    id: string
    title: string
    date: string
    startTime: string
    endTime: string
    maxPlayers: number
}

export const events: Event[] =[
    {
        id: "1",
        title: "First Game - Saturday",
        date: "2026-01-03",
        startTime: "10:00 AM",
        endTime: "3:00 PM",
        maxPlayers: 30,
    },
    {
        id: "2",
        title: "Second Game - Saturday",
        date: "2026-01-17",
        startTime: "10:00 AM",
        endTime: "3:00 PM",
        maxPlayers: 30,
    },
]