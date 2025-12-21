export default function About() {
  return (
    <main className="min-h-screen bg-zinc-900 text-white px-6 py-12">
      <div className="max-w-4xl mx-auti space-y-12">

        <h1 className="text-4xl font-bold">About Auburn Airsoft</h1>

        {/* Who We Are */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Who we Are</h2>
          <p className="text-gray-300 leading-relaxed">
             Auburn Airsoft Community Field is a community-run outdoor airsoft
            group based in Auburn, Washington. Our goal is to provide a safe,
            respectful, and organized environment for players of all experience
            levels to enjoy the sport.
          </p>
        </section>

        {/* Why We Exist */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Why This Field Exists</h2>
          <p className="text-gray-300 leading-relaxed">
            We created this field to give local players a consistent place to
            play without pay-to-play barriers. Events are free, community
            supported, and organized to ensure continued approval from the
            city and surrounding area.
          </p>
        </section>

          {/* How Events Work */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">How Events Are Run</h2>
          <p className="text-gray-300 leading-relaxed">
            All games are scheduled events approved by the field organizer.
            Teams, boundaries, and safety rules are explained before gameplay.
            Our focus is fairness, communication, and keeping the field open
            long-term.
          </p>
        </section>

        {/* Community Values */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Community Values</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-300">
            <li>Safety always comes first</li>
            <li>Respect for players, property, and organizers</li>
            <li>Honest hit calling and sportsmanship</li>
            <li>Keeping airsoft accessible and welcoming</li>
          </ul>
        </section>

      </div>
    </main>
  )
}