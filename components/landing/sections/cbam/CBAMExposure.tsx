"use client";

import { useState } from "react";

export default function CBAMExposure() {
    const [activeView, setActiveView] = useState<"default" | "verified">("verified");

    return (
        <section id="exposure" className="py-16 scroll-mt-24">
            <div className="bg-white/70 border border-white/80 rounded-xl p-8 md:p-12 lg:p-16 shadow-xs backdrop-blur-sm hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 mb-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                            Verified vs Default — Buyer Cost
                        </h2>
                        <p className="mt-4 text-sm md:text-base text-slate-700 leading-relaxed">
                            What your EU buyer pays on embedded emissions. Verified actual data avoids punitive default values; the cost passes back to you through price.
                        </p>
                    </div>

                    {/* Toggle Pills */}
                    <div className="flex gap-2 pb-2 shrink-0">
                        <button
                            onClick={() => setActiveView("default")}
                            className={`px-5 py-2 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                activeView === "default"
                                    ? "bg-emerald-600 text-white shadow-md"
                                    : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
                            }`}>
                            Default
                        </button>
                        <button
                            onClick={() => setActiveView("verified")}
                            className={`px-5 py-2 rounded-full font-mono text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                                activeView === "verified"
                                    ? "bg-emerald-600 text-white shadow-md"
                                    : "bg-white border border-slate-200 text-slate-500 hover:border-slate-300"
                            }`}>
                            Verified
                        </button>
                    </div>
                </div>

                {/* Comparison Visual */}
                <div className="relative pt-8 pb-8 flex flex-col md:flex-row items-end justify-center gap-12 md:gap-24 min-h-[320px]">
                    {/* EU Default Value Bar */}
                    <div className="flex flex-col items-center w-full md:w-auto">
                        <div
                            className={`w-full md:w-64 rounded-lg transition-all duration-500 ${
                                activeView === "default"
                                    ? "h-48 bg-gradient-to-b from-amber-300 to-amber-500 shadow-lg shadow-amber-500/20"
                                    : "h-48 bg-gradient-to-b from-amber-300 to-amber-500 opacity-60"
                            }`}
                            style={{ borderBottomLeftRadius: "0.5rem", borderBottomRightRadius: "0.5rem" }}
                        />
                        <h4 className="text-base font-bold text-slate-900 mt-4 text-center">
                            EU default value
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 text-center">
                            Worst-decile benchmark · +10% in 2026
                        </p>
                    </div>

                    {/* Your Verified Data Bar */}
                    <div className="flex flex-col items-center w-full md:w-auto">
                        <div
                            className={`w-full md:w-64 rounded-lg transition-all duration-500 ${
                                activeView === "verified"
                                    ? "h-32 bg-gradient-to-b from-emerald-300 to-emerald-500 shadow-lg shadow-emerald-500/20"
                                    : "h-32 bg-gradient-to-b from-emerald-300 to-emerald-500 opacity-60"
                            }`}
                            style={{ borderBottomLeftRadius: "0.5rem", borderBottomRightRadius: "0.5rem" }}
                        />
                        <h4 className="text-base font-bold text-slate-900 mt-4 text-center">
                            Your verified data
                        </h4>
                        <p className="text-xs text-slate-500 mt-1 text-center">
                            Actual installation emissions
                        </p>
                    </div>
                </div>

                {/* Savings Note */}
                <div className="text-center mt-4 mb-8">
                    <p className="text-emerald-600 font-semibold text-sm flex items-center justify-center gap-1.5">
                        <span className="material-symbols-outlined text-base">arrow_downward</span>
                        ~30–40% lower buyer cost with verified data
                    </p>
                </div>

                {/* Footer Note */}
                <div className="pt-6 border-t border-slate-200 text-xs text-slate-500 text-center leading-relaxed">
                    Your EU buyer purchases certificates from 1 Feb 2027 and first surrenders by 30 Sep 2027 (for 2026 imports). The CBAM factor phases in from 2.5% in 2026 to 100% by 2034 — so the verified-vs-default gap widens every year.
                </div>
            </div>
        </section>
    );
}
