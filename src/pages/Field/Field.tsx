// import hazelwood from "../../assets/hazelwood304th.png"
// import ave from "../../assets/118thave.png"
// import gravel from "../../assets/gravelroad.png"
// import parking from "../../assets/parking.png"

// export default function Field() {
//   return (
//     <main className="bg-zinc-900 text-white px-6 py-12">
      
//       <h1 className="text-3xl font-bold mb-6">Field Location</h1>

//       {/* LOCATION INFO */}
//       <section className="mb-8">
//         <h2 className="text-xl font-semibold mb-2">Location</h2>
//         <p><strong>Name:</strong> AuburnDale Park II</p>
//         <p><strong>Address:</strong> 30000 118th Ave SE, Auburn, WA 98092</p>
//         <p><strong>Meetup Time:</strong> 10:00 AM – 3:00 PM</p>
//       </section>

//       {/* GOOGLE MAP */}
//       <section className="mb-10">
//         <h2 className="text-xl font-semibold mb-3">Exact Location (Google Maps)</h2>
//         <div className="w-full h-[350px] rounded-lg overflow-hidden border border-gray-600">
//           <iframe
//             title="AuburnDale Park II Map"
//             //src="https://www.google.com/maps?q=30000+118th+Ave+SE,+Auburn,+WA+98092&output=embed"
//             width="100%"
//             height="100%"
//             loading="lazy"
//             referrerPolicy="no-referrer-when-downgrade"
//           />
//         </div>
//       </section>

//       {/* WHY THIS LOCATION */}
//       <section className="mb-8">
//         <h2 className="text-xl font-semibold mb-2">Why We Play Here</h2>
//         <p className="mb-3">
//           Although it is labeled as a “park,” AuburnDale Park II is not an active public park.
//           It was named by the City of Auburn for a future development project that has been
//           postponed due to budget and time constraints.
//         </p>
//         <p className="mb-3">
//           The land has remained unused and abandoned for over a decade and is expected to
//           remain that way for at least the next 6+ years unless the Parks Department moves forward.
//         </p>
//         <p>
//           We have permission to use this land through Auburn PD and the City Parks Department.
//           The main organizer has direct city and police contacts and can ask questions or be
//           notified if anything changes.
//         </p>
//       </section>

//       {/* DIRECTIONS */}
//       <section className="mb-8">
//         <h2 className="text-xl font-semibold mb-2">Directions</h2>
//         <ol className="list-decimal list-inside space-y-2">
//           <li>
//             From SE 304th St, turn onto 118th Ave SE next to Hazelwood Elementary School.
//           </li>
//           <li>
//             Continue straight on 118th Ave SE. Be cautious — hills may block visibility.
//           </li>
//           <li>
//             On the left side, you will see a gravel road leading into the parking area.
//           </li>
//           <li>
//             Wooden barriers will be removed by the main organizer.
//           </li>
//         </ol>
//       </section>

//       {/* PARKING */}
//       <section className="mb-8">
//         <h2 className="text-xl font-semibold mb-2">Parking</h2>
//         <p className="mb-3">
//           At the end of the gravel road, there is a small roundabout where you can turn around.
//           Parking is preferred in the marked direction so everyone can exit easily.
//         </p>
//         <p className="mb-3">
//           There is also a longer parking strip available. A rainwater collection area runs
//           through the middle, but it dries up during spring and summer.
//         </p>
//       </section>

//     {/* FIELD PHOTOS */}
//     <section className="mb-12">
//         <h2 className="text-xl font-semibold mb-4">Parking & Entrance Reference Photos</h2>
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//              <figure>
//       <img
//         src={hazelwood}
//         alt="Turn from SE 304th St onto 118th Ave SE"
//         className="rounded-lg border border-gray-600"
//       />
//       <figcaption className="text-sm text-gray-400 mt-2">
//         Turn onto 118th Ave SE from SE 304th St next to hazelwood Elementary
//       </figcaption>
//     </figure>
//     <figure>
//       <img
//         src={ave}
//         alt="Driving down 118th Ave SE"
//         className="rounded-lg border border-gray-600"
//       />
//       <figcaption className="text-sm text-gray-400 mt-2">
//         Continue down 118th Ave SE
//       </figcaption>
//     </figure>
//      <figure>
//       <img
//         src={gravel}
//         alt="Gravel road entrance to parking area"
//         className="rounded-lg border border-gray-600"
//       />
//       <figcaption className="text-sm text-gray-400 mt-2">
//         Gravel road entrance (barriers removed by organizer)
//       </figcaption>
//     </figure>
//        <figure>
//       <img
//         src={parking}
//         alt="Parking and turnaround area"
//         className="rounded-lg border border-gray-600"
//       />
//       <figcaption className="text-sm text-gray-400 mt-2">
//         Parking and turnaround area
//       </figcaption>  
//     </figure>
//         </div>
//     </section>
//     </main>
//   )
// }
