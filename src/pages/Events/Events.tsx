import Calendar from "../../components/Calendar/Calendar"

export default function Events(){
    return (
        <main className="min-h-screen bg-gray-900 text-white px-6 py-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-6">Event Calendar</h1>
                <Calendar />
            </div>
        </main>
    )
}