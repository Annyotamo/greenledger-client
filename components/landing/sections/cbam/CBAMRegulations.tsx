export default function CBAMRegulations() {
    return (
        <section id="regulations" className="py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 scroll-mt-24">
            {/* Left Column: Regulatory Alignment */}
            <div className="bg-white/70 border border-white/80 p-8 md:p-10 rounded-xl shadow-xs backdrop-blur-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-500/20 transition-all duration-300">
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-emerald-900/10 rounded-xl flex items-center justify-center text-emerald-800">
                            <span className="material-symbols-outlined text-2xl">policy</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Regulatory Alignment
                        </h3>
                    </div>

                    <div className="space-y-6">
                        {/* Regulation Item 1 */}
                        <div className="flex gap-4 group cursor-pointer">
                            <span className="material-symbols-outlined text-emerald-600 mt-1 shrink-0">
                                check_circle
                            </span>
                            <div>
                                <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                    Regulation (EU) 2023/956 Compliance
                                </h4>
                                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                                    Full mapping of primary emissions calculation methods as per EU guidance.
                                </p>
                            </div>
                        </div>

                        {/* Regulation Item 2 */}
                        <div className="flex gap-4 group cursor-pointer">
                            <span className="material-symbols-outlined text-emerald-600 mt-1 shrink-0">
                                update
                            </span>
                            <div>
                                <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                    Registry v2.4 Patch Sync
                                </h4>
                                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                                    Automated updates for product-specific benchmark thresholds and CN codes.
                                </p>
                            </div>
                        </div>

                        {/* Regulation Item 3 */}
                        <div className="flex gap-4 group cursor-pointer">
                            <span className="material-symbols-outlined text-emerald-600 mt-1 shrink-0">
                                description
                            </span>
                            <div>
                                <h4 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                                    Transitional Phase Reporting
                                </h4>
                                <p className="text-sm text-slate-700 mt-1 leading-relaxed">
                                    Dynamic reporting templates for Q1 2024 - Q4 2025 submission cycles.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="mt-10 w-full py-4 border border-slate-200 rounded-xl font-mono text-xs uppercase tracking-wider hover:bg-emerald-50/50 hover:border-emerald-200 hover:text-emerald-700 transition-colors flex items-center justify-center gap-2 cursor-pointer font-semibold">
                    2024 Compliance Guide
                    <span className="material-symbols-outlined text-sm">download</span>
                </button>
            </div>

            {/* Right Column: Import Documentation */}
            <div className="bg-white/70 border border-white/80 p-8 md:p-10 rounded-xl shadow-xs backdrop-blur-sm flex flex-col justify-between hover:shadow-md hover:border-emerald-500/20 transition-all duration-300">
                <div>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 bg-emerald-900/10 rounded-xl flex items-center justify-center text-emerald-800">
                            <span className="material-symbols-outlined text-2xl">analytics</span>
                        </div>
                        <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                            Import Documentation
                        </h3>
                    </div>

                    {/* Counter Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <div className="bg-emerald-50/50 border border-emerald-100/50 p-6 rounded-2xl">
                            <div className="text-slate-500 font-mono text-[10px] tracking-wider uppercase mb-1">
                                Declarations Generated
                            </div>
                            <div className="text-3xl font-extrabold text-slate-900">
                                12,402
                            </div>
                        </div>
                        <div className="bg-emerald-50/50 border border-emerald-100/50 p-6 rounded-2xl">
                            <div className="text-slate-500 font-mono text-[10px] tracking-wider uppercase mb-1">
                                Validation Rate
                            </div>
                            <div className="text-3xl font-extrabold text-emerald-700">
                                99.8%
                            </div>
                        </div>
                    </div>

                    {/* Checklist */}
                    <ul className="space-y-4">
                        <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                            <span className="material-symbols-outlined text-emerald-600 font-bold">check</span>
                            Automated CN Code Mapping
                        </li>
                        <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                            <span className="material-symbols-outlined text-emerald-600 font-bold">check</span>
                            Batch Declaration Generation
                        </li>
                        <li className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                            <span className="material-symbols-outlined text-emerald-600 font-bold">check</span>
                            Direct XML Export for EU Registry
                        </li>
                    </ul>
                </div>

                <div className="mt-10 p-4 bg-emerald-50/30 rounded-xl border border-dashed border-emerald-200 text-xs text-slate-600 text-center leading-relaxed">
                    Complies with EU specifications for carbon certificates XML schemas.
                </div>
            </div>
        </section>
    );
}
