export default function TraceabilityExplainerSection() {
    return (
        <section
            id="traceability"
            className="scroll-mt-24 rounded-2xl border border-emerald-900/10 bg-white/80 p-5 shadow-xl backdrop-blur-md sm:p-7 md:p-9 lg:p-11">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
                        Activity traceability for audit ready fuel, electricity and energy records
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                        Keep every fuel, electricity, and energy activity tied to the supporting record, submission
                        trail, and approval decision. This is the kind of traceability auditors expect for operational
                        data.
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                        GreenLedger preserves a single governed activity record, showing who submitted it, what evidence
                        was attached, and when it was approved or returned for correction.
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-slate-700">
                        <li className="flex gap-3">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                            <span>
                                Map multi-tier suppliers with documents, audits, and corrective actions in one place.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                            <span>
                                Tie activity submissions to evidence, approval history, and the final reported total.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                            <span>
                                Make it clear which records were reviewed, approved, or returned for correction.
                            </span>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col justify-center gap-4">
                    {[
                        { t: "Scan", d: "Consumer lands on a branded page with clear provenance and impact context." },
                        {
                            t: "Trace",
                            d: "Behind the scenes, every statement resolves to supplier evidence and timestamps.",
                        },
                        {
                            t: "Improve",
                            d: "Procurement sees gaps instantly where data is missing or certifications lapse.",
                        },
                    ].map((step, i) => (
                        <div
                            key={step.t}
                            className="card-hover flex gap-4 rounded-2xl border border-white/70 bg-linear-to-r from-emerald-50/90 to-white/90 p-5 shadow-md">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-700 text-sm font-bold text-white">
                                {i + 1}
                            </span>
                            <div>
                                <h3 className="font-semibold text-emerald-950">{step.t}</h3>
                                <p className="mt-1 text-sm text-slate-700">{step.d}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
