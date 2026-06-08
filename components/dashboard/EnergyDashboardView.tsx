"use client";

import { motion } from "framer-motion";
import { AiAssistantFAB } from "./AiAssistantFAB";
import { MetricCard } from "./MetricCard";
import {
    ENERGY_METRIC_CARDS,
    ENERGY_TREND,
    ENERGY_MIX_SEGMENTS,
    ENERGY_HIERARCHY,
    ENERGY_SOURCE_TREE,
    ENERGY_GENERATION_SOURCES,
    ENERGY_BOILER_FUEL,
} from "@/lib/dashboard/data";
import { EnergyHeader } from "./EnergyHeader";
import { EnergyTrendChart } from "./EnergyTrendChart";
import { EnergyMixDonut } from "./EnergyMixDonut";
import { EnergyHierarchyChart } from "./EnergyHierarchyChart";
import { EnergySourceTree } from "./EnergySourceTree";
import { CaptiveGenerationChart } from "./CaptiveGenerationChart";
import { BoilerFuelMix } from "./BoilerFuelMix";

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};

const gridItemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
};

export function EnergyDashboardView() {
    return (
        <div className="relative mx-auto max-w-350 space-y-6">
            <EnergyHeader />

            <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                variants={gridVariants}
                initial="hidden"
                animate="show">
                {ENERGY_METRIC_CARDS.map((card) => (
                    <motion.div key={card.id} variants={gridItemVariants} className="h-full">
                        <MetricCard data={card} />
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-12 items-stretch gap-6">
                <div className="col-span-12 lg:col-span-8">
                    <EnergyTrendChart data={ENERGY_TREND} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <EnergyMixDonut segments={ENERGY_MIX_SEGMENTS} />
                </div>

                <div className="col-span-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <EnergyHierarchyChart items={ENERGY_HIERARCHY} />
                    <EnergySourceTree nodes={ENERGY_SOURCE_TREE} />
                </div>

                <div className="col-span-12 grid grid-cols-1 gap-6 xl:grid-cols-[7fr_5fr]">
                    <CaptiveGenerationChart items={ENERGY_GENERATION_SOURCES} />
                    <BoilerFuelMix items={ENERGY_BOILER_FUEL} />
                </div>
            </div>

            <AiAssistantFAB />
        </div>
    );
}
