"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { AxiosError } from "axios";
import Image from "next/image";

import { logout } from "@/lib/auth/api";
import { clearAuthToken } from "@/lib/auth/token";
import { clearAuthUser, getAuthUser } from "@/lib/auth/user";
import { useSidebarStore } from "@/lib/sidebarStore";
import {
    LuChevronDown,
    LuChevronRight,
    LuFactory,
    LuLogOut,
    LuMenu,
    LuUser,
    LuLayoutDashboard,
    LuActivity,
    LuBuilding2,
    LuMapPin,
} from "react-icons/lu";

type SidebarItemProps = {
    label: string;
    icon: ReactNode;
    isActive?: boolean;
    onClick?: () => void;
    compact: boolean;
};

function SidebarItem({ label, icon, isActive, onClick, compact }: SidebarItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={[
                "group relative flex w-full items-center gap-3 rounded-2xl px-2 py-1 text-sm font-semibold transition-all duration-300",
                compact ? "justify-center px-2" : "",
                isActive
                    ? "bg-white/15 text-white shadow-lg ring-1 ring-white/10"
                    : "text-emerald-50/80 hover:bg-white/10 hover:text-white",
            ].join(" ")}>
            <span
                className={[
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300",
                    isActive ? "text-white" : "text-emerald-50/70 group-hover:text-white group-hover:bg-white/10",
                ].join(" ")}>
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
    const scope1DashboardRouteActive = pathname === "/scope-1";
    const scope1ReportRouteActive = pathname === "/scope-1/reports" || pathname.startsWith("/scope-1/reports/");
    const scope1IngestedRouteActive =
        pathname === "/scope-1/ingested-data" || pathname.startsWith("/scope-1/ingested-data/");
    const scope2DashboardRouteActive = pathname === "/scope-2";
    const scope2ReportRouteActive = pathname === "/scope-2/reports" || pathname.startsWith("/scope-2/reports/");
    const scope2IngestedRouteActive =
        pathname === "/scope-2/ingested-data" || pathname.startsWith("/scope-2/ingested-data/");
    const usersRouteActive = pathname === "/users";

    const scope1ButtonRef = useRef<HTMLButtonElement | null>(null);
    const scope2ButtonRef = useRef<HTMLButtonElement | null>(null);
    const closeHoverTimerScope1Ref = useRef<number | null>(null);
    const closeHoverTimerScope2Ref = useRef<number | null>(null);
    const [scope1FlyoutOpen, setScope1FlyoutOpen] = useState(false);
    const [scope1FlyoutPos, setScope1FlyoutPos] = useState<{ top: number; left: number } | null>(null);
    const [scope2FlyoutOpen, setScope2FlyoutOpen] = useState(false);
    const [scope2FlyoutPos, setScope2FlyoutPos] = useState<{ top: number; left: number } | null>(null);

    useEffect(() => {
        if (isMobile && !isOpen) {
            setScope1FlyoutOpen(false);
            setScope2FlyoutOpen(false);
        }
    }, [isMobile, isOpen]);

    function cancelScope1Close() {
        if (closeHoverTimerScope1Ref.current) {
            window.clearTimeout(closeHoverTimerScope1Ref.current);
            closeHoverTimerScope1Ref.current = null;
        }
    }

    function cancelScope2Close() {
        if (closeHoverTimerScope2Ref.current) {
            window.clearTimeout(closeHoverTimerScope2Ref.current);
            closeHoverTimerScope2Ref.current = null;
        }
    }

    function scheduleScope1Close() {
        cancelScope1Close();
        closeHoverTimerScope1Ref.current = window.setTimeout(() => {
            setScope1FlyoutOpen(false);
        }, 140);
    }

    function scheduleScope2Close() {
        cancelScope2Close();
        closeHoverTimerScope2Ref.current = window.setTimeout(() => {
            setScope2FlyoutOpen(false);
        }, 140);
    }

    function openScope1FlyoutFromButton() {
        const el = scope1ButtonRef.current;
        if (!el) return;
        cancelScope1Close();
        setScope2FlyoutOpen(false);
        cancelScope2Close();
        const rect = el.getBoundingClientRect();
        setScope1FlyoutPos({
            top: rect.top - 8,
            left: rect.right + 12,
        });
        setScope1FlyoutOpen(true);
    }

    function openScope2FlyoutFromButton() {
        const el = scope2ButtonRef.current;
        if (!el) return;
        cancelScope2Close();
        setScope1FlyoutOpen(false);
        cancelScope1Close();
        const rect = el.getBoundingClientRect();
        setScope2FlyoutPos({
            top: rect.top - 8,
            left: rect.right + 12,
        });
        setScope2FlyoutOpen(true);
    }

    useEffect(() => {
        return () => {
            cancelScope1Close();
            cancelScope2Close();
        };
    }, []);

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
            <div className="lg:hidden fixed top-0 inset-x-0 z-40 flex items-center justify-between px-4 py-3 bg-[#f6fff8]/80 border-b border-emerald-900/10 backdrop-blur-xl shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex items-center">
                        <Image src="/GLLogo.png" alt="Green Ledger" width={56} height={56} className="h-9 w-9" />
                    </div>
                </div>
                <button
                    type="button"
                    onClick={toggle}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-900/15 bg-white/70 text-slate-800 shadow-sm hover:border-emerald-700/25 hover:text-emerald-900 transition-all duration-200">
                    <LuMenu className="h-5 w-5" />
                </button>
            </div>

            {/* Mobile backdrop */}
            <AnimatePresence>
                {isMobile && isOpen ? (
                    <motion.button
                        type="button"
                        aria-label="Close sidebar"
                        onClick={() => setOpen(false)}
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                    />
                ) : null}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.aside
                className={`fixed z-50 flex min-h-0 flex-col overflow-hidden bg-linear-to-b from-[#16362c]/65 via-[#112b23]/60 to-[#0d221c]/65 text-white backdrop-blur-3xl shadow-[0_22px_60px_-32px_rgba(0,0,0,0.7)] ${
                    isMobile
                        ? "top-16 bottom-3 left-3 max-h-[calc(100dvh-4.75rem)] rounded-3xl"
                        : "inset-y-0 left-0 h-dvh max-h-dvh"
                }`}
                initial={false}
                animate={
                    isMobile
                        ? {
                              x: isOpen ? 0 : "-120%",
                              opacity: isOpen ? 1 : 0,
                              width: "min(20rem, calc(100vw - 1.5rem))",
                          }
                        : {
                              /* Match --sidebar-width-expanded / --sidebar-width-collapsed in globals.css */
                              width: isOpen ? 240 : 72,
                          }
                }
                transition={{
                    type: "tween",
                    duration: 0.3,
                    ease: [0.22, 1, 0.36, 1],
                }}>
                {/* Background lighting effects for dark theme */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_0%_0%,rgba(255,255,255,0.12),transparent_55%)]" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_60%_at_100%_0%,rgba(16,185,129,0.1),transparent_60%)]" />
                <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-white/5 via-transparent to-black/20 border-r border-white/10" />

                {/* Brand */}
                <div
                    className={`relative hidden shrink-0 lg:flex ${compact ? "items-center justify-center" : "items-center justify-start gap-3"} px-4 pt-5 pb-4 border-b border-white/10 overflow-hidden`}>
                    <Image
                        src="/GLLogo.png"
                        alt="Green Ledger"
                        width={64}
                        height={64}
                        className={
                            compact
                                ? "h-9 w-9 shrink-0 transition-transform duration-300"
                                : "h-10 w-10 shrink-0 transition-transform duration-300 hover:scale-105"
                        }
                        priority
                    />
                    <AnimatePresence>
                        {!compact && (
                            <motion.div
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -10 }}
                                transition={{ duration: 0.2 }}
                                className="min-w-0">
                                <div className="text-lg font-black tracking-tight text-white">GreenLedger</div>
                                <p className="mt-0.5 max-w-[11.5rem] text-[0.68rem] font-medium leading-snug text-emerald-100/65">
                                    Carbon accounting & disclosure, simplified.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Nav */}
                <nav
                    className={[
                        "relative flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overflow-x-hidden px-3 pb-3 pt-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",
                        !compact ? "lg:px-4" : "",
                    ].join(" ")}>
                    <SidebarItem
                        label="Dashboard"
                        icon={<LuLayoutDashboard className="h-[1.15rem] w-[1.15rem]" />}
                        compact={compact}
                        isActive={pathname === "/dashboard"}
                        onClick={() => {
                            setActiveSection("dashboard");
                            router.push("/dashboard");
                            if (isMobile) setOpen(false);
                        }}
                    />

                    {/* GHG group */}
                    <div className="flex flex-col gap-2">
                        <button
                            type="button"
                            onClick={() => {
                                setScope1FlyoutOpen(false);
                                setScope2FlyoutOpen(false);
                                toggleGhg();
                            }}
                            className={[
                                "group relative flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-300 text-emerald-50/80 hover:bg-white/10 hover:text-white",
                                compact ? "justify-center px-2" : "",
                            ].join(" ")}>
                            <div className="flex items-center gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 text-emerald-50/70 group-hover:text-white group-hover:bg-white/10">
                                    <LuFactory className="h-[1.15rem] w-[1.15rem]" />
                                </span>
                                {!compact && (
                                    <span className="flex-1 text-left tracking-tight whitespace-nowrap">
                                        GHG Accounting
                                    </span>
                                )}
                            </div>
                            {!compact &&
                                (ghgExpanded ? (
                                    <LuChevronDown className="h-4 w-4 text-emerald-100/50 transition-transform" />
                                ) : (
                                    <LuChevronRight className="h-4 w-4 text-emerald-100/50 transition-transform" />
                                ))}
                        </button>

                        {/* Sub-menu items */}
                        <AnimatePresence>
                            {ghgExpanded && !compact && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="relative ml-5 mt-0.5 flex flex-col gap-1.5 pl-4">
                                    <div className="pointer-events-none absolute left-[11px] top-0 h-full w-[2px] bg-gradient-to-b from-white/10 to-transparent rounded-full" />

                                    <button
                                        type="button"
                                        ref={scope1ButtonRef}
                                        onClick={() => {
                                            setScope2FlyoutOpen(false);
                                            setActiveSection("scope-1");
                                            if (isMobile) {
                                                openScope1FlyoutFromButton();
                                                return;
                                            }
                                            router.push("/scope-1");
                                        }}
                                        className={[
                                            "group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold tracking-tight transition-all duration-200",
                                            activeSection === "scope-1" || scope1RouteActive
                                                ? "bg-white/15 text-white shadow-sm ring-1 ring-white/10"
                                                : "text-emerald-100/60 hover:bg-white/10 hover:text-white",
                                        ].join(" ")}
                                        onMouseEnter={() => {
                                            if (isMobile) return;
                                            cancelScope1Close();
                                            openScope1FlyoutFromButton();
                                        }}
                                        onMouseLeave={() => {
                                            if (isMobile) return;
                                            scheduleScope1Close();
                                        }}>
                                        <div
                                            className={`absolute left-[-17px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border-2 bg-emerald-900 transition-colors ${activeSection === "scope-1" || scope1RouteActive ? "border-emerald-400" : "border-white/30 group-hover:border-emerald-400"}`}
                                        />
                                        <span className="whitespace-nowrap">Scope-1 (Direct)</span>
                                    </button>

                                    <button
                                        type="button"
                                        ref={scope2ButtonRef}
                                        onClick={() => {
                                            setScope1FlyoutOpen(false);
                                            cancelScope1Close();
                                            setActiveSection("scope-2");
                                            if (isMobile) {
                                                openScope2FlyoutFromButton();
                                                return;
                                            }
                                            router.push("/scope-2");
                                        }}
                                        className={[
                                            "group relative flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold tracking-tight transition-all duration-200",
                                            activeSection === "scope-2" || scope2RouteActive
                                                ? "bg-white/15 text-white shadow-sm ring-1 ring-white/10"
                                                : "text-emerald-100/60 hover:bg-white/10 hover:text-white",
                                        ].join(" ")}
                                        onMouseEnter={() => {
                                            if (isMobile) return;
                                            cancelScope2Close();
                                            openScope2FlyoutFromButton();
                                        }}
                                        onMouseLeave={() => {
                                            if (isMobile) return;
                                            scheduleScope2Close();
                                        }}>
                                        <div
                                            className={`absolute left-[-17px] top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full border-2 bg-emerald-900 transition-colors ${activeSection === "scope-2" || scope2RouteActive ? "border-emerald-400" : "border-white/30 group-hover:border-emerald-400"}`}
                                        />
                                        <span className="whitespace-nowrap">Scope-2 (Indirect)</span>
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </nav>

                <div className="relative z-10 flex shrink-0 flex-col border-t border-white/10 px-4">
                    <SidebarItem
                        label={isLoggingOut ? "Logging out..." : "Logout"}
                        icon={<LuLogOut className="h-[1.15rem] w-[1.15rem]" />}
                        compact={compact}
                        onClick={handleLogout}
                    />
                    <SidebarItem
                        label="Company"
                        icon={<LuBuilding2 className="h-[1.15rem] w-[1.15rem]" />}
                        isActive={pathname === "/company"}
                        compact={compact}
                        onClick={() => {
                            setActiveSection("company");
                            router.push("/company");
                            if (isMobile) setOpen(false);
                        }}
                    />
                    <SidebarItem
                        label="Team"
                        icon={<LuUser className="h-[1.15rem] w-[1.15rem]" />}
                        isActive={usersRouteActive}
                        compact={compact}
                        onClick={() => {
                            setActiveSection("users");
                            router.push("/users");
                            if (isMobile) setOpen(false);
                        }}
                    />
                    <SidebarItem
                        label="Facilities"
                        icon={<LuMapPin className="h-[1.15rem] w-[1.15rem]" />}
                        isActive={pathname === "/facility"}
                        compact={compact}
                        onClick={() => {
                            setActiveSection("facility");
                            router.push("/facility");
                            if (isMobile) setOpen(false);
                        }}
                    />
                </div>

                {/* Footer: user + collapse control */}
                <div className="relative z-10 hidden shrink-0 lg:flex flex-col border-t border-white/10 px-4 pb-5 pt-3 bg-black/10">
                    <div
                        className={[
                            "flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 shadow-sm backdrop-blur-md",
                            compact ? "justify-center px-2 py-2" : "px-3 py-3",
                        ].join(" ")}>
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-50 shadow-inner ring-1 ring-white/10">
                            <LuUser className="h-[1.15rem] w-[1.15rem]" />
                        </div>
                        {!compact ? (
                            <div className="min-w-0 flex-1">
                                <div className="truncate text-sm font-bold text-white/90">{userName ?? "User"}</div>
                                <div className="text-[0.65rem] font-bold uppercase tracking-widest text-emerald-400/80">
                                    Signed in
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                        {!compact ? (
                            <div className="flex flex-col">
                                <span className="text-[0.65rem] font-bold uppercase tracking-widest text-emerald-100/50">
                                    Status
                                </span>
                                <span className="text-xs font-semibold text-emerald-50/80">Assurance Ready</span>
                            </div>
                        ) : (
                            <span />
                        )}
                        <motion.button
                            type="button"
                            onClick={toggle}
                            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-emerald-100/70 shadow-sm ring-1 ring-white/15 hover:bg-white/20 hover:text-white hover:ring-white/30 transition-all duration-200"
                            whileTap={{ scale: 0.9 }}
                            aria-label={isOpen ? "Collapse sidebar" : "Expand sidebar"}>
                            <motion.div
                                initial={false}
                                animate={{ rotate: isOpen ? 180 : 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}>
                                <LuChevronRight className="h-4 w-4" />
                            </motion.div>
                        </motion.button>
                    </div>
                </div>
            </motion.aside>

            {/* Premium Flyout for Scope-1 */}
            <AnimatePresence>
                {scope1FlyoutOpen && scope1FlyoutPos ? (
                    <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={{ top: scope1FlyoutPos.top, left: scope1FlyoutPos.left, position: "fixed" }}
                        onMouseEnter={!isMobile ? cancelScope1Close : undefined}
                        onMouseLeave={!isMobile ? scheduleScope1Close : undefined}
                        className="z-50 w-[240px] overflow-hidden rounded-3xl bg-white/80 backdrop-blur-2xl ring-1 ring-white/60 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.1)] p-2">
                        <div className="px-3 py-2 mb-1">
                            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">
                                Scope-1 Analytics
                            </p>
                        </div>

                        <div className="space-y-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setScope2FlyoutOpen(false);
                                    setActiveSection("scope-1");
                                    router.push("/scope-1");
                                    setScope1FlyoutOpen(false);
                                    if (isMobile) setOpen(false);
                                }}
                                className={[
                                    "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                                    scope1DashboardRouteActive
                                        ? "bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-800 shadow-sm ring-1 ring-emerald-500/20"
                                        : "text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm ring-1 ring-transparent hover:ring-slate-200/50",
                                ].join(" ")}>
                                <LuLayoutDashboard
                                    className={`h-4 w-4 ${scope1DashboardRouteActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`}
                                />
                                Dashboard
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setScope2FlyoutOpen(false);
                                    setActiveSection("scope-1");
                                    router.push("/scope-1/reports");
                                    setScope1FlyoutOpen(false);
                                    if (isMobile) setOpen(false);
                                }}
                                className={[
                                    "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                                    scope1ReportRouteActive
                                        ? "bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-800 shadow-sm ring-1 ring-emerald-500/20"
                                        : "text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm ring-1 ring-transparent hover:ring-slate-200/50",
                                ].join(" ")}>
                                <LuActivity
                                    className={`h-4 w-4 ${scope1ReportRouteActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`}
                                />
                                Reports
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setScope2FlyoutOpen(false);
                                    setActiveSection("scope-1");
                                    router.push("/scope-1/ingested-data");
                                    setScope1FlyoutOpen(false);
                                    if (isMobile) setOpen(false);
                                }}
                                className={[
                                    "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                                    scope1IngestedRouteActive
                                        ? "bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-800 shadow-sm ring-1 ring-emerald-500/20"
                                        : "text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm ring-1 ring-transparent hover:ring-slate-200/50",
                                ].join(" ")}>
                                <LuFactory
                                    className={`h-4 w-4 ${scope1IngestedRouteActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`}
                                />
                                Ingested Data
                            </button>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>

            {/* Flyout for Scope-2 */}
            <AnimatePresence>
                {scope2FlyoutOpen && scope2FlyoutPos ? (
                    <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        style={{ top: scope2FlyoutPos.top, left: scope2FlyoutPos.left, position: "fixed" }}
                        onMouseEnter={!isMobile ? cancelScope2Close : undefined}
                        onMouseLeave={!isMobile ? scheduleScope2Close : undefined}
                        className="z-50 w-[240px] overflow-hidden rounded-3xl bg-white/80 p-2 shadow-[0_20px_45px_-10px_rgba(0,0,0,0.1)] ring-1 ring-white/60 backdrop-blur-2xl">
                        <div className="mb-1 px-3 py-2">
                            <p className="text-[0.65rem] font-bold uppercase tracking-widest text-slate-400">
                                Scope-2 Analytics
                            </p>
                        </div>
                        <div className="space-y-1">
                            <button
                                type="button"
                                onClick={() => {
                                    setScope1FlyoutOpen(false);
                                    setActiveSection("scope-2");
                                    router.push("/scope-2");
                                    setScope2FlyoutOpen(false);
                                    if (isMobile) setOpen(false);
                                }}
                                className={[
                                    "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                                    scope2DashboardRouteActive
                                        ? "bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-800 shadow-sm ring-1 ring-emerald-500/20"
                                        : "text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm ring-1 ring-transparent hover:ring-slate-200/50",
                                ].join(" ")}>
                                <LuLayoutDashboard
                                    className={`h-4 w-4 ${scope2DashboardRouteActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`}
                                />
                                Dashboard
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setScope1FlyoutOpen(false);
                                    setActiveSection("scope-2");
                                    router.push("/scope-2/reports");
                                    setScope2FlyoutOpen(false);
                                    if (isMobile) setOpen(false);
                                }}
                                className={[
                                    "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                                    scope2ReportRouteActive
                                        ? "bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-800 shadow-sm ring-1 ring-emerald-500/20"
                                        : "text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm ring-1 ring-transparent hover:ring-slate-200/50",
                                ].join(" ")}>
                                <LuActivity
                                    className={`h-4 w-4 ${scope2ReportRouteActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`}
                                />
                                Reports
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setScope1FlyoutOpen(false);
                                    setActiveSection("scope-2");
                                    router.push("/scope-2/ingested-data");
                                    setScope2FlyoutOpen(false);
                                    if (isMobile) setOpen(false);
                                }}
                                className={[
                                    "group flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition-all duration-200",
                                    scope2IngestedRouteActive
                                        ? "bg-gradient-to-r from-emerald-50 to-teal-50/50 text-emerald-800 shadow-sm ring-1 ring-emerald-500/20"
                                        : "text-slate-600 hover:bg-white hover:text-slate-900 shadow-sm ring-1 ring-transparent hover:ring-slate-200/50",
                                ].join(" ")}>
                                <LuFactory
                                    className={`h-4 w-4 ${scope2IngestedRouteActive ? "text-emerald-600" : "text-slate-400 group-hover:text-emerald-500"}`}
                                />
                                Ingested Data
                            </button>
                        </div>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </>
    );
}
