import WaiverViewer from "../../components/Waiver/WaiverViewer"

export default function Waiver() {
    return (
         <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
            <div className="max-w-4xl mx-auto space-y-10">
                <h1 className="text-3xl font-bold">Player Waiver</h1>
                <p className="font-bold"> Instructions: All players must complete the waiver before gameplay. 
                    You have the option to print or electronically fill out.
                </p>
                <WaiverViewer />
            </div>
         </main>
    )
}