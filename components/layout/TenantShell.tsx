"use client";

import { motion } from "framer-motion";
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

    const activeTab = useMemo<DashboardTab>(() => {
        return pathname === "/energy-dashboard" ? "energy" : "emissions";
    }, [pathname]);

    const mainMargin = collapsed ? "5rem" : "16rem";
    const mainPaddingTop = "6rem";

    if (pathname === "/initializing") {
        return (
            <div className="h-screen w-screen overflow-hidden">
                {children}
            </div>
        );
    }

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

            <main
                style={{ marginLeft: mainMargin, paddingTop: mainPaddingTop }}
                className={cn("min-h-screen px-gutter pb-12 transition-[margin-left] duration-300")}>
                <motion.div
                    key={pathname}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}>
                    {children}
                </motion.div>
            </main>
        </div>
    );
}
