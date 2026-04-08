"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";

import { useSidebarStore } from "@/lib/sidebarStore";
import { LuChevronDown, LuChevronRight, LuFactory, LuLeaf, LuMenu, LuScanLine, LuShieldCheck } from "react-icons/lu";

type SidebarItemProps = {
    label: string;
    icon: ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    compact: boolean;
};

const baseItemClasses =
    "group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-500 cursor-pointer" +
    " hover:bg-emerald-50 hover:text-emerald-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40" +
    " border border-emerald-900/10 hover:border-emerald-700/20" +
    " shadow-sm hover:shadow-[0_14px_30px_rgba(20,80,40,0.14)]" +
    " backdrop-blur-sm bg-white/70";

function SidebarItem({ label, icon, isActive, onClick, compact }: SidebarItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${baseItemClasses} ${
                isActive ? "bg-emerald-50 text-emerald-950 border-emerald-700/20 shadow-md" : "text-slate-700"
            }`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700/10 text-emerald-800 ring-1 ring-emerald-900/10 group-hover:bg-emerald-700/15 group-hover:text-emerald-900">
                {icon}
            </span>
            {!compact && <span className="flex-1 text-left tracking-tight whitespace-nowrap">{label}</span>}
        </button>
    );
}

export function Sidebar() {
    const { isOpen, toggle, activeSection, setActiveSection, ghgExpanded, toggleGhg } = useSidebarStore();

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const compact = !isOpen && !isMobile;

    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3 bg-white/80 border-b border-emerald-900/10 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700/10 text-emerald-800 ring-1 ring-emerald-900/10">
                        <LuScanLine className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800/80">
                            ESG CONTROL TOWER
                        </span>
                        <span className="text-sm font-medium text-slate-900/90">Finance-grade ESG & GHG</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={toggle}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-900/15 bg-white/70 text-slate-800 shadow-sm hover:border-emerald-700/25 hover:text-emerald-900 transition-all duration-200">
                    <LuMenu className="h-4 w-4" />
                </button>
            </div>

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-emerald-900/10 bg-white/78 backdrop-blur-xl shadow-[0_18px_55px_-30px_rgba(0,40,25,0.35)] rounded-r-3xl transition-[width,transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${
                    isMobile ? (isOpen ? "translate-x-0 w-64" : "-translate-x-full w-64") : isOpen ? "w-72" : "w-17"
                }`}>
                {/* Brand */}
                <div className="hidden md:flex items-center gap-3 px-4 pt-6 pb-4 border-b border-emerald-900/10">
                    <div className="relative flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-700/10 text-emerald-800 ring-1 ring-emerald-900/10 overflow-hidden">
                        <span className="absolute inset-[-40%] bg-[conic-gradient(from_220deg,rgba(31,122,63,0.18)_0deg,transparent_120deg,transparent_240deg,rgba(136,190,151,0.22)_360deg)] opacity-80" />
                        <LuScanLine className="relative h-5 w-5" aria-hidden />
                    </div>
                    {!compact && (
                        <div className="flex flex-col">
                            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-emerald-800/75">
                                ESG CONTROL TOWER
                            </span>
                            <span className="text-sm font-medium tracking-tight text-slate-900/90">
                                Finance-grade climate ledger
                            </span>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="flex-1 px-3 pt-5 pb-6 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-emerald-800/30 scrollbar-track-transparent">
                    <SidebarItem
                        label="ESG Accounting"
                        icon={<LuLeaf className="h-4 w-4" />}
                        compact={compact}
                        isActive={activeSection === "esg-accounting"}
                        onClick={() => setActiveSection("esg-accounting")}
                    />

                    {/* GHG group */}
                    <div className="space-y-1">
                        <button
                            type="button"
                            onClick={toggleGhg}
                            className={`${baseItemClasses} ${
                                activeSection === "ghg-accounting" || activeSection === "scope-1"
                                    ? "bg-emerald-50 text-emerald-950 border-emerald-700/20 shadow-md"
                                    : "text-slate-700"
                            } w-full`}>
                            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700/10 text-emerald-800 ring-1 ring-emerald-900/10 group-hover:bg-emerald-700/15 group-hover:text-emerald-900">
                                <LuFactory className="h-4 w-4" />
                            </span>
                            {!compact && (
                                <>
                                    <span className="flex-1 text-left tracking-tight whitespace-nowrap">
                                        GHG accounting
                                    </span>
                                    {ghgExpanded ? (
                                        <LuChevronDown className="h-4 w-4 text-slate-500" />
                                    ) : (
                                        <LuChevronRight className="h-4 w-4 text-slate-500" />
                                    )}
                                </>
                            )}
                        </button>

                        {/* Scope 1 child */}
                        {ghgExpanded && !compact && (
                            <div className="pl-4 space-y-1">
                                <button
                                    type="button"
                                    onClick={() => setActiveSection("scope-1")}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium tracking-tight transition-all duration-200 ${
                                        activeSection === "scope-1"
                                            ? "bg-emerald-50 text-emerald-950 ring-1 ring-emerald-900/10"
                                            : "text-slate-600 hover:bg-emerald-50/70 hover:text-emerald-900"
                                    }`}>
                                    <span className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-700 ring-1 ring-emerald-900/10" />
                                        <span>Scope-1 (direct emissions)</span>
                                    </span>
                                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-emerald-900/60">
                                        Real-time
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>

                    <SidebarItem
                        label="Finance-grade ESG reporting"
                        icon={<LuShieldCheck className="h-4 w-4" />}
                        compact={compact}
                        isActive={activeSection === "finance-esg-reporting"}
                        onClick={() => setActiveSection("finance-esg-reporting")}
                    />

                    <SidebarItem
                        label="Audit compliance (logs, traits)"
                        icon={<LuShieldCheck className="h-4 w-4 rotate-12" />}
                        compact={compact}
                        isActive={activeSection === "audit-compliance"}
                        onClick={() => setActiveSection("audit-compliance")}
                    />
                </nav>

                {/* Collapse control (desktop) */}
                <div className="hidden md:flex items-center justify-between px-3 pb-5 pt-4 border-t border-emerald-900/10">
                    {!compact && (
                        <div className="flex flex-col text-[0.7rem] text-slate-500 leading-tight">
                            <span className="font-semibold uppercase tracking-[0.18em] text-emerald-900/70">
                                Assurance ready
                            </span>
                            <span className="text-slate-500/90">Audit trails, evidence links, traits</span>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={toggle}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-emerald-900/15 bg-white/70 text-slate-700 shadow-sm hover:border-emerald-700/25 hover:text-emerald-900 transition-all duration-200">
                        {isOpen ? (
                            <span className="text-xs font-medium">⟨⟨</span>
                        ) : (
                            <span className="text-xs font-medium">⟩⟩</span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
