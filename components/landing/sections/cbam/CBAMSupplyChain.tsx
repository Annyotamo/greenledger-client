export default function CBAMSupplyChain() {
    return (
        <section id="supply-chain" className="scroll-mt-24">
            <div className="bg-[#031c15]/95 border border-emerald-500/10 rounded-xl shadow-[0_32px_64px_-16px_rgba(0,40,25,0.4)] relative backdrop-blur-md overflow-hidden">
                {/* Tech Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-5 pointer-events-none"
                    style={{
                        backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
                        backgroundSize: "24px 24px",
                    }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
                    {/* Left Column: Traceability Info */}
                    <div className="p-8 md:p-12 lg:p-16 border-b lg:border-b-0 lg:border-r border-emerald-500/10">
                        <div className="text-emerald-400 font-mono text-[10px] mb-4 uppercase tracking-[0.25em] font-semibold">
                            Global Traceability
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                            Supply Chain Node Map
                        </h2>
                        <p className="text-emerald-100/60 text-sm md:text-base mb-10 leading-relaxed">
                            Visualizing 42 overseas smelters and production sites. Monitor upstream environmental risks and direct production emissions from global supplier nodes in one unified interface.
                        </p>

                        <div className="space-y-4">
                            {/* Alert Card 1 */}
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-rose-500/30 transition-colors duration-300">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-rose-400 font-bold text-sm flex items-center gap-1.5">
                                        <span className="flex h-2 w-2 rounded-full bg-rose-400 animate-pulse"></span>
                                        +24% Risk
                                    </span>
                                    <span className="text-emerald-300/40 font-mono text-[10px] uppercase tracking-wider font-semibold">
                                        Asia Pacific Hub
                                    </span>
                                </div>
                                <p className="text-emerald-100/70 text-xs md:text-sm leading-relaxed">
                                    Energy-Grid Intensity Alert: High-carbon input detected from local grid nodes.
                                </p>
                            </div>

                            {/* Alert Card 2 */}
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:border-emerald-400/30 transition-colors duration-300">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-emerald-400 font-bold text-sm flex items-center gap-1.5">
                                        <span className="flex h-2 w-2 rounded-full bg-emerald-400"></span>
                                        -8.2% Imp
                                    </span>
                                    <span className="text-emerald-300/40 font-mono text-[10px] uppercase tracking-wider font-semibold">
                                        EU Core Region
                                    </span>
                                </div>
                                <p className="text-emerald-100/70 text-xs md:text-sm leading-relaxed">
                                    Verified Low-Carbon Input: Validated renewable energy mix at primary smelter.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Globe Map Visual */}
                    <div className="relative bg-[#02130e] flex items-center justify-center p-8 md:p-12 overflow-hidden min-h-[400px]">
                        {/* Overlay Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/10 pointer-events-none"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.06)_0%,transparent_70%)] pointer-events-none"></div>

                        {/* Image Container with Node Overlays */}
                        <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                            <img
                                alt="3D Frosted Glass Globe Map"
                                className="w-full h-full object-contain drop-shadow-[0_0_80px_rgba(52,211,153,0.12)] opacity-85 select-none pointer-events-none"
                                src="https://lh3.googleusercontent.com/aida/AP1WRLtIl_QEhAZgVY9FYyKvcG6eM-tVnjiG4iyuNvKVmj_1cLuI2lKo4Mtny-w2XekicYsMCo7VtLxcHT_VQcDoeSj4Ypp5aSD0f-HOWbQ-uH98Cc-IizjDnyjUHT4eb4PRFWBAY8Rx26a4YoJ8LMm87BoHvvsRImdXDomOOfLlNsK0w5w8kTf__-gG8Q-IwipThodh-56NXmNok7LeJFIz10NtoxsWhUVh1-z4-xYIyq8fIv31-cJyzIYw414"
                            />

                            {/* Node 1: Asia Pacific Hub Alert */}
                            <div className="absolute bottom-1/3 left-1/4 bg-slate-900/80 border border-rose-500/40 px-3 py-1.5 rounded-lg text-[10px] text-white flex items-center gap-1.5 shadow-xl backdrop-blur-md animate-pulse">
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0"></span>
                                <span><strong className="text-rose-400 font-bold">Node 12C:</strong> High Risk</span>
                            </div>

                            {/* Node 2: EU Core Region Validated */}
                            <div className="absolute top-1/4 right-1/4 bg-slate-900/80 border border-emerald-500/40 px-3 py-1.5 rounded-lg text-[10px] text-white flex items-center gap-1.5 shadow-xl backdrop-blur-md animate-pulse">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"></span>
                                <span><strong className="text-emerald-400 font-bold">Node 74A:</strong> Validated</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Detailed Sector Data Table */}
                <div className="p-6 md:p-8 lg:p-12 bg-emerald-950/20 border-t border-emerald-500/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[500px]">
                            <thead>
                                <tr className="text-[10px] font-mono text-emerald-300/40 uppercase tracking-widest border-b border-emerald-500/10 pb-4">
                                    <th className="pb-4 px-4 font-semibold">Regional Import Sector</th>
                                    <th className="pb-4 px-4 font-semibold">Volume (Metric Tons)</th>
                                    <th className="pb-4 px-4 font-semibold text-right">Avg Intensity</th>
                                    <th className="pb-4 px-4 font-semibold text-right">Risk Rating</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-emerald-100/80 divide-y divide-emerald-500/5">
                                <tr className="hover:bg-white/5 transition-colors duration-200">
                                    <td className="py-5 px-4 font-bold text-white">South Asia (Iron & Steel)</td>
                                    <td className="py-5 px-4">42,500 mt</td>
                                    <td className="py-5 px-4 text-right font-mono">
                                        2.4 <span className="text-xs text-emerald-300/40">tCO2e/t</span>
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                        <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                                            High
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors duration-200">
                                    <td className="py-5 px-4 font-bold text-white">Middle East (Fertilizers)</td>
                                    <td className="py-5 px-4">12,100 mt</td>
                                    <td className="py-5 px-4 text-right font-mono">
                                        1.1 <span className="text-xs text-emerald-300/40">tCO2e/t</span>
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                                            Low
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors duration-200">
                                    <td className="py-5 px-4 font-bold text-white">LatAm (Aluminum)</td>
                                    <td className="py-5 px-4">8,900 mt</td>
                                    <td className="py-5 px-4 text-right font-mono">
                                        1.8 <span className="text-xs text-emerald-300/40">tCO2e/t</span>
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                        <span className="px-3 py-1 bg-white/5 text-slate-300 border border-white/10 rounded text-[10px] font-bold uppercase tracking-wider">
                                            Medium
                                        </span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    );
}
