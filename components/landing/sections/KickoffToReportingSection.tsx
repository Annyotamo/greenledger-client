export default function KickoffToReportingSection() {
    return (
        <section>
            <h2 className="mb-8 text-2xl font-bold text-emerald-950 sm:text-3xl">From kickoff to confident reporting</h2>
            <ol className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {[
                    {
                        step: "01",
                        title: "Discover & scope",
                        text: "We map entities, data owners, material topics, and the reporting standards that apply to each geography.",
                    },
                    {
                        step: "02",
                        title: "Connect & cleanse",
                        text: "Ingest activity data, utility files, spend, travel, and supplier responses with validation rules that flag gaps early.",
                    },
                    {
                        step: "03",
                        title: "Model & attribute",
                        text: "Roll up Scopes, allocate shared services, and attribute financed emissions for lending and investment books.",
                    },
                    {
                        step: "04",
                        title: "Publish & prove",
                        text: "Generate disclosures, management commentary inputs, and public traceability surfaces from the same golden record.",
                    },
                ].map((row) => (
                    <li
                        key={row.step}
                        className="card-hover relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 p-5 shadow-md backdrop-blur-sm">
                        <span className="text-xs font-bold text-emerald-700">{row.step}</span>
                        <h3 className="mt-2 text-lg font-semibold text-emerald-950">{row.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-slate-700">{row.text}</p>
                    </li>
                ))}
            </ol>
        </section>
    );
}

