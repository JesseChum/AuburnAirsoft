

export default function Field() {
  return (
    <main className="bg-zinc-900 text-white px-6 py-12">
      
      <h1 className="text-3xl font-bold mb-6">Field Location</h1>

      {/* LOCATION INFO */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Location</h2>
      </section>

      {/* GOOGLE MAP */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-3">Exact Location (Google Maps)</h2>
        <div className="w-full h-[350px] rounded-lg overflow-hidden border border-gray-600">
          <iframe
            title=""
            //src="https://www.google.com/maps?q=30000+118th+Ave+SE,+Auburn,+WA+98092&output=embed"
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>

      {/* WHY THIS LOCATION */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Why We Play Here</h2>
        <p className="mb-3">
          
        </p>
        <p className="mb-3">
          
        </p>
        <p>
          
        </p>
      </section>

      {/* DIRECTIONS */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Directions</h2>
        <ol className="list-decimal list-inside space-y-2">
          <li>
            
          </li>
          <li>
            
          </li>
          <li>
        
          </li>
          <li>
            
          </li>
        </ol>
      </section>

      {/* PARKING */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Parking</h2>
        <p className="mb-3">
         
        </p>
        <p className="mb-3">
          
        </p>
      </section>

    {/* FIELD PHOTOS */}
    <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4"></h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <figure>
      <img
        className="rounded-lg border border-gray-600"
      />
      <figcaption className="text-sm text-gray-400 mt-2">
        
      </figcaption>
    </figure>
    <figure>
      <img
        className="rounded-lg border border-gray-600"
      />
      <figcaption className="text-sm text-gray-400 mt-2">
        
      </figcaption>
    </figure>
     <figure>
      <img
        className="rounded-lg border border-gray-600"
      />
      <figcaption className="text-sm text-gray-400 mt-2">
        
      </figcaption>
    </figure>
       <figure>
      <img
        className="rounded-lg border border-gray-600"
      />
      <figcaption className="text-sm text-gray-400 mt-2">

      </figcaption>  
    </figure>
        </div>
    </section>
    </main>
  )
}
