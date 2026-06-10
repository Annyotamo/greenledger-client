export default function BenefitsSection() {
    return (
        <section className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {[
                {
                    title: "Audit ready reporting",
                    body: "Immutable logs, evidence attachments, and clear reviewer trails make disclosures defensible.",
                },
                {
                    title: "Operational accuracy",
                    body: "Meter and invoice grade ingestion for fuel and electricity activities with validation rules.",
                },
                {
                    title: "Governed approvals",
                    body: "Role based permissions and approval queues reduce misreporting and provide governance evidence.",
                },
                {
                    title: "Faster assurance",
                    body: "Exportable audit packages and versioned reports speed up review cycles and reduce audit friction.",
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
