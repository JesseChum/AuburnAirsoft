export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-green-900 border-t border-green-800 text-white">
            <div className="max-w-7l mx-auto px-6 py-8">

        {/* Contact Info */}
            <div className="text-sm text-center md:text-left">
                <div className="text-lg text-left">
                <p className="text-lg font-semibold mb-2">CONTACT US</p>
                </div>
                <p>Email: {" "} 
                <a 
                href="mailto:AuburnCommunityAirsoft@gmail.com" 
                className="hover:underline"
                >
                AuburnCommunityAirsoft@gmail.com
                </a>
                </p>
                <p>Phone: <span className="text-white-400">Owner Overlord - (206) 474-9088</span></p>
                <p>Private Invite Only & RSVP Only</p>
            </div>

         {/* Copyright */}
         <div className="text-sm text-center">
            <p>
                © {currentYear} Auburn Airsoft Community Field
            </p>
            < p className="text-xs text-white-500">
            All rights Reserved.</p>
             </div>
            </div>
        </footer>
    )
}