"use client";

import { usePathname } from "next/navigation";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { DASHBOARD_TABS } from "@/lib/dashboard/data";
import type { DashboardTab } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils/cn";
import { useSidebarStore } from "@/stores/sidebar-store";

type TopBarProps = {
    activeTab: DashboardTab;
    onTabChange: (tab: DashboardTab) => void;
    searchPlaceholder?: string;
};

export function TopBar({ activeTab, onTabChange }: TopBarProps) {
    const collapsed = useSidebarStore((s) => s.collapsed);
    const pathname = usePathname();

    const headerPadding = collapsed ? "6rem" : "17rem";
    const isDashboardRoute = pathname === "/dashboard" || pathname === "/energy-dashboard";

    return (
        <header
            style={{ paddingLeft: headerPadding }}
            className="fixed top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface pr-gutter transition-[padding-left] duration-300">
            <div className="flex w-full max-w-5xl items-center gap-8">
                {isDashboardRoute ? (
                    <div className="flex rounded-lg border border-outline-variant/50 bg-surface-container-low p-1">
                        {DASHBOARD_TABS.map((tab) => (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => onTabChange(tab.id)}
                                className={cn(
                                    "rounded-md px-3.5 py-1 text-xs font-sans font-medium transition-all select-none cursor-pointer",
                                    activeTab === tab.id
                                        ? "bg-white text-primary shadow-2xs font-semibold"
                                        : "text-on-surface-variant hover:text-on-surface",
                                )}>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-2 font-sans text-xs font-medium text-primary">
                        <span className="text-secondary font-semibold uppercase tracking-wider text-[11px]">GreenLedger ESG</span>
                        <span className="text-on-surface-variant/60">/</span>
                        <span className="capitalize text-on-surface font-semibold">{pathname?.replace(/^\//, "").replace(/-/g, " ") || "Dashboard"}</span>
                    </div>
                )}
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                    <button
                        type="button"
                        className="relative rounded-full p-2 pb-0 transition-colors hover:bg-surface-container-high"
                        aria-label="Notifications">
                        <MaterialIcon name="notifications" className="text-on-surface-variant" />
                        <span className="fab-pulse absolute right-2.5 top-2.5 h-1.5 w-1.5 rounded-full bg-error" />
                    </button>
                    <button
                        type="button"
                        className="rounded-full p-2 pb-0 transition-colors hover:bg-surface-container-high"
                        aria-label="Help">
                        <MaterialIcon name="help_outline" className="text-on-surface-variant" />
                    </button>
                </div>
            </div>
        </header>
    );
}
