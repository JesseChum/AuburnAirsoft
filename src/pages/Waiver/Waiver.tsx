import WaiverViewer from "../../components/Waiver/WaiverViewer"

export default function Waiver() {
    return (
         <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
            <div className="max-w-4xl mx-auto space-y-10">
                <h1 className="text-3xl font-bold">Player Waiver</h1>
                <WaiverViewer />
            </div>
         </main>
    )
}