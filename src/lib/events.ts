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
        date: "1/3/26",
        startTime: "10:00 AM",
        endTime: "3:00 PM",
        maxPlayers: 30,
    },
    {
        id: "2",
        title: "Second Game - Saturday",
        date: "1/17/26",
        startTime: "10:00 AM",
        endTime: "3:00 PM",
        maxPlayers: 30,
    },
]