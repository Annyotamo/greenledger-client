"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useSidebarStore } from "@/lib/sidebarStore";
import {
    LuChevronDown,
    LuChevronRight,
    LuFactory,
    LuLeaf,
    LuMenu,
    LuScanLine,
    LuSettings2,
    LuShieldCheck,
    LuSparkles,
} from "react-icons/lu";

type SidebarItemProps = {
    label: string;
    icon: ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    compact: boolean;
};

const baseItemClasses =
    "group flex items-center gap-3 rounded-2xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 cursor-pointer" +
    " hover:bg-white/16 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/35" +
    " border border-white/20 hover:border-emerald-200/35" +
    " shadow-sm hover:shadow-[0_14px_28px_rgba(0,0,0,0.35)]" +
    " backdrop-blur-sm bg-white/10";

function SidebarItem({ label, icon, isActive, onClick, compact }: SidebarItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`${baseItemClasses} ${
                isActive ? "bg-white/22 text-white border-emerald-200/45 shadow-md" : "text-emerald-50/85"
            }`}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/14 text-emerald-50 ring-1 ring-white/15 group-hover:bg-white/20 group-hover:text-white">
                {icon}
            </span>
            {!compact && <span className="flex-1 text-left tracking-tight whitespace-nowrap">{label}</span>}
        </button>
    );
}

export function Sidebar() {
    const { isOpen, toggle, activeSection, setActiveSection, ghgExpanded, toggleGhg } = useSidebarStore();
    const router = useRouter();
    const pathname = usePathname();

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const compact = !isOpen && !isMobile;
    const scopeRouteActive = pathname === "/scope-1" || pathname.startsWith("/scope-1/");
    const settingsRouteActive = pathname === "/dashboard/settings" || pathname.startsWith("/dashboard/settings/");

    return (
        <>
            {/* Mobile top bar */}
            <div className="md:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3 bg-[#f6fff8]/80 border-b border-emerald-900/10 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-700/10 text-emerald-800 ring-1 ring-emerald-900/10">
                        <LuScanLine className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800/80">
                            ESG CONTROL TOWER
                        </span>
                        <span className="text-sm font-medium text-slate-900/90">Finance-grade ESG &amp; GHG</span>
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
                className={`fixed z-30 flex flex-col overflow-hidden border border-white/20 bg-linear-to-b from-[#16362c]/62 via-[#112b23]/55 to-[#0d221c]/58 text-white backdrop-blur-2xl shadow-[0_30px_70px_-30px_rgba(0,0,0,0.65)] transition-[width,transform,opacity,left,right,top,bottom] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
                    isMobile
                        ? isOpen
                            ? "left-3 right-3 top-3 bottom-3 translate-x-0 rounded-3xl opacity-100"
                            : "-translate-x-[110%] left-3 right-3 top-3 bottom-3 rounded-3xl opacity-0 pointer-events-none"
                        : isOpen
                          ? "left-4 top-4 bottom-4 w-72 rounded-3xl"
                          : "left-4 top-4 bottom-4 w-22 rounded-3xl"
                }`}>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_0%_0%,rgba(255,255,255,0.24),transparent_55%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_100%_0%,rgba(110,231,183,0.16),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/20" />
                {/* Brand */}
                <div className="relative hidden md:flex items-center gap-3 px-4 pt-5 pb-4 border-b border-white/12">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/14 text-emerald-50 ring-1 ring-white/20 overflow-hidden">
                        <span className="absolute inset-[-40%] bg-[conic-gradient(from_220deg,rgba(16,185,129,0.22)_0deg,transparent_120deg,transparent_240deg,rgba(110,231,183,0.3)_360deg)] opacity-90" />
                        <LuScanLine className="relative h-5 w-5" aria-hidden />
                    </div>
                    {!compact && (
                        <div className="flex flex-col">
                            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-emerald-100/75">
                                ESG CONTROL TOWER
                            </span>
                            <span className="text-sm font-medium tracking-tight text-white/90">
                                Finance-grade climate ledger
                            </span>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav className="relative flex-1 overflow-y-scroll px-3 pt-4 pb-5 space-y-3 scrollbar-thin scrollbar-thumb-white/35 scrollbar-track-white/8">
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
                                    ? "bg-white/22 text-white border-emerald-200/45 shadow-md"
                                    : "text-emerald-50/85"
                            } w-full`}>
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/14 text-emerald-50 ring-1 ring-white/15 group-hover:bg-white/20 group-hover:text-white">
                                <LuFactory className="h-4 w-4" />
                            </span>
                            {!compact && (
                                <>
                                    <span className="flex-1 text-left tracking-tight whitespace-nowrap">
                                        GHG accounting
                                    </span>
                                    {ghgExpanded ? (
                                        <LuChevronDown className="h-4 w-4 text-emerald-100/70" />
                                    ) : (
                                        <LuChevronRight className="h-4 w-4 text-emerald-100/70" />
                                    )}
                                </>
                            )}
                        </button>

                        {/* Scope 1 child */}
                        {ghgExpanded && !compact && (
                            <div className="pl-4 space-y-1">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveSection("scope-1");
                                        router.push("/scope-1");
                                    }}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium tracking-tight transition-all duration-200 ${
                                        activeSection === "scope-1" || scopeRouteActive
                                            ? "bg-white/20 text-white ring-1 ring-emerald-200/35"
                                            : "text-emerald-100/70 hover:bg-white/12 hover:text-white"
                                    }`}>
                                    <span className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 ring-1 ring-emerald-100/30" />
                                        <span>Scope-1 (direct emissions)</span>
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

                    <SidebarItem
                        label="Traceability studio"
                        icon={<LuSparkles className="h-4 w-4" />}
                        compact={compact}
                        isActive={activeSection === "traceability"}
                        onClick={() => setActiveSection("traceability")}
                    />

                    <SidebarItem
                        label="Settings"
                        icon={<LuSettings2 className="h-4 w-4" />}
                        compact={compact}
                        isActive={activeSection === "settings" || settingsRouteActive}
                        onClick={() => {
                            setActiveSection("settings");
                            router.push("/dashboard/settings");
                        }}
                    />

                    {!compact && (activeSection === "settings" || settingsRouteActive) && (
                        <div className="pl-4">
                            <button
                                type="button"
                                onClick={() => {
                                    setActiveSection("settings");
                                    router.push("/dashboard/settings");
                                }}
                                className="flex w-full items-center justify-between rounded-lg bg-white/18 px-3 py-1.5 text-xs font-medium tracking-tight text-white ring-1 ring-emerald-200/35 transition-all duration-200">
                                <span className="flex items-center gap-2">
                                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 ring-1 ring-emerald-100/30" />
                                    <span>Scope factors</span>
                                </span>
                                <LuChevronRight className="h-4 w-4 text-emerald-100/80" />
                            </button>
                        </div>
                    )}
                </nav>

                {/* Collapse control (desktop) */}
                <div className="relative hidden md:flex items-center justify-between px-3 pb-4 pt-3 border-t border-white/12">
                    {!compact && (
                        <div className="flex flex-col text-[0.7rem] text-emerald-100/65 leading-tight">
                            <span className="font-semibold uppercase tracking-[0.18em] text-emerald-100/80">
                                Assurance ready
                            </span>
                            <span className="text-emerald-100/65">Audit trails, evidence links, traits</span>
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={toggle}
                        className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/20 bg-white/12 text-emerald-100 shadow-sm hover:border-emerald-200/40 hover:bg-white/18 hover:text-white transition-all duration-200">
                        {isOpen ? (
                            <span className="text-xs font-medium">⟨</span>
                        ) : (
                            <span className="text-xs font-medium">⟩</span>
                        )}
                    </button>
                </div>
            </aside>
        </>
    );
}
