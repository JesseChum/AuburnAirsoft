import RuleSection from "../Rules/RuleSection"

export default function Rules() {
    return (
        <main className="min-h-screen bg-zinc-900 text-white px-6 px-12">
          <div className="max-w-4xl mx-auto space-y-10">

              <h1 className="text-4xl font-bold">Field Rules</h1>

                {/* Important Notice */}
        <div className="border border-red-600 bg-red-900/30 p-6 rounded-lg">
          <h2 className="text-xl font-semibold text-red-400 mb-2">
            Important Notice
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-200">
            <li>Rules may change at any time without notice.</li>
            <li>Failure to follow rules may result in removal from the field.</li>
            <li>No unauthorized games without event organizer approval.</li>
          </ul>
        </div>

        {/* General Rules */}
        <RuleSection
          title="General Rules"
          rules={[
            "All airsoft guns must be concealed in a gun case, bag, or original box until in the staging area.",
            "Real firearms, knives, tasers, paintball guns, fireworks, metal BB guns, and airguns, and other non-airsoft weapons or devices are not permitted during airsoft game play.",
            "ALL Drugs and alcohol in all forms are not permitted. You will be asked to leave if suspected of being under the influence of drugs or alcohol.",
            "Players must clean up after themselves. Trash bags and gloves will be provided.",
            "No blind firing. You must visually identify your target and backdrop.",
            "Field boundaries will be represented with caution tape and red marking tape. Field Organizer will explain the boundaries in person.",
            "Teams will be separated with arm bands and no arm bands via red marking tape. If you have your own identification bands please bring them.",
            "If you see or encounter a house stay at least 300+ feet away from the house/property. If it's hard to measure, make sure there's no way your gun can reach.",
            "Only Red lasers are permitted to be used on the field. Class 2 lasers are only permitted,Class 3R and 3B are permitted only for night games. Class 4 is not permitted"
          ]}
        />
        {/* Hit Rules */}
        <RuleSection
          title="Hit Rules"
          rules={[
            "No minimum engagement distance.",
            "If hit anywhere on your body or gear, you are OUT.",
            "Call your hit loudly by yelling 'HIT!' and raising your hand.",
            "Friendly fire counts.",
            "Ricochets count.",
            "Gun hits do NOT count.",
            "Dead Rags are Highly Recommended. Typically in a bright visible color",
          ]}
        />

        {/* Pyrotechnics */}
        <RuleSection
          title="Pyrotechnics & Grenades"
          rules={[
            "No noise-producing pyrotechnics such as Taggins.",
            "Smoke and grenades are permitted if field conditions allow.",
            "Grenades without BBs are distraction devices.",
            "BB grenades have a 20ft kill radius unless behind hard cover.",
          ]}
        />

        {/* Pyrotechnics */}
        <RuleSection
          title="Honor and Integrity"
          rules={[
            "Cheating will be dealt with in a fair but harsh manner.",
            "Do not whatsoever have any kind of aggressive physical confrontation with any other person.",
            "Any kind of threats for this matter are also not allowed and you will be removed from the game.",
            "Talk to an admin before escalating the situation. Involve an admin before involving yourself. If the conflict does escalate, admins will act as they see fit.",
          ]}
        />

        {/* Chrono and Velocity */}
        <RuleSection
          title="Chrono and Velocity || Energy Limits || BB type"
          rules={[
            "It is highly encouraged to use BIO bbs but not a requirement.",
            "Plastic BBs ONLY. No metal core plastic BBs.",
            "No sound amplifiers for neighbors courtesy.",
            "Full auto is allowed, Guns including Pistols, Shotguns, rifles, machine guns,Unique guns with bursts are acceptable, unless specifically stated in a game mode not to use it.",
            "RPS limit: 25. No 40mikes or any device that is higher than the limit",
            "Close range - Pistols, Shotguns || -350 FPS w/2’s or 1.14 Joules",
            "All Rifles Except for DMRs and Bolt Action Sniper Rifles || - 400 FPS full auto w/.2's or 1.49 Joules maximum",
            "Or - 450 FPS semi only w/.2’s or 2 Joules maximum",
            "DMR must be fixed on semi-auto only",
            "Sniper Rifles or ANY gun over 400 FPS or 1.49 Joules || - 550fps with .2's OR 2.81 Joules",
            "HIgh Pressure Air/HPA || All HPA guns must have a tournament lock."

            
          ]}
        />

        {/* Eye Protection */}
        <RuleSection
          title="Eye Protection"
          rules={[
            "Eye Protection is NOT to be removed during game play. DO NOT remove your mask or eye  protection for any reason during game play. If there is a malfunction in your eye protection call “blind man” and remove yourself from play, readjust your eye protection, then re-engage.",
            "Eye protection must have a rubber/foam/soft material seal that closely conforms to your facial features.",
            "Eye protection should be ANZI Z87.1 compliant or better. This standard is usually posted either on the packaging or on the manufacturer's website.",
            "Mesh goggles should be made from stamped steel and not deform from repeated close range hits.",
            "Failure to follow the guidelines on eye protection will mean that you will be asked to leave the game and get the appropriate protection.",
            "All Operators under 18 must wear one of the following mouth protections: Neoprene Ski Mask, Sports mouth Guard, Lower Stamped Steel, or Paintball/ Airsoft face mask. No Exceptions."
          ]}
        />
          </div>
        </main>
    )
}