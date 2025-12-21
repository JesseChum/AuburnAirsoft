type RuleSectionProps = {
    title: string
    rules: string[]
}

export default function RuleSection({ title, rules }: RuleSectionProps){
    return (
        <section>
            <h2 className="text-2xl font-semibold mb-3">{title}</h2>
            <ul className="list-disx list-inside space-y-2 text-gray-300">
                {rules.map((rule, index) =>(
                    <li key={index}>{rule}</li>
                ))}
            </ul>
        </section>
    )
}