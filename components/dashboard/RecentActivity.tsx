"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { ActivityItem } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils/cn";

type RecentActivityProps = {
    items: ActivityItem[];
    className?: string;
};

const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
};

export function RecentActivity({ items, className }: RecentActivityProps) {
    return (
        <div
            className={cn(
                "flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest",
                className,
            )}>
            <div className="flex items-center justify-between border-b border-outline-variant px-card-padding py-4">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="history" size="lg" className="text-primary" />
                    <h3 className="text-headline-sm font-semibold text-primary">Recent Activities</h3>
                </div>
            </div>

            <div className="gl-dashboard-scroll relative min-h-0 flex-1 overflow-y-auto p-card-padding">
                <div className="timeline-connector absolute bottom-8 left-9 top-8 w-px" aria-hidden />
                <motion.div className="relative space-y-4 py-1" variants={listVariants} initial="hidden" animate="show">
                    {items.map((item) => (
                        <motion.div key={item.id} variants={itemVariants} className="flex items-start gap-3.5">
                            <div
                                className={cn(
                                    "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-surface-container-lowest shadow-sm",
                                    item.iconBgClassName,
                                )}>
                                <MaterialIcon
                                    name={item.icon}
                                    size="sm"
                                    className={cn("font-bold", item.iconColorClassName)}
                                />
                            </div>
                            <div className="pt-1 min-w-0 flex-1 mb-2">
                                <p className="font-mono text-[12px] font-medium text-on-surface truncate">{item.title}</p>
                                <p className="font-mono text-[10px] text-on-surface-variant truncate">{item.subtitle}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
