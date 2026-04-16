"use client";

import { Sidebar } from "@/components/dashboard/SidebarShell";
import { ScopeFactorSettings } from "@/components/dashboard/ScopeFactorSettings";
import { useSidebarStore } from "@/lib/sidebarStore";

export default function DashboardSettingsPage() {
    const sidebarOpen = useSidebarStore((s) => s.isOpen);

    return (
        <div className="relative min-h-screen w-full overflow-hidden text-slate-900">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_70%_at_10%_10%,rgba(31,122,63,0.12),transparent_60%)]" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_90%_5%,rgba(45,107,78,0.14),transparent_60%)]" />
            <Sidebar />

            <main
                className={[
                    "px-4 pb-8 pt-16 sm:px-5 md:pr-8 md:pt-4 lg:pr-10",
                    sidebarOpen ? "md:pl-80" : "md:pl-28",
                    "transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                ].join(" ")}>
                <section className="section-bg relative overflow-hidden rounded-3xl border border-white/60 p-5 shadow-[0_30px_90px_-45px_rgba(0,40,25,0.6)] backdrop-blur-md sm:p-6 md:p-7">
                    <div className="pointer-events-none absolute -right-20 -top-16 h-56 w-56 rounded-full bg-emerald-500/12 blur-3xl" />
                    <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-500/12 blur-3xl" />

                    <ScopeFactorSettings />
                </section>
            </main>
        </div>
    );
}
