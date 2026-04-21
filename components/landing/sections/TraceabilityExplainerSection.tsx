export default function TraceabilityExplainerSection() {
    return (
        <section
            id="traceability"
            className="scroll-mt-24 rounded-2xl border border-emerald-900/10 bg-white/80 p-5 shadow-xl backdrop-blur-md sm:p-7 md:p-9 lg:p-11">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
                <div>
                    <h2 className="text-2xl font-bold text-emerald-950 sm:text-3xl">
                        Supply chain traceability, explained without the buzzwords
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                        Imagine scanning a QR code on a product and seeing where each ingredient or component came from,
                        who processed it, and whether key sustainability criteria were met. That experience only works
                        if the back office maintains a structured map of suppliers, batches, certificates, and
                        transformations.
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                        GreenLedger connects operational procurement data with customer-facing storytelling. You decide
                        what is public, what stays internal, and how much detail each market requires while preserving a
                        single governed record underneath.
                    </p>
                    <ul className="mt-6 space-y-3 text-sm text-slate-700">
                        <li className="flex gap-3">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                            <span>Map multi-tier suppliers with documents, audits, and corrective actions in one place.</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                            <span>
                                Tie specific lots or SKUs to chain-of-custody events for recalls, claims, or premium
                                certifications.
                            </span>
                        </li>
                        <li className="flex gap-3">
                            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-600" />
                            <span>
                                Publish localized QR pages that reflect the latest approved facts no manual website
                                updates per change.
                            </span>
                        </li>
                    </ul>
                </div>
                <div className="flex flex-col justify-center gap-4">
                    {[
                        { t: "Scan", d: "Consumer lands on a branded page with clear provenance and impact context." },
                        { t: "Trace", d: "Behind the scenes, every statement resolves to supplier evidence and timestamps." },
                        { t: "Improve", d: "Procurement sees gaps instantly where data is missing or certifications lapse." },
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

