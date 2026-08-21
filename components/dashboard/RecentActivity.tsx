"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { ActivityItem } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils/cn";

type RecentActivityProps = {
    items: ActivityItem[];
    maxItems?: number;
    className?: string;
};

const listVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 6 },
    show: { opacity: 1, y: 0 },
};

export function RecentActivity({ items, maxItems, className }: RecentActivityProps) {
    const displayItems = maxItems ? items.slice(0, maxItems) : items;

    return (
        <div
            className={cn(
                "flex h-full min-h-0 flex-col overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest shadow-2xs",
                className
            )}>
            {/* Card Header Strip */}
            <div className="flex items-center justify-between border-b border-outline-variant px-card-padding py-4 bg-surface-container-lowest">
                <div className="flex items-center gap-2.5">
                    <MaterialIcon name="history" size="sm" className="text-primary text-[20px]" />
                    <div>
                        <h3 className="font-headline-sm text-headline-sm font-bold text-primary uppercase tracking-tight">
                            Recent Activities
                        </h3>
                        <p className="font-mono text-[10px] uppercase tracking-tight text-on-surface-variant">
                            Live audit & data entry log
                        </p>
                    </div>
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider bg-surface-container-high text-primary px-2.5 py-1 rounded">
                    {displayItems.length} Logs
                </span>
            </div>

            {/* Content Area - Dynamically sized to fill height */}
            <div className="relative flex-1 min-h-0 flex flex-col justify-between overflow-hidden p-card-padding">
                <div className="timeline-connector absolute bottom-6 left-9 top-6 w-px" aria-hidden />
                <motion.div className="relative space-y-3.5 my-auto" variants={listVariants} initial="hidden" animate="show">
                    {displayItems.map((item) => (
                        <motion.div key={item.id} variants={itemVariants} className="flex items-center gap-3.5">
                            <div
                                className={cn(
                                    "z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-surface-container-lowest shadow-2xs",
                                    item.iconBgClassName
                                )}>
                                <MaterialIcon
                                    name={item.icon}
                                    size="sm"
                                    className={cn("font-bold text-[14px]", item.iconColorClassName)}
                                />
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="font-mono text-[12px] font-bold text-on-surface truncate">{item.title}</p>
                                <p className="font-mono text-[10px] text-on-surface-variant truncate">{item.subtitle}</p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
