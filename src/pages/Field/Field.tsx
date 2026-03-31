import hazelwood from "../../assets/hazelwood304th.png"
import ave from "../../assets/118thave.png"
import gravel from "../../assets/gravelroad.png"
import parking from "../../assets/parking.png"

export default function Field() {
  return (
    <main className="bg-zinc-900 text-white px-6 py-12">

      <h1 className="text-3xl font-bold mb-6">Field Location</h1>

      {/* LOCATION INFO */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Location</h2>
        <p><strong>Name:</strong> AuburnDale Park II</p>
        <p><strong>Address:</strong> 30000 118th Ave SE, Auburn, WA 98092</p>
        <p><strong>Meetup Time:</strong> 10:00 AM – 3:00 PM</p>
      </section>

      {/* GOOGLE MAP */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Exact Location (Google Maps)</h2>
        <div className="w-full h-[350px] rounded-lg overflow-hidden border border-gray-600">
          <iframe
            title="AuburnDale Park II Map"
            src="https://www.google.com/maps?q=30000+118th+Ave+SE,+Auburn,+WA+98092&output=embed"
            width="100%"
            height="100%"
            loading="lazy"
          />
        </div>
      </section>

      {/* WHY THIS LOCATION */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Why We Play Here</h2>
        <p className="mb-3">
          Although it is labeled as a park, AuburnDale Park II is not an active public park.
        </p>
        <p className="mb-3">
          The land has remained unused and abandoned for years.
        </p>
        <p>
          We have permission to use this land through Auburn PD and the City Parks Department.
        </p>
      </section>

      {/* DIRECTIONS */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Directions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>Turn onto 118th Ave SE from SE 304th St next to Hazelwood Elementary</li>
          <li>Continue straight on 118th Ave SE</li>
          <li>Look for gravel road on the left</li>
          <li>Barriers removed by organizer</li>
        </ol>
      </section>

      {/* PARKING */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Parking</h2>
        <p className="mb-3">Roundabout available for turning and parking.</p>
        <p className="mb-3">Additional parking strip available.</p>
      </section>

      {/* FIELD PHOTOS */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4">Parking & Entrance Reference Photos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <img src={hazelwood} className="rounded-lg border border-gray-600" />
          <img src={ave} className="rounded-lg border border-gray-600" />
          <img src={gravel} className="rounded-lg border border-gray-600" />
          <img src={parking} className="rounded-lg border border-gray-600" />

        </div>
      </section>

    </main>
  )
}