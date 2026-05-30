"use client";

import { motion } from "framer-motion";
import {
    EMISSIONS_TREND,
    FACILITY_ROWS,
    METRIC_CARDS,
    RECENT_ACTIVITIES,
    SCOPE1_FUELS,
    SCOPE2_SEGMENTS,
    SCOPE_COMPARISON,
} from "@/lib/dashboard/data";
import { AiAssistantFAB } from "./AiAssistantFAB";
import { DashboardHeader } from "./DashboardHeader";
import { EmissionsTrendChart } from "./EmissionsTrendChart";
import { FacilityTable } from "./FacilityTable";
import { MetricCard } from "./MetricCard";
import { RecentActivity } from "./RecentActivity";
import { Scope1Breakdown } from "./Scope1Breakdown";
import { Scope2Donut } from "./Scope2Donut";
import { ScopeComparisonChart } from "./ScopeComparisonChart";

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.07 } },
};

const gridItemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
};

export function DashboardView() {
    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6">
            <DashboardHeader />

            <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                variants={gridVariants}
                initial="hidden"
                animate="show">
                {METRIC_CARDS.map((card) => (
                    <motion.div key={card.id} variants={gridItemVariants}>
                        <MetricCard data={card} />
                    </motion.div>
                ))}
            </motion.div>

            <div className="grid grid-cols-12 items-stretch gap-6">
                <div className="col-span-12 flex flex-col gap-6 lg:col-span-8">
                    <EmissionsTrendChart data={EMISSIONS_TREND} />
                    <FacilityTable rows={FACILITY_ROWS} />
                </div>

                <div className="col-span-12 flex min-h-0 lg:col-span-4">
                    <RecentActivity items={RECENT_ACTIVITIES} className="w-full" />
                </div>

                <div className="col-span-12 grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                    <Scope1Breakdown fuels={SCOPE1_FUELS} />
                    <Scope2Donut segments={SCOPE2_SEGMENTS} />
                </div>

                <div className="col-span-12">
                    <ScopeComparisonChart data={SCOPE_COMPARISON} />
                </div>
            </div>

            <AiAssistantFAB />
        </div>
    );
}
