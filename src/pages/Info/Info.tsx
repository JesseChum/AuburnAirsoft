import longstrip from "../../assets/longstrip.png"
import coyote from "../../assets/coyote.png"

export default function Info() {
  return (
    <main className="bg-zinc-900 text-white px-6 py-12">
      
      <h1 className="text-3xl font-bold mb-8">Information</h1>

      {/* WEBSITE INFO */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Website & Sign-Ups</h2>
        <p className="mb-3">
          You will be able to sign up to attend events. Users who attend will remain anonymous until in person meetup.
        </p>
        <p>
          All events are completely free. No payment is required.
          If you wish to donate, please contact the main organizer directly.
        </p>
      </section>

      {/* PEDESTRIANS */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Pedestrian Interaction</h2>
        <p className="mb-3">
          If you encounter a pedestrian who did not see the warning signs and enters
          the play area, immediately call a ceasefire.
        </p>
        <p className="mb-3">
          Be as low-threat as possible and calmly lead them out of the play area.
          Explain who we are and that we are not a militia.
        </p>
        <p>
          If there are any issues, contact the main organizer immediately.
        </p>
      </section>

      {/* POLICE */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Police Interaction</h2>
        <p className="mb-3">
          If police arrive, it usually means they received multiple calls and may
          shut down the game.
        </p>
        <p className="mb-3">
          Immediately call a ceasefire. All weapons must be put down for inspection.
        </p>
        <p className="mb-3">
          If inspected, explain that none of the replicas are dimensionally capable
          of chambering real ammunition or being converted into real firearms.
        </p>
        <p className="mb-3">
          Officers will likely arrive in pairs and wearing gear. Field refs are
          responsible for being on the lookout for police arrival.
        </p>
        <p className="mb-3">
          Auburn PD are respectful and professional — treat them kindly and listen to all commands given for safety
        </p>
        <p>
          If allowed, we may be permitted to continue play in a more confined area.
          Any issues should be reported to the main organizer immediately.
        </p>
      </section>

      {/* INJURY */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Injury & Medical Emergencies</h2>
        <p className="mb-3">
          In the event of a serious injury, immediately call a ceasefire and wait
          until the injured person is safely carried out of the play area.
        </p>
        <p>
          If anyone is shot in the eye, the game will be shut down for the day and
          emergency aid must be provided immediately.
        </p>
      </section>

      {/* COYOTES */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Coyote Sightings</h2>
        <p className="mb-3">
          Coyotes have been sighted in the area. If going anywhere please have a buddy with you
        </p>
        <p className="mb-3">
          Never go alone and always stay alert for your safety.
        </p>
        <p className="mb-3">
          If a coyote approaches and does not retreat, call a ceasefire immediately.
        </p>
        <p>
          Make loud noises, wave your arms to appear larger, and back away slowly
          while keeping the animal in sight. If attacked, fight back.
        </p>
      </section>

      {/* WILDLIFE */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Wildlife & Environment</h2>
        <p className="mb-3">
          Do not shoot or disturb wildlife under any circumstances.
        </p>
        <p className="mb-3">
          If you encounter an ant hill, do not destroy it.
        </p>
        <p>
          If you find poisonous plants such as poison ivy or poison oak,
          notify the main organizer immediately.
        </p>
      </section>

      {/* FIRE */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Fire Safety</h2>
        <p className="mb-3">
          Two fire extinguishers will be available in case of a LiPo battery fire
          or a wildfire during summer.
        </p>
        <p>
          A ceasefire must be called and the fire must be extinguished immediately.
        </p>
      </section>

      {/* SHELTER */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Shelter & Belongings</h2>
        <p className="mb-3">
          There is currently no shelter available on site. Bathrooms are also not available
          if you need to use the restroom the closest to use is on 312 street where the 7/11 gas stations are and restraunts
        </p>
        <p>
          Please bring anything you need for personal comfort.
          Funds will be invested soon to purchase canopies.
        </p>
        <p>
          Bring all of your gear and personal belongings to play or rest as very little can be provided.
        </p>
      </section>

      {/* NIGHT GAMES */}
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Night Games</h2>
        <p className="mb-3">
          Night games are planned and will be announced when ready.
        </p>
        <p>
          For now, all games will operate during daylight hours while turnout is evaluated.
        </p>
      </section>

      {/* INVITES */}
      <section>
        <h2 className="text-xl font-semibold mb-2">Inviting New Players</h2>
        <p className="mb-3">
          You may bring new people to play; however, events are private invite-only.
        </p>
        <p className="mb-3">
          New players must go through a short interview with the main organizer
          or an admin. The process is simple — just be honest.
        </p>
        <p>
          This helps filter out dishonest or unsafe individuals and allows everyone
          to get to know each other. Playing with friends is strongly preferred over
          playing with random participants.
        </p>
      </section>

      {/* PHOTOS */}
      <section className="mb-11">
       <h2 className="text-xl font-semibold mb-4">Information Reference Photos</h2>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <figure>
      <img
        src={longstrip}
        alt="More parking"
        className="rounded-lg border border-gray-600"
      />
      <figcaption className="text-sm text-gray-400 mt-2">
        More parking and walk way for future planned events
      </figcaption>  
    </figure>
     <figure>
      <img
        src={coyote}
        alt="coyote sighting"
        className="rounded-lg border border-gray-600"
      />
      <figcaption className="text-sm text-gray-400 mt-2">
        Coyote sighting north of the field
      </figcaption>  
    </figure>
       </div>
      </section>
    </main>
  )
}
