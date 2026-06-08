"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useMemo, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { DashboardTab } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils/cn";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type TenantShellProps = {
    children: ReactNode;
};

const tabPathMap: Record<DashboardTab, string> = {
    emissions: "/dashboard",
    energy: "/energy-dashboard",
};

export function TenantShell({ children }: TenantShellProps) {
    const collapsed = useSidebarStore((s) => s.collapsed);
    const pathname = usePathname();
    const router = useRouter();
    const mainMargin = collapsed ? "5rem" : "16rem";
    const mainPaddingTop = "6rem";

    const activeTab = useMemo<DashboardTab>(() => {
        return pathname === "/energy-dashboard" ? "energy" : "emissions";
    }, [pathname]);

    const searchPlaceholder = pathname === "/energy-dashboard" ? "Search energy data..." : "Search emissions data...";

    const handleTabChange = (tab: DashboardTab) => {
        if (pathname !== tabPathMap[tab]) {
            router.push(tabPathMap[tab]);
        }
    };

    return (
        <div className="gl-dashboard min-h-screen">
            <Sidebar />
            <TopBar activeTab={activeTab} onTabChange={handleTabChange} searchPlaceholder={searchPlaceholder} />

            <motion.main
                animate={{ marginLeft: mainMargin }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ paddingTop: mainPaddingTop }}
                className={cn("min-h-screen px-gutter pb-12 transition-[margin-left] duration-300")}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={pathname}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.2 }}>
                        {children}
                    </motion.div>
                </AnimatePresence>
            </motion.main>
        </div>
    );
}
