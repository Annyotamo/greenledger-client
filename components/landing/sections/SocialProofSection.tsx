export default function SocialProofSection() {
    return (
        <section className="section-bg rounded-2xl border border-white/50 p-6 shadow-lg sm:p-8 md:p-9">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
                Trusted by teams moving from compliance to advantage
            </h2>
            <div className="mt-5 flex flex-wrap gap-2 text-sm text-slate-700">
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium">Reporting cycle compression</span>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium">
                    Supplier verification acceleration
                </span>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium">
                    Banking &amp; corporate programs
                </span>
            </div>
            <p className="mt-5 max-w-4xl text-sm leading-relaxed text-slate-700 sm:text-base">
                Sustainability officers use GreenLedger for auditable metrics; finance teams align ledgers with climate
                data; operations teams log fuel, electricity and energy activities with supporting approvals. When
                disclosure season arrives, everyone is looking at the same numbers.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {["Industrials", "Consumer goods", "Financial services", "Logistics"].map((label) => (
                    <div
                        key={label}
                        className="flex h-16 items-center justify-center rounded-xl border border-dashed border-emerald-800/20 bg-white/60 text-xs font-semibold uppercase tracking-wide text-emerald-900/70">
                        {label}
                    </div>
                ))}
            </div>
        </section>
    );
}
