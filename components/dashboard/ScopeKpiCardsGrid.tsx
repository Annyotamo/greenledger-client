"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { TopKpiCardData } from "@/lib/dashboard/types";

type ScopeKpiCardsGridProps = {
    scopeCards: TopKpiCardData[];
};

const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const SCOPE_BAR_COLORS: Record<string, string> = {
    scope_1: "bg-orange-500",
    scope_2: "bg-blue-500",
    scope_3: "bg-emerald-500",
    biogenic_emissions: "bg-purple-500",
};

export function ScopeKpiCardsGrid({ scopeCards }: ScopeKpiCardsGridProps) {
    if (!scopeCards || scopeCards.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {scopeCards.map((card) => {
                const isDown = card.changeDirection === "down";

                return (
                    <motion.div key={card.id} variants={cardVariants}>
                        <div className="bg-white p-4 sm:p-5 rounded-xl border border-outline-variant hover:border-primary transition-all duration-200 cursor-default flex flex-col justify-between h-full shadow-2xs">
                            {/* Card Top Row: Icon + Label on Left, Badge on Right */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                                <div className="flex items-center gap-2 min-w-0">
                                    <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${card.iconBgClassName}`}>
                                        <MaterialIcon name={card.icon} size="sm" className="text-[16px]" />
                                    </div>
                                    <span className="text-on-surface-variant font-mono text-xs font-bold uppercase tracking-tight truncate">
                                        {card.label}
                                    </span>
                                </div>

                                {card.changePct !== undefined && (
                                    <span
                                        className={`font-mono text-xs font-bold px-2 py-0.5 rounded shrink-0 ${
                                            isDown
                                                ? "bg-secondary-container/40 text-on-secondary-container"
                                                : "bg-error-container/40 text-on-error-container"
                                        }`}>
                                        {card.changePct >= 0 ? "+" : ""}
                                        {card.changePct.toFixed(1)}%
                                    </span>
                                )}
                            </div>

                            {/* Middle Metric Value */}
                            <div className="space-y-1 my-1">
                                <div className="flex items-baseline gap-1.5 font-mono">
                                    <span className="text-2xl lg:text-[26px] text-primary font-extrabold tracking-tight">
                                        {card.value}
                                    </span>
                                    <span className="text-on-surface-variant font-mono text-xs font-medium">
                                        {card.unit}
                                    </span>
                                </div>

                                {card.subtitle && (
                                    <div className="text-xs font-mono text-on-surface-variant font-medium">
                                        {card.subtitle}
                                    </div>
                                )}
                            </div>

                            {/* Bottom Micro Accent Bar */}
                            <div className="mt-3 w-full bg-surface-container h-1 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${SCOPE_BAR_COLORS[card.id] || "bg-primary"}`}
                                    style={{
                                        width: `${Math.min(100, Math.max(10, parseFloat(card.subtitle || "0")))}%`,
                                    }}
                                />
                            </div>
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}
