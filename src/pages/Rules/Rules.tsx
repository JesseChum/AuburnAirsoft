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
            "All airsoft guns must be concealed until in the staging area.",
            "Real firearms, knives, tasers, paintball guns, fireworks, metal BB guns, and airguns are prohibited.",
            "No drugs or alcohol of any kind are permitted.",
            "Players must clean up after themselves. Trash bags and gloves will be provided.",
            "No blind firing. You must visually identify your target and backdrop.",
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
          </div>
        </main>
    )
}