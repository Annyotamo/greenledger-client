export default function MetricsStripSection() {
    return (
        <section className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4 lg:gap-5" aria-label="Highlights">
            {[
                { k: "CSRD / ESRS / BRSR", v: "Aligned reporting flows" },
                { k: "Scopes 1–3", v: "Enterprise carbon ledger" },
                { k: "PCAF-ready", v: "Financed emissions views" },
                { k: "QR to origin", v: "Consumer traceability" },
            ].map((m) => (
                <div
                    key={m.k}
                    className="rounded-2xl border border-emerald-900/10 bg-white/75 px-3 py-4 text-center shadow-sm backdrop-blur-sm sm:px-5 sm:py-5">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-800">{m.k}</p>
                    <p className="mt-1 text-sm font-semibold text-slate-800">{m.v}</p>
                </div>
            ))}
        </section>
    );
}

