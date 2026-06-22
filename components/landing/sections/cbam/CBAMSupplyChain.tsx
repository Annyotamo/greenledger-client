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
                            Installation Traceability
                        </div>
                        <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                            Production Route Profile
                        </h2>
                        <p className="text-emerald-100/60 text-sm md:text-base mb-10 leading-relaxed">
                            Your plants and routes. Direct emissions + precursors, benchmarked to EU default values.
                        </p>

                        <div className="space-y-4">
                            {/* Route Card 1: High-intensity */}
                            <div className="p-6 bg-white/5 rounded-2xl border border-amber-500/30 hover:border-amber-400/50 transition-colors duration-300">
                                <h4 className="text-white font-bold text-sm mb-2">
                                    High-intensity route — coal-based DRI
                                </h4>
                                <p className="text-emerald-100/70 text-xs md:text-sm leading-relaxed">
                                    Above the EU default benchmark → higher cost for your buyer. Direct + precursor emissions drive the steel number.
                                </p>
                            </div>

                            {/* Route Card 2: Low-intensity */}
                            <div className="p-6 bg-white/5 rounded-2xl border border-emerald-400/30 hover:border-emerald-400/50 transition-colors duration-300">
                                <h4 className="text-white font-bold text-sm mb-2">
                                    Low-intensity route — EAF / scrap
                                </h4>
                                <p className="text-emerald-100/70 text-xs md:text-sm leading-relaxed">
                                    Below benchmark. Prioritise this route for EU-bound shipments to stay competitive.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Plant Badges & Visual */}
                    <div className="relative bg-[#02130e] flex flex-col items-center justify-center p-8 md:p-12 overflow-hidden min-h-[400px]">
                        {/* Overlay Gradients */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 via-transparent to-teal-500/10 pointer-events-none"></div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.06)_0%,transparent_70%)] pointer-events-none"></div>

                        {/* Plant Badges */}
                        <div className="flex flex-wrap gap-3 mb-8 relative z-10">
                            <span className="px-4 py-2 bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[11px] rounded-full tracking-wider font-semibold">
                                Plant A · Verified
                            </span>
                            <span className="px-4 py-2 bg-white/5 border border-white/15 text-slate-300 font-mono text-[11px] rounded-full tracking-wider font-semibold">
                                Plant C · Above default
                            </span>
                        </div>

                        {/* Image Container */}
                        <div className="relative w-full max-w-sm aspect-square flex items-center justify-center">
                            <img
                                alt="3D Frosted Glass Globe Map"
                                className="w-full h-full object-contain drop-shadow-[0_0_80px_rgba(52,211,153,0.12)] opacity-85 select-none pointer-events-none"
                                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIB8u903KbiNed_4c5QuF6wgi7iUqHOZ5ZBK8dhvk6avlYLx65iqq9g-D0tAN4MDk_S8kJSyB9dgKjdty8s3bsn8_T47lY5pclaUYotnqxU7BEuBn8jOL7zEMFBw5A7zr8R1tPBvdSfMRfJzxTvna12c8i2cXSiTAwI_I4O6VkYlHhKK8T_kUvg_nVMSZ8rqppEqh2PT6xYgLv97uImqh_MMnzSbarfvho_yiAYDLDlS8mycd5Guz4icHwLLBEIrHsTNbBZJm53dM"
                            />
                        </div>
                    </div>
                </div>

                {/* Bottom Section: Product / Route Data Table */}
                <div className="p-6 md:p-8 lg:p-12 bg-emerald-950/20 border-t border-emerald-500/10">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[500px]">
                            <thead>
                                <tr className="text-[10px] font-mono text-emerald-300/40 uppercase tracking-widest border-b border-emerald-500/10 pb-4">
                                    <th className="pb-4 px-4 font-semibold">Product / Route</th>
                                    <th className="pb-4 px-4 font-semibold">Volume</th>
                                    <th className="pb-4 px-4 font-semibold text-right">Direct Intensity</th>
                                    <th className="pb-4 px-4 font-semibold text-right">vs EU Default</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-emerald-100/80 divide-y divide-emerald-500/5">
                                <tr className="hover:bg-white/5 transition-colors duration-200">
                                    <td className="py-5 px-4 font-bold text-white">DRI / sponge iron (coal)</td>
                                    <td className="py-5 px-4">42,500 <span className="text-xs text-emerald-300/40">t</span></td>
                                    <td className="py-5 px-4 text-right font-mono">
                                        2.4 <span className="text-xs text-emerald-300/40">tCO₂e/t</span>
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                        <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                                            Above
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors duration-200">
                                    <td className="py-5 px-4 font-bold text-white">EAF crude steel (scrap)</td>
                                    <td className="py-5 px-4">18,000 <span className="text-xs text-emerald-300/40">t</span></td>
                                    <td className="py-5 px-4 text-right font-mono">
                                        0.9 <span className="text-xs text-emerald-300/40">tCO₂e/t</span>
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                                            Below
                                        </span>
                                    </td>
                                </tr>
                                <tr className="hover:bg-white/5 transition-colors duration-200">
                                    <td className="py-5 px-4 font-bold text-white">Hot-rolled coil</td>
                                    <td className="py-5 px-4">12,000 <span className="text-xs text-emerald-300/40">t</span></td>
                                    <td className="py-5 px-4 text-right font-mono">
                                        1.8 <span className="text-xs text-emerald-300/40">tCO₂e/t</span>
                                    </td>
                                    <td className="py-5 px-4 text-right">
                                        <span className="px-3 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/20 rounded text-[10px] font-bold uppercase tracking-wider">
                                            Near
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
