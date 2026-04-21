export default function BenefitsSection() {
    return (
        <section className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {[
                {
                    title: "Accelerate ROI",
                    body: "Turn compliance work into measurable cost reductions, avoided penalties, and improved access to green finance.",
                },
                {
                    title: "Increase trust",
                    body: "Give customers, regulators, and partners transparent emissions and custody proofs they can verify.",
                },
                {
                    title: "Stay resilient",
                    body: "See weak supplier nodes early and remediate before disruptions or reputational issues compound.",
                },
                {
                    title: "Scale confidently",
                    body: "Begin with core reporting and extend to deep Scope 3 and SKU-level traceability without re-platforming.",
                },
            ].map((item) => (
                <article
                    key={item.title}
                    className="card-hover rounded-2xl border border-white/80 bg-emerald-50/80 p-5 shadow-sm backdrop-blur-sm">
                    <h3 className="text-base font-semibold text-emerald-900">{item.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-slate-700">{item.body}</p>
                </article>
            ))}
        </section>
    );
}

