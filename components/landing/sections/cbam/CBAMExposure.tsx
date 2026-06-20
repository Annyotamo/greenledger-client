export default function CBAMExposure() {
    const data = [
        { quarter: "Q1 2024", height: "12%", phase: "transitional", value: "€1.2M" },
        { quarter: "Q3 2024", height: "18%", phase: "transitional", value: "€1.8M" },
        { quarter: "Q1 2025", height: "25%", phase: "transitional", value: "€2.5M" },
        { quarter: "Q3 2025", height: "38%", phase: "transitional", value: "€3.8M" },
        { quarter: "Q1 2026", height: "75%", phase: "definitive", value: "€7.5M" },
        { quarter: "Q3 2026", height: "92%", phase: "definitive", value: "€9.2M" },
    ];

    return (
        <section id="exposure" className="py-16 scroll-mt-24">
            <div className="bg-white/70 border border-white/80 rounded-xl p-8 md:p-12 lg:p-16 shadow-xs backdrop-blur-sm hover:shadow-md hover:border-emerald-500/20 transition-all duration-300 mb-10">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight">
                            CBAM Exposure Analysis
                        </h2>
                        <p className="mt-4 text-sm md:text-base text-slate-700 leading-relaxed">
                            Projected financial liabilities through the 2026 definitive phase based on current import volumes and carbon pricing forecasts.
                        </p>
                    </div>

                    {/* Chart Legend */}
                    <div className="flex gap-6 pb-2 shrink-0">
                        <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 bg-slate-200 border border-slate-300 rounded-full"></span>
                            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                Transitional Phase
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 bg-gradient-to-tr from-emerald-600 to-emerald-400 rounded-full"></span>
                            <span className="font-mono text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                Definitive Phase
                            </span>
                        </div>
                    </div>
                </div>

                {/* Graph Container */}
                <div className="relative pt-12 pb-8 h-[380px] flex items-end">
                    {/* Y-Axis Grid Lines & Labels */}
                    <div className="absolute inset-x-0 top-12 bottom-8 flex flex-col justify-between pointer-events-none border-b border-slate-200">
                        <div className="border-t border-slate-100 h-0 w-full relative">
                            <span className="absolute -top-3.5 -left-1 font-mono text-[10px] font-bold text-slate-400">
                                €10.0M
                            </span>
                        </div>
                        <div className="border-t border-slate-100 h-0 w-full relative">
                            <span className="absolute -top-3.5 -left-1 font-mono text-[10px] font-bold text-slate-400">
                                €7.5M
                            </span>
                        </div>
                        <div className="border-t border-slate-100 h-0 w-full relative">
                            <span className="absolute -top-3.5 -left-1 font-mono text-[10px] font-bold text-slate-400">
                                €5.0M
                            </span>
                        </div>
                        <div className="border-t border-slate-100 h-0 w-full relative">
                            <span className="absolute -top-3.5 -left-1 font-mono text-[10px] font-bold text-slate-400">
                                €2.5M
                            </span>
                        </div>
                    </div>

                    {/* Bars Container - Fixed h-full with flex align-stretch/end */}
                    <div className="relative z-10 w-full h-full flex items-end justify-between px-6 sm:px-12 md:px-20 gap-3">
                        {data.map((item, index) => (
                            <div key={index} className="flex flex-col items-center justify-end w-12 md:w-16 group relative h-full">
                                {/* Bar - Wrapper has height and resolves percentage */}
                                <div
                                    className={`w-full rounded-t-md transition-all duration-500 cursor-pointer relative hover:scale-x-105 flex flex-col justify-end ${
                                        item.phase === "transitional"
                                            ? "bg-slate-200 hover:bg-slate-300"
                                            : "bg-gradient-to-t from-emerald-700 to-emerald-500 hover:from-emerald-600 hover:to-emerald-400 shadow-[0_4px_16px_rgba(16,185,129,0.15)]"
                                    }`}
                                    style={{ height: item.height }}>

                                    {/* Value Tooltip */}
                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 border border-slate-800 text-white font-mono text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap shadow-lg z-20 font-bold">
                                        {item.value}
                                    </div>
                                </div>

                                {/* X-Axis Label */}
                                <span className="font-mono text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-4">
                                    {item.quarter}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
