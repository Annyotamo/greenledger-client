import Link from "next/link";

export default function CBAMCTA() {
    return (
        <section className="full-bleed relative py-16 md:py-24 overflow-hidden shadow-[0_24px_80px_-30px_rgba(0,40,25,0.55)] border-y border-emerald-800/20">
            {/* Background Dark Green Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#011E16] via-[#033A2E] to-[#0b5242]/90 z-0"></div>

            {/* Overlays for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_110%_75%_at_50%_-10%,rgba(255,255,255,0.08),transparent_50%)] z-10" aria-hidden />
            <div className="gl-grain z-10" aria-hidden />

            <div className="relative z-20 max-w-4xl mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight mb-6 leading-tight">
                    Built for <br />
                    <span className="bg-gradient-to-r from-white via-emerald-200 to-emerald-400 bg-clip-text text-transparent">
                        EU-bound exporters
                    </span>
                </h2>
                <p className="text-emerald-100/70 text-sm md:text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
                    Give your EU buyers verified, audit-ready emissions data — and stay ahead of default-value penalties as the definitive regime ramps up.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Link
                        href="/#cta"
                        className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-400 text-emerald-950 px-8 py-4 font-semibold rounded-xl transition-all shadow-lg shadow-black/20 text-center">
                        Request Demo Access
                    </Link>
                    <Link
                        href="#governance"
                        className="w-full sm:w-auto bg-white/5 border border-white/20 text-white px-8 py-4 font-semibold rounded-xl hover:bg-white/10 transition-all backdrop-blur-md text-center">
                        Download Implementation Guide
                    </Link>
                </div>

                {/* Bottom Compliance Badges */}
                <div className="mt-14 pt-8 border-t border-white/5 flex flex-wrap justify-center gap-x-8 gap-y-4 text-emerald-300/60 font-mono text-[10px] tracking-wider uppercase font-semibold">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-emerald-400">verified</span>
                        Audit-Ready Data
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-emerald-400">verified</span>
                        Operators Portal
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm text-emerald-400">verified</span>
                        EU-Accredited Verification
                    </div>
                </div>
            </div>
        </section>
    );
}
