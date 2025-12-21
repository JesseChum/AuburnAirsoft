export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-gray-900 border-t border-gray-800 text-gray-400">
            <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex row justify-between items-center gap-4"></div>

            {/* Contact Info */}
            <div className="text-sm text-center md:text-left">
                <p>AuburnCommunityAirsoft@gmail.com</p>
                <p>Phone: <span className="text-gray-300">(206) 123-4567</span></p>
            </div>

         {/* Copyright */}
         <div className="text-sm text-center md:text-right">
            <p>
                © {currentYear} Auburn Airsoft Community Field
            </p>
         </div>
        </footer>
    )
}