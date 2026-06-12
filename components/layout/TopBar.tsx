"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Input } from "@/components/ui/input";
import { DASHBOARD_TABS } from "@/lib/dashboard/data";
import type { DashboardTab } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils/cn";
import { useSidebarStore } from "@/stores/sidebar-store";

type TopBarProps = {
    activeTab: DashboardTab;
    onTabChange: (tab: DashboardTab) => void;
    searchPlaceholder?: string;
};

export function TopBar({ activeTab, onTabChange, searchPlaceholder }: TopBarProps) {
    const collapsed = useSidebarStore((s) => s.collapsed);
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    const headerPadding = collapsed ? "6rem" : "17rem";

    return (
        <header
            style={{ paddingLeft: headerPadding }}
            className="fixed top-0 z-40 flex h-16 w-full items-center justify-between border-b border-outline-variant bg-surface pr-gutter transition-[padding-left] duration-300">
            <div className="flex w-full max-w-5xl items-center gap-8">
                <div className="flex rounded-xl border border-outline-variant/30 bg-surface-container-low p-1">
                    {DASHBOARD_TABS.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onTabChange(tab.id)}
                            className={cn(
                                "rounded-xl px-4 py-1.5 text-xs font-mono text-label-md transition-all",
                                activeTab === tab.id
                                    ? "bg-white text-primary shadow-sm font-medium"
                                    : "text-on-surface-variant hover:text-on-surface",
                            )}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="relative flex-1">
                    <MaterialIcon
                        name="search"
                        size="sm"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-sm! text-on-surface-variant"
                    />
                    <Input
                        placeholder={searchPlaceholder ?? "Search emissions data..."}
                        className="h-auto lg:h-[35px] bg-gray-50"
                    />
                </div>
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
                    {/* <button
                        type="button"
                        className="rounded-full p-2 pb-0 transition-colors hover:bg-surface-container-high"
                        aria-label="Toggle theme"
                        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}>
                        <MaterialIcon
                            name={mounted && resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
                            className="text-on-surface-variant"
                        />
                    </button> */}
                </div>
            </div>
        </header>
    );
}
