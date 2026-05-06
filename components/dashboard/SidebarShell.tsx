"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Image from "next/image";

import { logout } from "@/lib/auth/api";
import { clearAuthToken } from "@/lib/auth/token";
import { clearAuthUser, getAuthUser } from "@/lib/auth/user";
import { useSidebarStore } from "@/lib/sidebarStore";
import { LuChevronDown, LuChevronRight, LuFactory, LuLeaf, LuLogOut, LuMenu, LuUser } from "react-icons/lu";

type SidebarItemProps = {
    label: string;
    icon: ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    compact: boolean;
};

const baseItemClasses =
    "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition cursor-pointer" +
    " border border-transparent" +
    " hover:bg-white/10 hover:text-white" +
    " focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300/40";

function SidebarItem({ label, icon, isActive, onClick, compact }: SidebarItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                baseItemClasses,
                compact ? "justify-center px-2" : "",
                isActive ? "bg-white/14 text-white border-emerald-200/25" : "text-emerald-50/80",
            ].join(" ")}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/14 text-emerald-50 ring-1 ring-white/15 group-hover:bg-white/20 group-hover:text-white">
                {icon}
            </span>
            {!compact && <span className="flex-1 text-left tracking-tight whitespace-nowrap">{label}</span>}
        </button>
    );
}

export function Sidebar() {
    const { isOpen, toggle, setOpen, activeSection, setActiveSection, ghgExpanded, toggleGhg } = useSidebarStore();
    const router = useRouter();
    const pathname = usePathname();

    const [isMobile, setIsMobile] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [userName, setUserName] = useState<string | null>(null);

    useEffect(() => {
        setUserName(getAuthUser()?.name ?? null);
    }, [pathname]);

    useEffect(() => {
        // Drawer mode for semi-medium screens too (prevents sidebar covering content).
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (mobile) setOpen(false);
        };
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [setOpen]);

    const compact = !isOpen && !isMobile;
    const scope1RouteActive = pathname === "/scope-1" || pathname.startsWith("/scope-1/");
    const scope2RouteActive = pathname === "/scope-2" || pathname.startsWith("/scope-2/");

    async function handleLogout() {
        if (isLoggingOut) return;
        setIsLoggingOut(true);

        try {
            await logout();
        } catch (error) {
            if (!(error instanceof AxiosError)) {
                console.error("Logout failed:", error);
            }
        } finally {
            clearAuthToken();
            clearAuthUser();
            router.push("/login");
            setIsLoggingOut(false);
        }
    }

    return (
        <>
            {/* Mobile top bar */}
            <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3 bg-[#f6fff8]/80 border-b border-emerald-900/10 backdrop-blur-xl">
                <div className="flex items-center gap-2">
                    <Image src="/GLLogo.png" alt="Green Ledger" width={50} height={50} className="h-5 w-5" />
                    <div className="flex flex-col">
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800/80">
                            GREEN LEDGER
                        </span>
                        <span className="text-sm font-medium text-slate-900/90">Control tower</span>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={toggle}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-900/15 bg-white/70 text-slate-800 shadow-sm hover:border-emerald-700/25 hover:text-emerald-900 transition-all duration-200">
                    <LuMenu className="h-4 w-4" />
                </button>
            </div>

            {/* Mobile backdrop */}
            {isMobile && isOpen ? (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-20 bg-black/30 backdrop-blur-[2px] lg:hidden"
                />
            ) : null}

            {/* Sidebar */}
            <aside
                className={`fixed z-30 flex flex-col overflow-hidden border border-white/15 bg-linear-to-b from-[#16362c]/52 via-[#112b23]/48 to-[#0d221c]/52 text-white backdrop-blur-2xl shadow-[0_22px_60px_-32px_rgba(0,0,0,0.7)] transition-[width,transform,opacity,left,right,top,bottom] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform ${
                    isMobile
                        ? isOpen
                            ? "left-3 top-16 bottom-3 w-[min(20rem,calc(100vw-1.5rem))] translate-x-0 rounded-3xl opacity-100"
                            : "-translate-x-[110%] left-3 top-16 bottom-3 w-[min(20rem,calc(100vw-1.5rem))] rounded-3xl opacity-0 pointer-events-none"
                        : isOpen
                          ? "left-4 top-4 bottom-4 w-64 rounded-3xl"
                          : "left-4 top-4 bottom-4 w-16 rounded-3xl"
                }`}>
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_0%_0%,rgba(255,255,255,0.24),transparent_55%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_100%_0%,rgba(110,231,183,0.16),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/10 via-transparent to-black/20" />
                {/* Brand */}
                <div className="relative hidden md:flex items-center gap-3 px-4 pt-5 pb-4 border-b border-white/12">
                    <Image src="/GLLogo.png" alt="Green Ledger" width={50} height={50} className="h-7 w-7" />
                    {!compact && (
                        <div className="flex flex-col">
                            <span className="text-[0.68rem] font-semibold uppercase tracking-[0.3em] text-emerald-100/75">
                                GREEN LEDGER
                            </span>
                            <span className="text-sm font-medium tracking-tight text-white/90">Control tower</span>
                        </div>
                    )}
                </div>

                {/* Nav */}
                <nav
                    className={[
                        "relative flex-1 overflow-y-auto pt-4 pb-5 space-y-3 scrollbar-thin scrollbar-thumb-white/35 scrollbar-track-white/8",
                        compact ? "px-2" : "px-3",
                    ].join(" ")}>
                    <SidebarItem
                        label="Dashboard"
                        icon={<LuLeaf className="h-4 w-4" />}
                        compact={compact}
                        isActive={pathname === "/dashboard"}
                        onClick={() => {
                            setActiveSection("dashboard");
                            router.push("/dashboard");
                            if (isMobile) setOpen(false);
                        }}
                    />
                    {/* GHG group */}
                    <div className="space-y-1">
                        <button
                            type="button"
                            onClick={toggleGhg}
                            className={[
                                baseItemClasses,
                                compact ? "justify-center px-2" : "",
                                activeSection === "ghg-accounting" || activeSection === "scope-1" || activeSection === "scope-2"
                                    ? "bg-white/14 text-white border-emerald-200/25"
                                    : "text-emerald-50/80",
                            ].join(" ")}>
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
                                        if (isMobile) setOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium tracking-tight transition-all duration-200 ${
                                        activeSection === "scope-1" || scope1RouteActive
                                            ? "bg-white/20 text-white ring-1 ring-emerald-200/35"
                                            : "text-emerald-100/70 hover:bg-white/12 hover:text-white"
                                    }`}>
                                    <span className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 ring-1 ring-emerald-100/30" />
                                        <span>Scope-1 (direct emissions)</span>
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setActiveSection("scope-2");
                                        router.push("/scope-2");
                                        if (isMobile) setOpen(false);
                                    }}
                                    className={`flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs font-medium tracking-tight transition-all duration-200 ${
                                        activeSection === "scope-2" || scope2RouteActive
                                            ? "bg-white/20 text-white ring-1 ring-emerald-200/35"
                                            : "text-emerald-100/70 hover:bg-white/12 hover:text-white"
                                    }`}>
                                    <span className="flex items-center gap-2">
                                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-300 ring-1 ring-emerald-100/30" />
                                        <span>Scope-2 (indirect emissions)</span>
                                    </span>
                                </button>
                            </div>
                        )}
                    </div>

                    <SidebarItem
                        label={isLoggingOut ? "Logging out..." : "Logout"}
                        icon={<LuLogOut className="h-4 w-4" />}
                        compact={compact}
                        onClick={handleLogout}
                    />
                </nav>

                {/* Footer: user + collapse control (desktop) */}
                <div className="relative hidden lg:flex flex-col border-t border-white/12 px-3 pb-4 pt-3">
                    <div
                        className={[
                            "flex items-center gap-3 rounded-2xl border border-white/12 bg-white/8",
                            compact ? "justify-center px-2 py-2" : "px-3 py-2.5",
                        ].join(" ")}>
                        <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/12 text-emerald-50 ring-1 ring-white/12">
                            <LuUser className="h-4 w-4" />
                        </span>
                        {!compact ? (
                            <div className="min-w-0">
                                <div className="truncate text-sm font-semibold text-white/90">
                                    {userName ?? "User"}
                                </div>
                                <div className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-emerald-100/60">
                                    Signed in
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        {!compact ? (
                            <div className="flex flex-col text-[0.7rem] text-emerald-100/65 leading-tight">
                                <span className="font-semibold uppercase tracking-[0.18em] text-emerald-100/80">
                                    Assurance ready
                                </span>
                                <span className="text-emerald-100/65">Audit trails, evidence links, traits</span>
                            </div>
                        ) : (
                            <span />
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
                </div>
            </aside>
        </>
    );
}
