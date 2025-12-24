import waiverPDF from "../../assets/AuburnAirsoftWaiver.pdf"
import {useState} from "react"

export default function WaiverViewer(){
    const [accepted, setAccepted] = useState(false)
    const [name, setName] = useState("")

    return(
        <div className="space-y-6">

            {/*PDF Viewwer */}
            <div className="border border-gray-700 rounded-lg overflow-hidden">
                <iframe
                    src={waiverPDF}
                    className="w-full h-[600px]"
                    title="Waiver PDF"
                    />
            </div>
            {/* Agreement Section */}
            <div className="bg-gray-800 p-6 rounded-lg space-y-4">
                <div>
                    <label className="block text-sm mb-1">
                        Full Legal Name
                    </label>
                    <input type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-gray-900 border border-gray-700 rounded px-3 py-2 text-white"/>
                </div>

                <label className="flex items-center space-x-2 text-small">
                    <input
                        type="checkbox"
                        checked={accepted}
                        onChange={(e) => setAccepted(e.target.checked)}
                        />
                    <span>
                        I have read and agree to the waiver above
                    </span>
                </label>

                <button
                    disabled={!(accepted || name)}
                    className={`px-6 py-3 rounded font-semibold transition ${ accepted && name
                        ? "bg-green-500 hover:bg-green-600 text-black"
                        : "bg-gray-600 cursor-not-allowed"
                    }`}
                    >
                        Submit Waiver
                    </button>
            </div>
        </div>
    )
}