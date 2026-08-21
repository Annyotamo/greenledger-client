"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import type { TopKpiCardData } from "@/lib/dashboard/types";

type TopKpiCardsRowProps = {
    cards: TopKpiCardData[];
};

const cardVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.2 } },
};

const SCOPE_BAR_COLORS: Record<string, string> = {
    total_emissions: "bg-primary",
    scope_1: "bg-orange-500",
    scope_2: "bg-blue-500",
    scope_3: "bg-emerald-500",
    biogenic_emissions: "bg-purple-500",
    emissions_intensity: "bg-sky-500",
};

export function TopKpiCardsRow({ cards }: TopKpiCardsRowProps) {
    if (!cards || cards.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {cards.map((card) => {
                const isIntensity = card.id === "emissions_intensity";
                const isDown = card.changeDirection === "down";

                return (
                    <motion.div key={card.id} variants={cardVariants}>
                        <div className="bg-white p-4 rounded-lg border border-outline-variant hover:border-primary transition-all duration-200 cursor-default flex flex-col justify-between h-full shadow-2xs">
                            {/* Card Top Row: Icon + Label on Left, Badge on Right */}
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div className="flex items-center gap-1.5 min-w-0">
                                    <MaterialIcon name={card.icon} size="sm" className="text-on-surface-variant text-[16px] shrink-0" />
                                    <span className="text-on-surface-variant font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-tight truncate">
                                        {card.label}
                                    </span>
                                </div>
                                {card.changePct !== undefined && !isIntensity && (
                                    <span
                                        className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
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
                                    <span className="text-[22px] xl:text-[24px] text-primary font-extrabold tracking-tight">
                                        {card.value}
                                    </span>
                                    <span className="text-on-surface-variant font-mono text-[10px] font-medium">
                                        {isIntensity ? "tCO2e/t" : card.unit}
                                    </span>
                                </div>

                                {isIntensity && card.secondaryValue && (
                                    <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant pt-0.5">
                                        <span>Revenue Int:</span>
                                        <span className="font-bold text-primary">{card.secondaryValue} tCO2e/M₹</span>
                                    </div>
                                )}

                                {!isIntensity && card.subtitle && (
                                    <div className="text-[10px] font-mono text-on-surface-variant">
                                        {card.subtitle}
                                    </div>
                                )}
                            </div>

                            {/* Bottom Micro Progress / Accent Bar */}
                            <div className="mt-3 w-full bg-surface-container h-1 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${SCOPE_BAR_COLORS[card.id] || "bg-primary"}`}
                                    style={{
                                        width: isIntensity
                                            ? `${Math.min(100, Math.max(15, (card.numericValue || 0) * 100))}%`
                                            : card.id === "total_emissions"
                                            ? "100%"
                                            : `${Math.min(100, Math.max(10, parseFloat(card.subtitle || "0")))}%`,
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
