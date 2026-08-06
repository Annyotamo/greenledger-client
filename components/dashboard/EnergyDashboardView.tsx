"use client";

import { motion } from "framer-motion";
import { MaterialIcon } from "@/components/icons/MaterialIcon";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import { useEnergyDashboard } from "@/lib/dashboard/hooks";
import { AiAssistantFAB } from "./AiAssistantFAB";
import { BoilerFuelMix } from "./BoilerFuelMix";
import { CaptiveGenerationChart } from "./CaptiveGenerationChart";
import { EnergyHeader } from "./EnergyHeader";
import { EnergyHierarchyChart } from "./EnergyHierarchyChart";
import { EnergyMixDonut } from "./EnergyMixDonut";
import { EnergySourceTree } from "./EnergySourceTree";
import { EnergyTrendChart } from "./EnergyTrendChart";
import { FacilityEnergyTable } from "./FacilityEnergyTable";
import { MetricCard } from "./MetricCard";

const gridVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06 } },
};

const gridItemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
};

export function EnergyDashboardView() {
    const { data, isLoading, isError, error, refetch } = useEnergyDashboard();

    if (isLoading) {
        return <EnergyDashboardSkeleton />;
    }

    if (isError || !data) {
        return (
            <div className="relative mx-auto max-w-[1400px] space-y-6">
                <EnergyHeader />
                <Card className="border-error/30 bg-error-container/10 p-8 text-center">
                    <CardBody className="flex flex-col items-center justify-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-error/10 text-error">
                            <MaterialIcon name="warning" size="md" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-headline-sm font-semibold text-primary">
                                Failed to load Energy Dashboard
                            </h3>
                            <p className="font-mono text-xs text-on-surface-variant max-w-md mx-auto">
                                {error?.message || "An unexpected error occurred while fetching tenant energy data."}
                            </p>
                        </div>
                        <Button onClick={() => refetch()} variant="primary" size="md" className="mt-2">
                            <MaterialIcon name="refresh" size="sm" />
                            Retry Loading
                        </Button>
                    </CardBody>
                </Card>
            </div>
        );
    }

    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6">
            <EnergyHeader facilitiesCount={data.facilities.length} />

            {/* 4 Metric Cards */}
            <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
                variants={gridVariants}
                initial="hidden"
                animate="show">
                {data.metricCards.map((card) => (
                    <motion.div key={card.id} variants={gridItemVariants} className="h-full">
                        <MetricCard data={card} />
                    </motion.div>
                ))}
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-12 items-stretch gap-6">
                {/* Monthly Trend Chart */}
                <div className="col-span-12 lg:col-span-8">
                    <EnergyTrendChart data={data.monthlyTrends} />
                </div>

                {/* Energy Mix Donut */}
                <div className="col-span-12 lg:col-span-4">
                    <EnergyMixDonut segments={data.energyMixSegments} totalMwh={data.energyMixTotalMwh} />
                </div>

                {/* Hierarchy & Source Tree */}
                <div className="col-span-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <EnergyHierarchyChart items={data.energyHierarchy} />
                    <EnergySourceTree nodes={data.energySourceTree} />
                </div>

                {/* Captive Generation & Fuel Mix */}
                <div className="col-span-12 grid grid-cols-1 gap-6 xl:grid-cols-[7fr_5fr]">
                    <CaptiveGenerationChart items={data.captiveGenerationSources} />
                    <BoilerFuelMix items={data.boilerFuelMix} />
                </div>

                {/* Facility Energy Summaries */}
                <div className="col-span-12">
                    <FacilityEnergyTable facilities={data.facilities} />
                </div>
            </div>

            <AiAssistantFAB />
        </div>
    );
}

function EnergyDashboardSkeleton() {
    return (
        <div className="relative mx-auto max-w-[1400px] space-y-6 animate-pulse">
            <div className="h-16 w-3/4 rounded-lg bg-surface-container-high/60" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-32 rounded-lg bg-surface-container-high/60" />
                ))}
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 h-80 rounded-lg bg-surface-container-high/60 lg:col-span-8" />
                <div className="col-span-12 h-80 rounded-lg bg-surface-container-high/60 lg:col-span-4" />
                <div className="col-span-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <div className="h-80 rounded-lg bg-surface-container-high/60" />
                    <div className="h-80 rounded-lg bg-surface-container-high/60" />
                </div>
                <div className="col-span-12 h-64 rounded-lg bg-surface-container-high/60" />
            </div>
        </div>
    );
}
