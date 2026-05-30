"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { USER_PROFILE } from "@/lib/dashboard/data";
import { cn } from "@/lib/utils/cn";
import { useSidebarStore } from "@/stores/sidebar-store";
import { BOTTOM_NAV, MAIN_NAV, SCOPE_NAV_CHILDREN } from "./sidebar-nav";

const SIDEBAR_EXPANDED = 256;
const SIDEBAR_COLLAPSED = 80;

export function Sidebar() {
    const collapsed = useSidebarStore((s) => s.collapsed);
    const toggle = useSidebarStore((s) => s.toggle);
    const [activitiesOpen, setActivitiesOpen] = useState(true);

    const beforeActivities = MAIN_NAV.filter((i) => i.label === "Dashboard" || i.label === "Facilities");
    const afterActivities = MAIN_NAV.filter(
        (i) => i.label === "Team Members" || i.label === "Tenant Profile" || i.label === "Audit Trails",
    );

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
                    <h1 className="text-headline-md font-bold tracking-tight text-primary">GreenLedger</h1>
                    <p className="font-mono text-label-md text-on-surface-variant opacity-70">GHG Accounting</p>
                </motion.div>

                <nav className="flex-1 space-y-1">
                    {beforeActivities.map((item) => (
                        <SidebarLink key={item.label} item={item} collapsed={collapsed} />
                    ))}

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => !collapsed && setActivitiesOpen((o) => !o)}
                            className="flex w-full items-center justify-between px-4 py-3 text-on-surface transition-colors duration-200">
                            <span className="flex items-center gap-3">
                                <MaterialIcon name="energy_savings_leaf" />
                                {!collapsed && <span className="font-mono text-label-md">Activities</span>}
                            </span>
                            {!collapsed && (
                                <MaterialIcon
                                    name={activitiesOpen ? "keyboard_arrow_down" : "keyboard_arrow_right"}
                                    size="sm"
                                    className="!text-[18px]"
                                />
                            )}
                        </button>

                        {activitiesOpen && !collapsed && (
                            <div className="relative ml-[1.625rem]">
                                <div className="nav-connector nav-connector-glow absolute bottom-4 left-0 top-0 w-[2px]" />
                                <div className="space-y-1 py-1">
                                    {SCOPE_NAV_CHILDREN.map((child) => (
                                        <Link
                                            key={child.label}
                                            href={child.href}
                                            className="relative flex items-center gap-3 py-2 pl-6 text-on-surface-variant transition-colors hover:text-on-surface">
                                            <div className="absolute left-0 top-1/2 h-[2px] w-4 -translate-y-1/2 bg-secondary opacity-40" />
                                            <span className="font-mono text-[11px]">{child.label}</span>
                                        </Link>
                                    ))}
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
                    <Link
                        href="/login"
                        className={cn(
                            "mb-4 flex items-center gap-3 px-4 py-2 text-error transition-colors duration-200 hover:bg-error-container/20",
                            collapsed && "justify-center px-2",
                        )}>
                        <MaterialIcon name="logout" />
                        {!collapsed && <span className="font-mono text-label-md">Logout</span>}
                    </Link>

                    {!collapsed && (
                        <div className="mx-1 flex items-center gap-3 rounded-xl bg-surface-container p-3">
                            <Image
                                src={USER_PROFILE.avatar}
                                alt={USER_PROFILE.name}
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full border border-outline-variant object-cover"
                            />
                            <div className="min-w-0 overflow-hidden">
                                <p className="truncate font-mono text-label-md font-semibold text-primary">
                                    {USER_PROFILE.name}
                                </p>
                                <p className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant">
                                    {USER_PROFILE.role}
                                </p>
                            </div>
                        </div>
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
    const isActive = item.active;

    return (
        <Link
            href={item.href}
            title={collapsed ? item.label : undefined}
            className={cn(
                "flex items-center gap-3 px-4 transition-[transform,colors] duration-150 active:scale-[0.98]",
                compact ? "py-2" : "py-3",
                collapsed && "justify-center px-2",
                isActive
                    ? "rounded-lg bg-secondary-container font-semibold text-on-secondary-container"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            )}>
            <MaterialIcon name={item.icon} className="shrink-0" />
            {!collapsed && <span className="font-mono text-label-md">{item.label}</span>}
        </Link>
    );
}
