"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { logoutUser } from "@/lib/auth/api";
import { clearAuthToken } from "@/lib/auth/token";
import { getCurrentUser, UserProfile } from "@/lib/user/api";
import { cn } from "@/lib/utils/cn";
import { useSidebarStore } from "@/stores/sidebar-store";
import { BOTTOM_NAV, MAIN_NAV, SCOPE_NAV_CHILDREN, BRSR_NAV_CHILDREN } from "./sidebar-nav";

const SIDEBAR_EXPANDED = 256;
const SIDEBAR_COLLAPSED = 80;

function isRouteActive(pathname: string | null, href: string) {
    if (!pathname || !href || href === "#") return false;
    if (pathname === href) return true;
    return pathname.startsWith(href.endsWith("/") ? href : `${href}/`);
}

export function Sidebar() {
    const collapsed = useSidebarStore((s) => s.collapsed);
    const toggle = useSidebarStore((s) => s.toggle);
    const pathname = usePathname();

    const isActivitiesActive = Boolean(
        pathname && (pathname === "/activities" || pathname.startsWith("/activities/")),
    );
    const isBrsrActive = Boolean(
        pathname && (pathname === "/brsr" || pathname.startsWith("/brsr/")),
    );

    const [activitiesOpen, setActivitiesOpen] = useState(isActivitiesActive);
    const [brsrOpen, setBrsrOpen] = useState(isBrsrActive);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    useEffect(() => {
        if (isActivitiesActive) {
            setActivitiesOpen(true);
        }
        if (isBrsrActive) {
            setBrsrOpen(true);
        }
    }, [isActivitiesActive, isBrsrActive]);

    const handleLogout = async () => {
        if (isLoggingOut) return;
        setIsLoggingOut(true);
        try {
            await logoutUser();
        } catch {
            clearAuthToken();
            if (typeof window !== "undefined") {
                window.location.replace("/login");
            }
        }
    };

    const beforeActivities = MAIN_NAV.filter(
        (i) => i.label === "Dashboard" || i.label === "Facilities" || i.label === "EU CBAM",
    );
    const valueChainItem = MAIN_NAV.find((i) => i.label === "Value Chain");
    const afterActivities = MAIN_NAV.filter(
        (i) => i.label === "Reporting Periods" || i.label === "Team Members" || i.label === "Tenant Profile",
    );

    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const profile = await getCurrentUser();
                if (mounted) setUser(profile);
            } catch (error) {
                // intentionally silent; sidebar still renders
            }
        })();
        return () => {
            mounted = false;
        };
    }, []);

    return (
        <motion.aside
            animate={{ width: collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed left-0 top-0 z-50 flex h-screen flex-col border-r border-outline-variant bg-surface-container-lowest">
            <Button
                type="button"
                variant="secondary"
                size="icon"
                onClick={toggle}
                className="absolute -right-3 top-20 z-50 h-6 w-6 rounded-full border border-outline-variant bg-surface-container-lowest p-0 shadow-sm hover:bg-surface-container-high"
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
                <MaterialIcon name={collapsed ? "chevron_right" : "chevron_left"} size="sm" />
            </Button>

            <div className="gl-dashboard-scroll flex h-full flex-col overflow-y-auto px-3 py-4">
                <motion.div
                    animate={{ opacity: collapsed ? 0 : 1 }}
                    className={cn("mb-4 px-4 py-6", collapsed && "pointer-events-none")}>
                    <h1 className="text-lg font-bold tracking-tight text-primary font-display">GreenLedger</h1>
                    <p className="font-sans text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant/70">GHG Accounting</p>
                </motion.div>

                <nav className="flex-1 space-y-1">
                    {beforeActivities.map((item) => (
                        <SidebarLink key={item.label} item={item} collapsed={collapsed} />
                    ))}

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                if (collapsed) {
                                    toggle();
                                    setActivitiesOpen(true);
                                } else {
                                    setActivitiesOpen((o) => !o);
                                }
                            }}
                            title={collapsed ? "Activities" : undefined}
                            className={cn(
                                "flex w-full items-center justify-between px-4 py-2.5 transition-[transform,colors] duration-150 active:scale-[0.98] rounded-lg cursor-pointer",
                                collapsed && "justify-center px-2",
                                isActivitiesActive
                                    ? "bg-secondary-container font-semibold text-on-secondary-container"
                                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                            )}>
                            <span className="flex items-center gap-3">
                                <MaterialIcon name="energy_savings_leaf" className="shrink-0" />
                                {!collapsed && <span className="font-sans text-[13px] font-medium">Activities</span>}
                            </span>
                            {!collapsed && (
                                <MaterialIcon
                                    name={activitiesOpen ? "keyboard_arrow_down" : "keyboard_arrow_right"}
                                    size="sm"
                                    className="!text-[18px] shrink-0"
                                />
                            )}
                        </button>

                        {activitiesOpen && !collapsed && (
                            <div className="relative ml-[1.625rem]">
                                <div className="nav-connector nav-connector-glow absolute bottom-4 left-0 top-0 w-[2px]" />
                                <div className="space-y-1 py-1">
                                    {SCOPE_NAV_CHILDREN.map((child) => {
                                        const childActive = isRouteActive(pathname, child.href);
                                        return (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                className={cn(
                                                    "relative flex items-center gap-3 py-1.5 pl-6 transition-colors rounded-md text-xs font-sans",
                                                    childActive
                                                        ? "text-primary font-medium bg-emerald-600/[0.07]"
                                                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low",
                                                )}>
                                                <div
                                                    className={cn(
                                                        "absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 transition-colors",
                                                        childActive ? "bg-emerald-700/70" : "bg-secondary opacity-40",
                                                    )}
                                                />
                                                <span>{child.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {valueChainItem && (
                        <SidebarLink key={valueChainItem.label} item={valueChainItem} collapsed={collapsed} />
                    )}

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                if (collapsed) {
                                    toggle();
                                    setBrsrOpen(true);
                                } else {
                                    setBrsrOpen((o) => !o);
                                }
                            }}
                            title={collapsed ? "BRSR" : undefined}
                            className={cn(
                                "flex w-full items-center justify-between px-4 py-2.5 transition-[transform,colors] duration-150 active:scale-[0.98] rounded-lg cursor-pointer",
                                collapsed && "justify-center px-2",
                                isBrsrActive
                                    ? "bg-secondary-container font-semibold text-on-secondary-container"
                                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                            )}>
                            <span className="flex items-center gap-3">
                                <MaterialIcon name="analytics" className="shrink-0" />
                                {!collapsed && <span className="font-sans text-[13px] font-medium">BRSR</span>}
                            </span>
                            {!collapsed && (
                                <MaterialIcon
                                    name={brsrOpen ? "keyboard_arrow_down" : "keyboard_arrow_right"}
                                    size="sm"
                                    className="!text-[18px] shrink-0"
                                />
                            )}
                        </button>

                        {brsrOpen && !collapsed && (
                            <div className="relative ml-[1.625rem]">
                                <div className="nav-connector nav-connector-glow absolute bottom-4 left-0 top-0 w-[2px]" />
                                <div className="space-y-1 py-1">
                                    {BRSR_NAV_CHILDREN.map((child) => {
                                        const childActive = isRouteActive(pathname, child.href);
                                        return (
                                            <Link
                                                key={child.label}
                                                href={child.href}
                                                className={cn(
                                                    "relative flex items-center gap-3 py-1.5 pl-6 transition-colors rounded-md text-xs font-sans",
                                                    childActive
                                                        ? "text-primary font-medium bg-emerald-600/[0.07]"
                                                        : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low",
                                                )}>
                                                <div
                                                    className={cn(
                                                        "absolute left-0 top-1/2 h-[1.5px] w-4 -translate-y-1/2 transition-colors",
                                                        childActive ? "bg-emerald-700/70" : "bg-secondary opacity-40",
                                                    )}
                                                />
                                                <span>{child.label}</span>
                                            </Link>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {afterActivities.map((item) => (
                        <SidebarLink key={item.label} item={item} collapsed={collapsed} />
                    ))}
                </nav>

                <div className="mt-auto border-t border-outline-variant pt-4">
                    {BOTTOM_NAV.map((item) => (
                        <SidebarLink key={item.label} item={item} collapsed={collapsed} compact />
                    ))}
                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        title={collapsed ? "Logout" : undefined}
                        className={cn(
                            "mb-4 flex w-full items-center gap-3 px-4 py-2 text-error transition-colors duration-200 hover:bg-error-container/20 rounded-lg text-left cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed",
                            collapsed && "justify-center px-2",
                        )}
                        aria-label="Logout">
                        <MaterialIcon name="logout" className="shrink-0" />
                        {!collapsed && (
                            <span className="font-sans text-[13px] font-medium">
                                {isLoggingOut ? "Logging out..." : "Logout"}
                            </span>
                        )}
                    </button>

                    {!collapsed && (
                        <Link href="/user" className="mx-1 block">
                            <div className={cn(
                                "flex items-center gap-3 rounded-xl bg-surface-container p-3 transition-colors hover:shadow-sm",
                                isRouteActive(pathname, "/user") && "ring-1 ring-primary/40 bg-surface-container-high",
                            )}>
                                {/** client fetch will populate `user` state; render placeholder until loaded */}
                                {user?.avatar ? (
                                    <Image
                                        src={user.avatar}
                                        alt={user.full_name || `${user.first_name} ${user.last_name}`}
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 rounded-full border border-outline-variant object-cover"
                                    />
                                ) : (
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-on-secondary font-semibold font-sans">
                                        {user
                                            ? `${(user.first_name || "").charAt(0)}${(user.last_name || "").charAt(0)}`
                                            : "U"}
                                    </div>
                                )}

                                <div className="min-w-0 overflow-hidden">
                                    <p className="truncate font-sans text-sm font-semibold text-primary">
                                        {(user?.full_name ?? user?.first_name)
                                            ? `${user.first_name} ${user.last_name}`
                                            : "User"}
                                    </p>
                                    <p className="font-sans text-[11px] font-medium text-on-surface-variant truncate">
                                        {user?.job_title ?? user?.role ?? ""}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    )}
                </div>
            </div>
        </motion.aside>
    );
}

function SidebarLink({
    item,
    collapsed,
    compact = false,
}: {
    item: { label: string; icon: string; href: string; active?: boolean };
    collapsed: boolean;
    compact?: boolean;
}) {
    const pathname = usePathname();
    const isActive = !!item.active || isRouteActive(pathname, item.href);

    return (
        <Link
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
                "flex items-center gap-3 px-4 transition-[transform,colors] duration-150 active:scale-[0.98] rounded-lg",
                compact ? "py-2" : "py-2.5",
                collapsed && "justify-center px-2",
                isActive
                    ? "bg-secondary-container font-semibold text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            )}>
            <MaterialIcon name={item.icon} className="shrink-0" />
            {!collapsed && <span className="font-sans text-[13px] font-medium tracking-[-0.005em]">{item.label}</span>}
        </Link>
    );
}
