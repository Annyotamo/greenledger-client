"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import type { DashboardTab } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils/cn";
import { useSidebarStore } from "@/stores/sidebar-store";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

type TenantShellProps = {
    children: ReactNode;
};

export function TenantShell({ children }: TenantShellProps) {
    const collapsed = useSidebarStore((s) => s.collapsed);
    const [activeTab, setActiveTab] = useState<DashboardTab>("dashboard");
    const mainMargin = collapsed ? "5rem" : "16rem";
    const mainPaddingTop = "6rem";

    return (
        <div className="gl-dashboard min-h-screen">
            <Sidebar />
            <TopBar activeTab={activeTab} onTabChange={setActiveTab} />

            <motion.main
                animate={{ marginLeft: mainMargin }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                style={{ paddingTop: mainPaddingTop }}
                className={cn("min-h-screen px-gutter pb-12 transition-[margin-left] duration-300")}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
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
