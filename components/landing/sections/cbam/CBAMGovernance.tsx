export default function CBAMGovernance() {
    const steps = [
        {
            num: "01",
            title: "Data Ingestion",
            description: "Secure aggregation of SKU-level production data and energy mix profiles.",
            icon: "database",
            badge: "PROCESSING",
            badgeIcon: "sync",
            glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
        },
        {
            num: "02",
            title: "Emissions Logic",
            description: "Automated Scope 1, 2, and 3 calculations aligned with EU methodologies.",
            icon: "calculate",
            badge: "CALCULATING",
            badgeIcon: "analytics",
            glow: "group-hover:shadow-[0_0_30px_rgba(20,184,166,0.25)]",
        },
        {
            num: "03",
            title: "Third-Party Audit",
            description: "Streamlined evidence package generation for accredited verifiers.",
            icon: "verified_user",
            badge: "VERIFYING",
            badgeIcon: "verified",
            glow: "group-hover:shadow-[0_0_30px_rgba(16,185,129,0.25)]",
        },
        {
            num: "04",
            title: "Final Declaration",
            description: "Validated submission to the CBAM Transitional Registry system.",
            icon: "send",
            badge: "SUBMITTING",
            badgeIcon: "cloud_done",
            glow: "group-hover:shadow-[0_0_30px_rgba(20,184,166,0.25)]",
        },
    ];

    return (
        <section id="governance" className="py-16 relative scroll-mt-24 overflow-hidden">
            {/* Drifting Neon Background Orbs for Flashiness */}
            <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none z-0 gl-drift"></div>
            <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none z-0 gl-drift-2"></div>

            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes flow {
                    from { background-position: 200% 0; }
                    to { background-position: -200% 0; }
                }
                .flow-line-animate {
                    background: linear-gradient(90deg, #10b981 0%, rgba(20, 184, 166, 0.2) 50%, #10b981 100%);
                    background-size: 200% 100%;
                    animation: flow 4s linear infinite;
                }
            ` }} />

            <div className="text-center mb-20 relative z-10">
                <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight [text-shadow:0_1px_2px_rgba(0,0,0,0.05)]">
                    Governance Lifecycle
                </h2>
                <p className="mt-4 text-base md:text-lg text-slate-700 max-w-2xl mx-auto leading-relaxed">
                    An end-to-end operational framework for mandatory carbon reporting and verification.
                </p>
            </div>

            <div className="relative z-10">
                {/* Connecting Line Flow Animation */}
                <div className="absolute top-1/2 left-0 w-full h-[3px] flow-line-animate hidden lg:block -translate-y-24 opacity-40 z-0"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
                    {steps.map((step) => (
                        <div key={step.num} className="group relative">
                            {/* Glow card border wrapper */}
                            <div className={`h-full border p-8 rounded-xl transition-all duration-500 -translate-y-3 border-emerald-400/50 bg-white flex flex-col justify-between shadow-xs shadow-[0_0_30px_rgba(20,184,166,0.25)]`}>
                                <div>
                                    {/* Card Header & Icon */}
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white scale-110 bg-black/80 transition-all duration-500 shadow-md shadow-emerald-950/20">
                                            <span className="material-symbols-outlined text-2xl">{step.icon}</span>
                                        </div>
                                        <span className="text-5xl font-black text-slate-200/80 bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(16,185,129,0.3)] transition-all duration-500 font-mono">
                                            {step.num}
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="h-0.5 w-full bg-slate-100 mb-6 bg-gradient-to-r from-emerald-500/30 to-teal-500/10 transition-colors"></div>

                                    {/* Text Content */}
                                    <h3 className="text-xl font-bold text-slate-900 mb-3 text-emerald-800 transition-colors">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm leading-relaxed text-slate-600 font-medium">
                                        {step.description}
                                    </p>
                                </div>

                                {/* Active badge on hover */}
                                <div className="mt-8 flex items-center gap-2 text-emerald-600 font-mono text-[10px] tracking-wider font-extrabold opacity-0 opacity-100 transition-all duration-300 translate-y-2 translate-y-0">
                                    <span className="material-symbols-outlined text-[13px] animate-spin">{step.badgeIcon}</span>
                                    {step.badge}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
